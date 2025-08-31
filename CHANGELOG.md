# Changelog

All notable changes to the Whot card library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive LLM-friendly documentation
- Module dependency graph documentation
- Machine-readable API summary
- Architecture documentation
- Code map and glossary

## [0.1.0] - 2024-01-XX

### Added
- Initial release of Whot card library
- Complete deck management with 54-card composition
- Dual rendering backends (template and programmatic)
- Seeded random number generator for deterministic shuffling
- Theme system with full customization
- SVG rendering with accessibility support
- Grid rendering for multiple cards
- JSON serialization/deserialization
- Comprehensive TypeScript type definitions
- Unit tests with high coverage
- Example UI demonstrating all features
- Production build pipeline with minification and obfuscation
- ESLint and Prettier configuration
- Google TypeScript Style Guide compliance

### Features
- **Deck Management**: Create, shuffle, draw, deal, and reset decks
- **Multiple Decks**: Support for combining multiple decks
- **Custom Whot Labels**: Configurable labels for Whot cards
- **Deterministic Shuffling**: Reproducible shuffling with seeded RNG
- **Template Rendering**: Pixel-perfect SVG using embedded templates
- **Programmatic Rendering**: Dynamic SVG generation for flexibility
- **Theme Customization**: Full control over card appearance
- **Accessibility**: ARIA-compliant SVG output
- **Grid Layout**: Render multiple cards in configurable grids
- **Serialization**: Save and restore deck state
- **Browser & Node.js**: Cross-platform compatibility

### Technical Details
- TypeScript strict mode
- ES2020 target with ESM and CommonJS outputs
- Rollup bundler with Terser minification
- Optional JavaScript obfuscation
- Vitest testing framework with jsdom
- Source maps and type declarations
- Comprehensive error handling
- Performance optimizations

### Documentation
- Complete API reference
- Architecture overview
- Usage examples
- Theme customization guide
- Browser compatibility notes
- Development setup instructions
