import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const eventPath = process.argv[2] || process.env.GITHUB_EVENT_PATH;
if (!eventPath) throw new Error("Missing repository_dispatch event payload");
const event = JSON.parse(await readFile(eventPath, "utf8"));
const payload = event.client_payload ?? {};

function requiredString(name, value) {
  if (typeof value !== "string" || !value.trim()) throw new Error("Missing " + name);
  return value.trim();
}

function parseVersion(value) {
  const match = String(value).match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!match) return null;
  return {
    parts: [Number(match[1]), Number(match[2]), Number(match[3])],
    prerelease: match[4] ?? "",
  };
}

function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);
  if (!a || !b) return null;
  for (let index = 0; index < 3; index += 1) {
    if (a.parts[index] !== b.parts[index]) return a.parts[index] > b.parts[index] ? 1 : -1;
  }
  if (a.prerelease === b.prerelease) return 0;
  if (!a.prerelease) return 1;
  if (!b.prerelease) return -1;
  const leftParts = a.prerelease.split(".");
  const rightParts = b.prerelease.split(".");
  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    if (leftParts[index] === undefined) return -1;
    if (rightParts[index] === undefined) return 1;
    if (leftParts[index] === rightParts[index]) continue;
    const leftNumber = /^\d+$/.test(leftParts[index]);
    const rightNumber = /^\d+$/.test(rightParts[index]);
    if (leftNumber && rightNumber) return Number(leftParts[index]) > Number(rightParts[index]) ? 1 : -1;
    if (leftNumber !== rightNumber) return leftNumber ? -1 : 1;
    return leftParts[index] > rightParts[index] ? 1 : -1;
  }
  return 0;
}

function compatibility(value) {
  return ["MZ", "MV", "MZ/MV"].includes(value) ? value : "";
}

function safeFileName(value) {
  if (typeof value !== "string" || !value.trim()) throw new Error("Release file path is empty");
  const normalized = value.replaceAll("\\", "/");
  if (normalized.startsWith("/") || normalized.split("/").some((part) => part === ".." || part === ".")) {
    throw new Error("Unsafe release file path: " + value);
  }
  return normalized;
}

function inferCompatibility(sourceText) {
  const targets = new Set([...sourceText.matchAll(/^\s*\*\s*@target\s+(MZ|MV)\b/gm)].map((match) => match[1]));
  if (targets.has("MZ") && targets.has("MV")) return "MZ/MV";
  if (targets.has("MZ")) return "MZ";
  if (targets.has("MV")) return "MV";
  return "Unknown";
}

function inferDescription(sourceText) {
  const value = sourceText.match(/^\s*\*\s*@plugindesc\s+(.+)$/m)?.[1]?.trim() ?? "";
  return value.replace(/^\[v[^\]]+\]\s*/, "").replace(/^v\s*\d+(?:\.\d+){0,2}\s*/, "").trim();
}

function inferLicense(sourceText) {
  return sourceText.match(/^\s*\*\s*@license\s+(.+)$/m)?.[1]?.trim() ?? "";
}

function replaceGeneratedTable(readme, rows) {
  const start = "<!-- plugin-directory:start -->";
  const end = "<!-- plugin-directory:end -->";
  const startIndex = readme.indexOf(start);
  const endIndex = readme.indexOf(end);
  if (startIndex < 0 || endIndex < startIndex) {
    throw new Error("README.md is missing the generated plugin-directory markers");
  }
  const table = [
    start,
    "| Plugin | Version | RPG Maker | Maturity |",
    "|--------|---------|-----------|----------|",
    ...rows,
    end,
  ].join("\n");
  return readme.slice(0, startIndex) + table + readme.slice(endIndex + end.length);
}

const slug = requiredString("slug", payload.slug);
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error("Invalid plugin slug: " + slug);
const name = requiredString("name", payload.name);
const shortName = requiredString("shortName", payload.shortName);
const version = requiredString("version", payload.version);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) throw new Error("Invalid version: " + version);
const tagName = requiredString("tagName", payload.tagName);
if (tagName !== "v" + version) throw new Error("Release tag does not match version: " + tagName);
const repository = requiredString("repository", payload.repository);
if (!/^SpaceFoon\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error("Unexpected plugin repository: " + repository);
const releaseZipUrl = requiredString("releaseZipUrl", payload.releaseZipUrl);
const expectedZipPrefix = "https://github.com/" + repository + "/releases/download/" + tagName + "/";
if (!releaseZipUrl.startsWith(expectedZipPrefix)) throw new Error("Release ZIP URL does not match the plugin tag");
const inputFiles = Array.isArray(payload.files) ? payload.files.map(safeFileName) : [];
const jsFiles = [...new Set(inputFiles.filter((file) => /\.js$/i.test(file)))];
if (jsFiles.length === 0) throw new Error("The release payload contains no JavaScript files");

const repositoryUrl = "https://github.com/" + repository;
const updatedAt = new Date().toISOString();
const releaseFiles = [];
for (const fileName of jsFiles) {
  const encodedPath = fileName.split("/").map(encodeURIComponent).join("/");
  const url = "https://raw.githubusercontent.com/" + repository + "/" + tagName + "/" + encodedPath;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not read " + fileName + " at " + tagName + ": HTTP " + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  releaseFiles.push({
    name: fileName,
    url,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    sourceText: /\.js$/i.test(fileName) ? bytes.toString("utf8") : "",
  });
}

const primary = releaseFiles.find((file) => path.posix.basename(file.name) === shortName + ".js") ?? releaseFiles[0];
const oldCatalog = JSON.parse(await readFile("plugins.json", "utf8"));
if (oldCatalog.schemaVersion !== 1 || !Array.isArray(oldCatalog.plugins)) {
  throw new Error("plugins.json has an unsupported format");
}
const index = oldCatalog.plugins.findIndex((plugin) => plugin.slug === slug);
const previous = index >= 0 ? oldCatalog.plugins[index] : null;
if (previous) {
  const versionComparison = compareVersions(version, previous.version);
  if (versionComparison === null) throw new Error("Could not compare release version with directory version");
  if (versionComparison < 0) {
    throw new Error("Refusing to replace directory v" + previous.version + " with older release " + tagName);
  }
  if (versionComparison === 0 && previous.releaseTag === tagName) {
    console.log("Directory already contains " + slug + " " + tagName);
    process.exit(0);
  }
}
const firstSource = releaseFiles.find((file) => file.sourceText)?.sourceText ?? "";
const inferred = compatibility(payload.compatibility);
const maturityValues = ["prod-ready", "not-prod-ready", "unreviewed"];
const maturity = previous?.maturity && maturityValues.includes(previous.maturity)
  ? previous.maturity
  : "unreviewed";

const plugin = previous ?? {
  slug,
  name,
  shortName,
  description: payload.description || inferDescription(firstSource) || name,
  version,
  category: payload.category || "Other",
  compatibility: inferred || compatibility(payload.inferredCompatibility) || inferCompatibility(firstSource),
  tags: Array.isArray(payload.tags) ? payload.tags : [],
  repository,
  repositoryUrl,
  downloadUrl: primary.url,
  documentationUrl: repositoryUrl + "#readme",
  license: payload.license || inferLicense(firstSource) || "See repository",
  updatedAt,
  maturity,
  isNew: false,
  isFeatured: false,
  features: Array.isArray(payload.features) ? payload.features : [],
  installation: [
    "Download " + path.posix.basename(primary.name) + ".",
    "Place it in your project's js/plugins folder.",
    "Enable " + name + " in Plugin Manager.",
  ],
};

const releaseDescription =
  (typeof payload.description === "string" && payload.description.trim()) ||
  inferDescription(firstSource);
const releaseLicense =
  (typeof payload.license === "string" && payload.license.trim()) ||
  inferLicense(firstSource);

plugin.name = name;
plugin.shortName = shortName;
plugin.repository = repository;
plugin.repositoryUrl = repositoryUrl;
plugin.version = version;
plugin.maturity = maturity;
plugin.releaseTag = tagName;
plugin.releaseZipUrl = releaseZipUrl;
plugin.downloadUrl = primary.url;
plugin.updatedAt = updatedAt;
plugin.files = releaseFiles.map(({ name: fileName, url, sha256 }) => ({ name: fileName, url, sha256 }));
if (releaseDescription) plugin.description = releaseDescription;
if (releaseLicense) plugin.license = releaseLicense;
if (previous && inferred && payload.compatibilityConfirmed === true) {
  plugin.compatibility = inferred;
}
if (!previous && !plugin.compatibility) {
  plugin.compatibility = compatibility(payload.inferredCompatibility) || inferCompatibility(firstSource);
}
if (!previous && !plugin.description) {
  plugin.description = inferDescription(firstSource) || name;
}
if (!previous && !plugin.license) {
  plugin.license = inferLicense(firstSource);
}

const oldExtras = Array.isArray(previous?.extraDownloads) ? previous.extraDownloads : [];
const releaseBasenames = new Set(releaseFiles.map((file) => path.posix.basename(file.name).toLowerCase()));
const labelsByBasename = new Map();
for (const extra of oldExtras) {
  try {
    labelsByBasename.set(path.posix.basename(new URL(extra.url).pathname).toLowerCase(), extra.label);
  } catch {}
}
const releaseExtras = releaseFiles
  .filter((file) => file.name !== primary.name)
  .map((file) => ({
    label: labelsByBasename.get(path.posix.basename(file.name).toLowerCase()) || path.posix.basename(file.name),
    url: file.url,
  }));
const retainedExtras = oldExtras.filter((extra) => {
  try {
    return !releaseBasenames.has(path.posix.basename(new URL(extra.url).pathname).toLowerCase());
  } catch {
    return true;
  }
});
plugin.extraDownloads = [...releaseExtras, ...retainedExtras];

if (index >= 0) oldCatalog.plugins[index] = plugin;
else oldCatalog.plugins.push(plugin);
oldCatalog.updatedAt = updatedAt;
oldCatalog.plugins.sort((left, right) => left.name.localeCompare(right.name));

const readme = await readFile("README.md", "utf8");
const rows = oldCatalog.plugins.map((item) => {
  const status = item.maturity === "prod-ready"
    ? "Prod ready"
    : item.maturity === "not-prod-ready"
      ? "Not prod ready"
      : "Unreviewed";
  return "| [" + item.name + "](" + item.repositoryUrl + ") | " + item.version + " | " + item.compatibility + " | " + status + " |";
});
await writeFile("plugins.json", JSON.stringify(oldCatalog, null, 2) + "\n", "utf8");
await writeFile("README.md", replaceGeneratedTable(readme, rows), "utf8");
console.log("Updated " + slug + " to " + tagName + " in plugins.json");
