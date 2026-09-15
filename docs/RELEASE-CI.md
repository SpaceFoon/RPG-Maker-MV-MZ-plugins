# Plugin release CI

Reusable workflow that every Fugs plugin repo calls on a `v*` tag.

## What it does

1. Packages listed plugin files into `{shortName}-v{version}.zip`
2. Writes plain-text `INSTALL.txt` (install steps + README + LICENSE)
3. Publishes a GitHub Release with that zip
4. Opens a PR on `SpaceFoon/fugs-plugins` that bumps `version`, `updatedAt`, and `releaseZipUrl` for the matching catalog `slug`

## Secret

Create a fine-grained PAT (or classic PAT) with:

- **Contents: Read and write** and **Pull requests: Read and write** on `SpaceFoon/fugs-plugins`

Add it to **each plugin repository** as Actions secret:

`FUGS_SITE_SYNC_TOKEN`

(Reusable workflows receive secrets from the *caller* repo, not from this umbrella.)

Org-level Actions secrets work too if every plugin repo can inherit them.

## Caller workflow template

Add `.github/workflows/release.yml` in a plugin repo:

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
      files: |
        FugsExample.js
        LICENSE
        README.md
      install_notes: |
        Enable FugsExample in Plugin Manager.
    secrets:
      FUGS_SITE_SYNC_TOKEN: ${{ secrets.FUGS_SITE_SYNC_TOKEN }}
```

Multi-file packs (MultiTrack) list every satellite + docs + optional bundle under `files:`.

## How to cut a release

```bash
git tag v1.2.0
git push origin v1.2.0
```

Or run **Actions → Release → Run workflow** and enter `1.2.0`.

## Catalog contract

The site entry in `artifacts/rpg-plugins/src/data/plugins.ts` must already exist with the given `slug`. The sync job updates:

- `version`
- `updatedAt` (UTC ISO)
- `releaseZipUrl` (inserts if missing)

It will **fail** if the slug is missing — add new plugins to the catalog first (as with FugsChatBubbles).
