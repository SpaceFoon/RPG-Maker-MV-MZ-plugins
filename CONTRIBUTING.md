# Contributing to RPG Maker MV/MZ Plugins

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include as many details as possible using the bug report template.

**Bug reports should include:**
- A clear and descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- RPG Maker version (MV/MZ)
- Plugin version
- Environment details
- Screenshots or error logs if applicable

### Suggesting Features

Feature requests are welcome! Use the feature request template and provide:
- A clear description of the feature
- The problem it solves
- Proposed implementation (if you have ideas)
- Any alternatives you've considered

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes** (see commit message guidelines)
6. **Push to your fork** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## Getting Started

### Prerequisites

- Basic knowledge of JavaScript
- Familiarity with RPG Maker MV/MZ plugin system
- Git for version control

### Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/SpaceFoon/RPG-Maker-MV-MZ-plugins.git
   cd RPG-Maker-MV-MZ-plugins
   ```

2. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Make Changes**: Edit files as needed
2. **Test**: Test your changes in RPG Maker MV/MZ
3. **Validate**: Ensure JavaScript syntax is valid
4. **Document**: Update documentation if needed
5. **Commit**: Write clear commit messages
6. **Push**: Push your changes to your fork
7. **Pull Request**: Create a PR with a clear description

## Coding Standards

### JavaScript Style

- Use consistent indentation (2 spaces or 4 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code style in the repository

### Plugin Structure

RPG Maker plugins should follow this general structure:

```javascript
/*:
 * @plugindesc [MV/MZ] Plugin Description
 * @author Your Name
 *
 * @param ParameterName
 * @desc Parameter description
 * @default default_value
 *
 * @help
 * Plugin help text goes here.
 */

(function() {
    'use strict';
    
    // Plugin code here
    
})();
```

### Documentation

- Include clear plugin descriptions
- Document all parameters
- Provide usage examples
- Add help text for users

## Commit Messages

Write clear, concise commit messages:

### Format

```
<type>: <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat: Add new dialog system plugin

Implements a custom dialog system with typewriter effect
and character portraits.

Closes #123
```

```
fix: Resolve menu crash on item use

Fixed null pointer exception when using items with
undefined effects.

Fixes #456
```

## Pull Request Process

1. **Update Documentation**: Ensure README and other docs are updated
2. **Test Thoroughly**: Test in both MV and MZ if applicable
3. **Update Changelog**: Add notes about your changes
4. **Fill PR Template**: Complete all sections of the PR template
5. **Link Issues**: Reference related issues
6. **Request Review**: Wait for maintainer review
7. **Address Feedback**: Make requested changes promptly
8. **Merge**: Once approved, your PR will be merged

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Added/updated comments where needed
- [ ] Updated documentation
- [ ] Changes generate no warnings
- [ ] Tested thoroughly
- [ ] All tests pass
- [ ] PR title is clear and descriptive
- [ ] PR description explains the changes

## Questions?

If you have questions, feel free to:
- Open a discussion on GitHub
- Comment on related issues
- Reach out to maintainers

Thank you for contributing! 🎮✨
