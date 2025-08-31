# Module Dependency Graph

## Overview

This document shows the dependency relationships between modules in the Whot card library. Understanding these dependencies helps with navigation, debugging, and extension development.

## Dependency Graph

```
src/
├── index.ts                    # Main entry point
│   ├── types.ts               # Type definitions
│   ├── deck.ts                # Deck class
│   ├── rng.ts                 # Random number generator
│   ├── render/render-card.ts  # Main renderer
│   └── version.ts             # Version constant
│
├── types.ts                   # Core type definitions
│   └── (no dependencies)
│
├── deck.ts                    # Deck management
│   ├── types.ts               # Uses Card, DeckOptions, etc.
│   ├── rng.ts                 # Uses SeededRNG for shuffling
│   └── render/layout.ts       # Uses DEFAULT_THEME, DECK_COMPOSITION
│
├── rng.ts                     # Random number generator
│   └── (no dependencies)
│
├── render/
│   ├── render-card.ts         # Main rendering entry point
│   │   ├── types.ts           # Uses Card, RenderOptions, etc.
│   │   ├── assets/templates.ts # Uses SVG templates
│   │   ├── layout.ts          # Uses DEFAULT_THEME, mergeTheme
│   │   ├── svg.ts             # Uses SVG utilities
│   │   └── suit-symbols.ts    # Uses symbol generators
│   │
│   ├── layout.ts              # Theme and layout constants
│   │   └── types.ts           # Uses WhotTheme, Suit
│   │
│   ├── svg.ts                 # SVG manipulation utilities
│   │   └── (no dependencies)
│   │
│   └── suit-symbols.ts        # Programmatic symbol generators
│       └── types.ts           # Uses Suit
│
├── assets/
│   └── templates.ts           # SVG template constants
│       └── (no dependencies)
│
└── version.ts                 # Version constant
    └── (no dependencies)
```

## Detailed Dependencies

### Core Modules

#### `src/index.ts`
**Purpose**: Main entry point, exports public API
**Dependencies**:
- `types.ts` - Re-exports all public types
- `deck.ts` - Exports Deck class
- `rng.ts` - Exports SeededRNG and createRNG
- `render/render-card.ts` - Exports renderCard and renderGrid
- `version.ts` - Exports VERSION constant

#### `src/types.ts`
**Purpose**: All TypeScript type definitions
**Dependencies**: None
**Exports**:
- `Suit` type
- `Card` interface
- `DeckOptions` interface
- `WhotTheme` interface
- `RenderOptions` interface
- `DealOptions` interface

#### `src/deck.ts`
**Purpose**: Deck class implementation
**Dependencies**:
- `types.ts` - Uses Card, DeckOptions, WhotTheme
- `rng.ts` - Uses SeededRNG for shuffling
- `render/layout.ts` - Uses DEFAULT_THEME, DECK_COMPOSITION
**Exports**: `Deck` class

#### `src/rng.ts`
**Purpose**: Seeded random number generator
**Dependencies**: None
**Exports**: `SeededRNG` class, `createRNG` function

### Rendering System

#### `src/render/render-card.ts`
**Purpose**: Main rendering entry point
**Dependencies**:
- `types.ts` - Uses Card, RenderOptions, WhotTheme, Suit
- `assets/templates.ts` - Uses SVG_TEMPLATES for template backend
- `layout.ts` - Uses DEFAULT_THEME, mergeTheme
- `svg.ts` - Uses SVG manipulation utilities
- `suit-symbols.ts` - Uses symbol generators for programmatic backend
**Exports**: `renderCard`, `renderGrid` functions

#### `src/render/layout.ts`
**Purpose**: Theme and layout constants
**Dependencies**:
- `types.ts` - Uses WhotTheme, Suit
**Exports**: `DEFAULT_THEME`, `mergeTheme`, `DECK_COMPOSITION`

#### `src/render/svg.ts`
**Purpose**: SVG manipulation utilities
**Dependencies**: None
**Exports**: SVG helper functions

#### `src/render/suit-symbols.ts`
**Purpose**: Programmatic suit symbol generators
**Dependencies**:
- `types.ts` - Uses Suit
**Exports**: Symbol renderer functions

#### `src/assets/templates.ts`
**Purpose**: SVG template constants
**Dependencies**: None
**Exports**: `SVG_TEMPLATES`, individual template constants

### Utility Modules

#### `src/version.ts`
**Purpose**: Library version constant
**Dependencies**: None
**Exports**: `VERSION` constant

## Dependency Flow

### Deck Creation Flow
```
index.ts → deck.ts → types.ts
                ↓
            rng.ts (for shuffling)
                ↓
        render/layout.ts (for theme/composition)
```

### Rendering Flow
```
index.ts → render/render-card.ts → types.ts
                              ↓
                          assets/templates.ts (template backend)
                              ↓
                          render/suit-symbols.ts (programmatic backend)
                              ↓
                          render/layout.ts (theme)
                              ↓
                          render/svg.ts (utilities)
```

### Type System Flow
```
types.ts → (used by all modules)
```

## Circular Dependencies

**None detected** - The library has a clean, acyclic dependency graph.

## Module Responsibilities

### Data Layer
- `types.ts` - Type definitions
- `rng.ts` - Random number generation
- `version.ts` - Version information

### Business Logic Layer
- `deck.ts` - Deck management and operations
- `render/layout.ts` - Theme and composition logic

### Presentation Layer
- `render/render-card.ts` - Main rendering logic
- `render/svg.ts` - SVG utilities
- `render/suit-symbols.ts` - Symbol generation
- `assets/templates.ts` - Template storage

### Integration Layer
- `index.ts` - Public API exports

## Extension Points

### Adding New Suits
1. Update `types.ts` - Add to `Suit` type
2. Update `assets/templates.ts` - Add SVG template
3. Update `render/suit-symbols.ts` - Add symbol generator
4. Update `render/layout.ts` - Add to composition

### Adding New Renderers
1. Create new renderer file in `render/`
2. Update `render/render-card.ts` - Add backend selection
3. Update `types.ts` - Add to renderer options

### Adding New Themes
1. Update `types.ts` - Extend `WhotTheme`
2. Update `render/layout.ts` - Update `mergeTheme`
3. Update rendering functions - Apply theme

## Testing Dependencies

### Test Files
- `tests/deck.spec.ts` - Tests `deck.ts`
- `tests/render.spec.ts` - Tests `render/render-card.ts`
- `tests/rng.spec.ts` - Tests `rng.ts`

### Test Dependencies
- `vitest.config.ts` - Test configuration
- `jsdom` - DOM testing environment

## Build Dependencies

### Configuration Files
- `package.json` - Project metadata and scripts
- `tsconfig.json` - TypeScript configuration
- `rollup.config.mjs` - Build configuration
- `.eslintrc.cjs` - Linting configuration
- `.prettierrc.json` - Formatting configuration

### Build Flow
```
Source files → TypeScript → Rollup → Minification → Output
```

## Import Patterns

### Internal Imports
```typescript
// Relative imports within src/
import { Card } from './types';
import { renderCard } from './render/render-card';
```

### External Imports
```typescript
// Library exports
import { Deck, renderCard } from '@acme/whot';
```

### Test Imports
```typescript
// Test imports
import { describe, it, expect } from 'vitest';
import { Deck } from '../src/deck';
```

## Module Size and Complexity

### Small Modules (< 100 lines)
- `version.ts` - 1 line
- `rng.ts` - ~50 lines
- `svg.ts` - ~80 lines

### Medium Modules (100-300 lines)
- `types.ts` - ~100 lines
- `layout.ts` - ~150 lines
- `suit-symbols.ts` - ~200 lines
- `templates.ts` - ~250 lines

### Large Modules (> 300 lines)
- `deck.ts` - ~400 lines
- `render-card.ts` - ~350 lines

## Performance Considerations

### Bundle Size Impact
- `assets/templates.ts` - Largest module (SVG strings)
- `render/suit-symbols.ts` - Medium size (symbol definitions)
- Other modules - Small size

### Runtime Performance
- `rng.ts` - Critical for shuffling performance
- `render/render-card.ts` - Critical for rendering performance
- `deck.ts` - Critical for deck operations

### Memory Usage
- Template backend - Higher memory (SVG strings)
- Programmatic backend - Lower memory (generated SVG)
