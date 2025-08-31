# Contributing to Whot Card Library

Thank you for your interest in contributing to the Whot card library! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
git clone <repository-url>
cd whot
npm install
```

### Development Commands
```bash
npm run dev          # Watch mode development
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run example      # Start demo application
```

## Code Style

### TypeScript
- Use strict mode (enforced by `tsconfig.json`)
- Follow Google TypeScript Style Guide
- Use TSDoc comments for all public APIs
- Prefer explicit types over inference where clarity is needed

### ESLint Configuration
- Google TypeScript Style Guide rules
- Prettier integration
- Strict TypeScript rules
- Custom rules for project-specific needs

### Prettier Configuration
- 2-space indentation
- Single quotes
- Trailing commas
- Line length: 80 characters

## Testing

### Test Structure
- Unit tests in `tests/` directory
- Test files named `*.spec.ts`
- Use Vitest with jsdom environment
- Aim for 95%+ coverage on core functionality

### Running Tests
```bash
npm run test              # Run all tests
npm run test:coverage     # Run with coverage report
npm run test:watch        # Watch mode
```

### Writing Tests
```typescript
import { describe, it, expect } from 'vitest';
import { Deck } from '../src/deck';

describe('Deck', () => {
  it('should create deck with correct composition', () => {
    const deck = new Deck();
    expect(deck.size()).toBe(54);
  });
});
```

## Architecture Guidelines

### Module Organization
- Keep modules focused and single-purpose
- Minimize dependencies between modules
- Use clear, descriptive file names
- Group related functionality together

### Rendering System
- Template backend: Use for pixel-perfect reproduction
- Programmatic backend: Use for maximum flexibility
- Both backends should produce equivalent functionality
- Maintain accessibility features in both backends

### Error Handling
- Use descriptive error messages
- Validate inputs early
- Provide helpful error context
- Use TypeScript for compile-time error prevention

## Adding New Features

### New Suits
1. Update `Suit` type in `src/types.ts`
2. Add SVG template to `src/assets/templates.ts`
3. Add symbol generator to `src/render/suit-symbols.ts`
4. Update deck composition in `src/render/layout.ts`
5. Add tests in `tests/render.spec.ts`

### New Themes
1. Extend `WhotTheme` interface in `src/types.ts`
2. Update `mergeTheme` function in `src/render/layout.ts`
3. Apply theme in rendering functions
4. Add theme tests

### New Renderers
1. Create renderer file in `src/render/`
2. Add to backend selection in `src/render/render-card.ts`
3. Update `RenderOptions` type
4. Add renderer-specific tests

## Documentation

### Code Documentation
- Use TSDoc for all public APIs
- Include examples in documentation
- Document edge cases and error conditions
- Keep documentation up to date with code changes

### User Documentation
- Update README.md for user-facing changes
- Update API.md for API changes
- Update examples for new features
- Add migration guides for breaking changes

## Pull Request Process

### Before Submitting
1. Ensure all tests pass
2. Run linting and formatting
3. Update documentation
4. Test in both browser and Node.js environments
5. Verify example application works

### Pull Request Guidelines
1. Use descriptive commit messages
2. Include tests for new functionality
3. Update relevant documentation
4. Provide clear description of changes
5. Reference related issues

### Review Process
1. Automated checks must pass
2. Code review by maintainers
3. Documentation review
4. Testing verification
5. Final approval and merge

## Release Process

### Version Bumping
```bash
bumpversion patch  # 0.1.0 → 0.1.1
bumpversion minor  # 0.1.0 → 0.2.0
bumpversion major  # 0.1.0 → 1.0.0
```

### Release Checklist
1. Update version in `src/version.ts`
2. Update CHANGELOG.md
3. Run full test suite
4. Build production bundles
5. Test example application
6. Create release tag
7. Publish to npm (if applicable)

## Issue Reporting

### Bug Reports
- Use the bug report template
- Include steps to reproduce
- Provide environment details
- Include error messages and stack traces
- Add minimal reproduction example

### Feature Requests
- Use the feature request template
- Describe the use case
- Explain expected behavior
- Consider implementation complexity
- Discuss alternatives

## Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow project conventions
- Ask questions when unsure

### Communication
- Use clear, concise language
- Provide context for questions
- Be patient with newcomers
- Share knowledge and resources
- Celebrate contributions

## Getting Help

### Resources
- README.md - Project overview and quickstart
- API.md - Complete API reference
- ARCHITECTURE.md - System design details
- CODEMAP.md - File organization guide
- Example application - Working implementation

### Support Channels
- GitHub Issues - Bug reports and feature requests
- GitHub Discussions - Questions and discussions
- Documentation - Self-service help

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
