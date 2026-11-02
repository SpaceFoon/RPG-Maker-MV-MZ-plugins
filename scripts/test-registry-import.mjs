// Integration test against isolated clones containing the two published tags.
// Usage: node scripts/test-registry-import.mjs <registry-importer.mjs> <clone-root>
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [importer, cloneRoot] = process.argv.slice(2);
if (!importer || !cloneRoot) throw Error('Provide the registry importer and isolated clone root');
const { verifyCatalog } = await import(pathToFileURL(path.resolve(importer)).href);
const catalog = JSON.parse(await readFile(new URL('../plugins.json', import.meta.url), 'utf8'));
const result = verifyCatalog(catalog, path.resolve(cloneRoot));
const manifests = new Map(result.manifests.map(item => [item.productId, item]));
assert.equal(manifests.get('fugs-multitrack')?.commit, '4d1bbd23832d384861aefd7b121b71c05f3c267f');
assert.equal(manifests.get('fugs-multitrack')?.files.length, 8);
assert.equal(manifests.get('fugs-chat-bubbles')?.commit, '16c29e4639081b29e7e5488b07f5cdb7d2b7610a');
assert.equal(manifests.get('fugs-chat-bubbles')?.files.length, 1);
for (const slug of ['fugs-master-volume', 'fugs-only-ogg-mv', 'fugs-opus-loop-tags', 'fugs-yep-galv-sprite-offset-fix']) {
  assert.ok(result.skipped.some(item => item.product === slug), `${slug} must remain pending`);
}
const altered = structuredClone(catalog);
altered.plugins.find(item => item.slug === 'fugs-multi-track-audio-ex').files[0].sha256 = '0'.repeat(64);
assert.ok(!verifyCatalog(altered, path.resolve(cloneRoot)).manifests.some(item => item.productId === 'fugs-multitrack'));
console.log('Registry import accepts both verified releases and rejects a changed digest; unreleased entries remain pending.');
