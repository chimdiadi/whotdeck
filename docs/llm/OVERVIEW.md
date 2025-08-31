# LLM Overview: Whot Card Library

## Quick Start for LLMs

This is a TypeScript library for creating, managing, and rendering Whot playing cards. Whot is a Nigerian card game with a unique 54-card deck.

### Core Abstractions

1. **Deck**: Manages 54 cards with 6 suits (Circle, Triangle, Square, Star, Cross, Whot)
2. **Card**: Individual card with suit, number, and unique ID
3. **Renderer**: Two backends for SVG generation (Template vs Programmatic)

### 60-Second Usage

```typescript
import { Deck, renderCard } from '@acme/whot';

// Create and shuffle deck
const deck = new Deck({ randomSeed: 123 });
deck.shuffle();

// Draw and render a card
const [card] = deck.draw();
const svg = renderCard(card, { width: 200 });

// Display in browser
document.body.innerHTML = svg;
```

## Key Files to Understand

### Entry Points
- `src/index.ts` - Public API exports
- `src/types.ts` - All TypeScript interfaces
- `src/deck.ts` - Main Deck class implementation

### Rendering System
- `src/render/render-card.ts` - Main renderer (chooses backend)
- `src/assets/templates.ts` - SVG templates for pixel-perfect rendering
- `src/render/suit-symbols.ts` - Programmatic symbol generators

### Configuration
- `package.json` - Dependencies and build scripts
- `tsconfig.json` - TypeScript strict mode settings
- `rollup.config.mjs` - Production build pipeline

## Core Concepts

### Deck Composition
- **54 cards total** per deck
- **Circle/Triangle**: 12 cards each (1,2,3,4,5,7,8,10,11,12,13,14)
- **Square/Cross**: 9 cards each (1,2,3,5,7,10,11,13,14)
- **Star**: 7 cards (1,2,3,4,5,7,8)
- **Whot**: 5 identical cards (label: "WHOT")

### Rendering Backends

#### Template Backend (Default)
- Uses embedded SVG templates
- Replaces `<tspan>1</tspan>` with card numbers
- Pixel-perfect reproduction
- Larger bundle size

#### Programmatic Backend
- Generates SVG from scratch
- Full theme customization
- Smaller bundle size
- Slightly different appearance

### Key Methods

```typescript
// Deck operations
deck.shuffle()           // Randomize card order
deck.draw(n)             // Take n cards from top
deck.deal({players, cardsPerPlayer}) // Distribute to players
deck.reset()             // Restore all cards

// Rendering
renderCard(card, options)    // Single card SVG
renderGrid(cards, cols, options) // Multiple cards in grid
```

## Common Patterns

### Creating a Game
```typescript
const deck = new Deck({ numDecks: 1, whotLabel: 'WHOT' });
deck.shuffle();
const hands = deck.deal({ players: 4, cardsPerPlayer: 5 });
```

### Custom Theming
```typescript
const theme = {
  width: 100,
  height: 140,
  strokeColor: '#ff0000',
  suitColors: { circle: '#e74c3c' }
};
const svg = renderCard(card, { theme });
```

### Deterministic Shuffling
```typescript
const deck = new Deck({ randomSeed: 123 });
deck.shuffle(); // Same order every time
```

## Error Handling

The library throws descriptive errors for invalid operations:
- Drawing more cards than available
- Dealing insufficient cards
- Invalid theme configurations

## Browser vs Node.js

Most functionality works in both environments:
- `renderCard()` returns SVG string in both
- `renderCard(card, { asDom: true })` returns SVGElement (browser only)

## Testing Strategy

- **Unit tests**: Individual component testing
- **Coverage targets**: 95%+ for core functionality
- **Test files**: `tests/deck.spec.ts`, `tests/render.spec.ts`, `tests/rng.spec.ts`

## Build System

- **Development**: `npm run dev` (watch mode)
- **Production**: `npm run build:prod` (minified + obfuscated)
- **Testing**: `npm run test` (with coverage)
- **Example**: `npm run example` (demo application)

## Extension Points

### Adding New Suits
1. Update `Suit` type in `types.ts`
2. Add SVG template to `assets/templates.ts`
3. Add symbol generator to `suit-symbols.ts`
4. Update deck composition in `layout.ts`

### Custom Themes
1. Extend `WhotTheme` interface
2. Update `mergeTheme()` function
3. Apply in rendering functions

### New Renderers
1. Create backend file in `render/`
2. Add to backend selection logic
3. Update `RenderOptions` type

## Performance Notes

- **Template backend**: Fast string replacement, larger bundle
- **Programmatic backend**: Dynamic generation, smaller bundle
- **Seeded shuffling**: Deterministic but slightly slower
- **Theme merging**: Deep merge operation, cache for repeated use

## Common Questions

**Q: How do I change the Whot label?**
A: `new Deck({ whotLabel: '20' })`

**Q: How do I use multiple decks?**
A: `new Deck({ numDecks: 3 })`

**Q: How do I save/restore deck state?**
A: `deck.toJSON()` and `Deck.fromJSON(json)`

**Q: How do I customize card appearance?**
A: Use `theme` option in `renderCard()` or `DeckOptions`

**Q: How do I choose rendering backend?**
A: `renderCard(card, { renderer: 'programmatic' })`

## Related Documentation

- `API.md` - Complete API reference
- `ARCHITECTURE.md` - System design details
- `CODEMAP.md` - File organization guide
- `GLOSSARY.md` - Terminology definitions
