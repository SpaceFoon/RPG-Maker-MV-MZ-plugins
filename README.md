# RPG Maker MV/MZ Plugins

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Issues](https://img.shields.io/github/issues/SpaceFoon/RPG-Maker-MV-MZ-plugins)](https://github.com/SpaceFoon/RPG-Maker-MV-MZ-plugins/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/SpaceFoon/RPG-Maker-MV-MZ-plugins)](https://github.com/SpaceFoon/RPG-Maker-MV-MZ-plugins/pulls)

Welcome to Fug's RPG Maker MV/MZ plugins repository! This is a meta repository for managing all RPG Maker plugins, discussions, issues, and CI/CD pipelines.

## 📋 Overview

This repository serves as the central hub for:
- **Plugin Management**: Organizing and maintaining RPG Maker MV/MZ plugins
- **Issue Tracking**: Centralized location for bug reports and feature requests
- **Discussions**: Community discussions about plugins and development
- **CI/CD Pipeline**: Automated testing, validation, and deployment workflows

## 🎮 Available Plugins

### Audio Plugins

#### [FugsOpusMVMZ](https://github.com/SpaceFoon/FugsOpusMVMZ) ⭐
Use OGG OPUS files in RPG Maker MV/MZ with looping support!
- **Compatibility**: RPG Maker MV & MZ
- **Status**: Active
- **Stars**: 1

#### [FugsOnlyOggMV](https://github.com/SpaceFoon/FugsOnlyOggMV) ⭐
RPG Maker MV exports m4a files for mobile and web deployments. This plugin makes all audio exports OGG, a way better format.
- **Compatibility**: RPG Maker MV
- **Status**: Active
- **Stars**: 1

#### [FugMasterVolume](https://github.com/SpaceFoon/FugMasterVolume)
Master volume controls for developers and users in RMMV.
- **Compatibility**: RPG Maker MV
- **Status**: Active

#### [FugsMultiTrackAudioEX](https://github.com/SpaceFoon/FugsMultiTrackAudioEX) ⭐
Unlimited audio tracks and advanced audio management for RMMV.
- **Compatibility**: RPG Maker MV
- **Status**: Active
- **Stars**: 1

### Visual & UI Plugins

#### [FugsChatBubbles](https://github.com/SpaceFoon/FugsChatBubbles)
Customizable animated chat bubbles that stack for RMMV.
- **Compatibility**: RPG Maker MV
- **Status**: Active

### Compatibility Fixes

#### [FugsYEP-GalvSpriteOffsetFix](https://github.com/SpaceFoon/FugsYEP-GalvSpriteOffsetFix) ⭐
Fixes SpriteOffsetX error when using Yanfly's Sprite Offset plugin and Galv's Cam Control.
- **Compatibility**: RPG Maker MV
- **Status**: Active
- **Stars**: 1

## 🚀 Features

- Centralized issue tracking across all plugins
- Automated CI/CD pipelines for quality assurance
- Community-driven development and discussions
- Comprehensive documentation and guidelines

## 📁 Repository Structure

```
.
├── .github/              # GitHub configuration and workflows
│   ├── workflows/        # CI/CD workflows
│   └── ISSUE_TEMPLATE/   # Issue templates
├── plugins/              # Individual plugin directories (to be added)
└── docs/                 # Documentation (to be added)
```

## 📦 Installation

Each plugin has its own repository with detailed installation instructions. Generally:

1. Navigate to the plugin's repository (links above)
2. Download the `.js` file from the repository
3. Place it in your RPG Maker project's `js/plugins/` folder
4. Enable the plugin in the Plugin Manager
5. Configure parameters as needed

For detailed instructions, visit the individual plugin repositories.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to:
- Report bugs
- Suggest features
- Submit pull requests
- Follow code standards

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/SpaceFoon/RPG-Maker-MV-MZ-plugins/issues)
- **Discussions**: Join conversations in [GitHub Discussions](https://github.com/SpaceFoon/RPG-Maker-MV-MZ-plugins/discussions)

## 🔧 CI/CD Status

Legacy repository workflows are separate from release publishing. Fugs Chat Bubbles builds releases and updates the shared directory on the owner's PC.

## Shared plugin directory and website deployment

This repository is the shared plugin directory. `plugins.json` (schema version 1) stores reviewed plugin metadata, release tags, ZIP links, and tagged JavaScript files with SHA-256 checksums. The generated table below reflects that manifest.

Fugs Chat Bubbles updates this JSON and table directly from its Windows release watcher. The updater runs locally and pushes a normal Git commit with `[skip ci]`; it does not dispatch a GitHub Actions job or open a website PR. Existing maturity and presentation metadata are preserved. A failed push is retried by the watcher.

The production website at https://fugsplugins.com is deployed by `SpaceFoon/sitebase`, whose `scripts/deploy-sites.sh` uses `SpaceFoon/fugs-plugins` branch `master`, build directory `artifacts/rpg-plugins/dist/public`. The `/FugsAudioEx` subpath comes from `SpaceFoon/fugg-audio-plugin-site` branch `master`. This directory repository does not deploy the website.

The website integration that reads this manifest in the browser is pending separately. Publishing directory metadata alone does not prove the deployed website consumes it. The verified public website build on 2026-10-31 was `a8977af`. Only the owner performs production Sitebase deployments.

<!-- plugin-directory:start -->
| Plugin | Version | RPG Maker | Maturity |
| --- | --- | --- | --- |
| [Fugs MultiTrack Audio EX](https://github.com/SpaceFoon/FugsMultiTrackAudioEX) | 2.3.0 | MZ/MV | not-prod-ready |
| [Fugs Master Volume](https://github.com/SpaceFoon/FugMasterVolume) | 1.0.0 | MZ/MV | prod-ready |
| [Fugs Only OGG MV](https://github.com/SpaceFoon/FugsOnlyOggMV) | 1.0.0 | MV | prod-ready |
| [Fugs OGG Opus Loop Tags](https://github.com/SpaceFoon/FugsOpusMVMZ) | 1.0.0 | MZ/MV | prod-ready |
| [Fugs YEP/Galv SpriteOffset Fix](https://github.com/SpaceFoon/FugsYEP-GalvSpriteOffsetFix) | 1.0.0 | MV | prod-ready |
| [Fugs Chat Bubbles](https://github.com/SpaceFoon/FugsChatBubbles) | 1.0.2 | MV | not-prod-ready |
<!-- plugin-directory:end -->