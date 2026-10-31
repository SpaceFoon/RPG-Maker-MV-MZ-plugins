# Plugin release CI

Reusable release workflow for the Fugs plugin repositories. A tagged release updates the shared machine-readable directory in this repository.

## What it does

1. Packages the configured files into `{shortName}-v{version}.zip`.
2. Writes plain-text `INSTALL.txt` with install steps, README, and LICENSE.
3. Publishes a GitHub Release on the plugin repository.
4. Sends the release details to this repository's directory workflow.
5. The directory workflow adds or updates the entry in `plugins.json`, records release-pinned JavaScript URLs and SHA-256 hashes, and refreshes the README table.

The Fugs Plugins website fetches `plugins.json` directly, and LostAges `plugin-sync.sh pull` reads the same data.

## Secret

The calling plugin repository must have an Actions secret named:

`FUGS_SITE_SYNC_TOKEN`

Give the token **Contents: Read and write** access to `SpaceFoon/RPG-Maker-MV-MZ-plugins`. The directory workflow uses its own `GITHUB_TOKEN` to commit the update. The old private-site catalog PR is no longer part of this release flow.

## Caller workflow template

Add `.github/workflows/release.yml` to a plugin repository:

```yaml
name: Release

on:
  push:
    tags:
      - "v*"
  workflow_dispatch:
    inputs:
      version:
        description: Version without leading v (e.g. 1.0.0)
        required: true
        type: string

permissions:
  contents: write

jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.v.outputs.version }}
      tag_name: ${{ steps.v.outputs.tag_name }}
    steps:
      - id: v
        env:
          EVENT_NAME: ${{ github.event_name }}
          DISPATCH_VERSION: ${{ inputs.version }}
          REF_NAME: ${{ github.ref_name }}
        run: |
          set -euo pipefail
          if [ "$EVENT_NAME" = "workflow_dispatch" ]; then
            VER="${DISPATCH_VERSION#v}"
            echo "version=${VER}" >> "$GITHUB_OUTPUT"
            echo "tag_name=v${VER}" >> "$GITHUB_OUTPUT"
          else
            TAG="$REF_NAME"
            VER="${TAG#v}"
            echo "version=${VER}" >> "$GITHUB_OUTPUT"
            echo "tag_name=${TAG}" >> "$GITHUB_OUTPUT"
          fi

  release:
    needs: prepare
    uses: SpaceFoon/RPG-Maker-MV-MZ-plugins/.github/workflows/release-plugin.yml@main
    with:
      plugin_slug: fugs-example
      plugin_name: Fugs Example
      short_name: FugsExample
      version: ${{ needs.prepare.outputs.version }}
      tag_name: ${{ needs.prepare.outputs.tag_name }}
      category: Audio
      compatibility: MZ/MV
      files: |
        FugsExample.js
        LICENSE
        README.md
      install_notes: |
        Enable FugsExample in Plugin Manager.
    secrets:
      FUGS_SITE_SYNC_TOKEN: ${{ secrets.FUGS_SITE_SYNC_TOKEN }}
```

The `category` and `compatibility` inputs are optional. On every release, engine compatibility defaults to the RPG Maker `@target` headers in the tagged JavaScript files; provide `compatibility` to explicitly override that value. The directory also refreshes version, tag-pinned file URLs and hashes, description, license, and updated time. It preserves reviewed maturity, category, features, installation notes, and other curated fields. A new slug is inserted with maturity `unreviewed`, so a release never implies production readiness.

## How to cut a release

```bash
git tag v1.2.0
git push origin v1.2.0
```

Or run **Actions → Release → Run workflow** and enter `1.2.0`.

## Covered release paths

- Fugs MultiTrack Audio EX: tag workflow added in the plugin repository.
- Fugs Chat Bubbles: the local Windows release watcher updates `plugins.json` and the README table directly after publishing.
- Fugs Master Volume, Fugs Only OGG MV, Fugs OGG Opus Loop Tags, and Fugs YEP/Galv SpriteOffset Fix: reusable workflow callers in their plugin repositories.

For Chat Bubbles local release setup, see that repository's README.