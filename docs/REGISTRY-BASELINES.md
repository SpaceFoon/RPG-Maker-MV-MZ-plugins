# Registry release baselines

Evidence checked 2026-11-02. These are historical checks, not a claim that tags cannot later move. Before importing, compare the current public release and tag again, fetch into an isolated clone, and rerun the importer. The importer itself validates local tagged bytes against the catalog; it does not independently prove a release was public.

| Release | Published release | Tag commit |
| --- | --- | --- |
| MultiTrack v2.3.0 | https://github.com/SpaceFoon/FugsMultiTrackAudioEX/releases/tag/v2.3.0 | `4d1bbd23832d384861aefd7b121b71c05f3c267f` |
| Chat Bubbles v1.1.0 | https://github.com/SpaceFoon/FugsChatBubbles/releases/tag/v1.1.0 | `16c29e4639081b29e7e5488b07f5cdb7d2b7610a` |

The GitHub release API reported both as published, non-draft and non-prerelease. For each catalog file, GitHub's contents API at the resolved commit returned a Git blob ID matching the local commit's blob ID. SHA-256 was calculated over the exact `git show <commit>:<file>` bytes. The existing Chat Bubbles catalog SHA-256 matched that calculation. MultiTrack's eight missing file hashes were added from those verified bytes; the release ZIP digest was not substituted for any individual file digest.

Master Volume, Only OGG, Opus Loop Tags and YEP/Galv SpriteOffset Fix had no published GitHub releases at this check. Their branch downloads and catalog versions are not evidence of a tagged release; they remain without release tags or hashes. Master Volume has an unrelated unpublished draft and it is not a release baseline.

To reproduce the integration check with isolated clones under one directory (without changing tags in working repositories):

```sh
node scripts/test-registry-import.mjs /path/to/fugs-plugins/scripts/plugin-sync/import-releases.mjs /path/to/isolated-clones
```

The clones must contain the two named public tags. This tests the current baseline and rejects a changed hash. Update the pinned expectations when a later verified release deliberately replaces either catalog entry.
