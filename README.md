# whotdeck

A TypeScript library for creating, managing, and rendering Whot playing cards with SVG templates and programmatic rendering capabilities.

## Features

- **Complete Whot Deck**: 54 cards per deck with proper suit composition
- **Dual Rendering Backends**: Template-based SVG rendering and programmatic generation
- **Deterministic Shuffling**: Seeded random number generation for reproducible results
- **Flexible Theming**: Customizable card appearance and layout
- **Accessibility**: ARIA-compliant SVG output with proper labels
- **Multiple Decks**: Support for combining multiple decks
- **Export Capabilities**: SVG export for cards and grids
- **CSS Isolation**: Automatic CSS class prefixing to prevent conflicts in grid rendering
- **TypeScript**: Full type safety with comprehensive type definitions

## Deck Composition

A single Whot deck contains exactly **54 cards**:

| Suit     | Numbers                                   | Count |
| -------- | ----------------------------------------- | ----- |
| Circle   | 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14   | 12    |
| Triangle | 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14   | 12    |
| Cross    | 1, 2, 3, 5, 7, 10, 11, 13, 14             | 9     |
| Square   | 1, 2, 3, 5, 7, 10, 11, 13, 14             | 9     |
| Star     | 1, 2, 3, 4, 5, 7, 8                       | 7     |
| Whot     | 5 identical cards (default label: "WHOT") | 5     |

## Installation

```bash
npm install whotdeck
```

## Quick Start

```typescript
import { Deck, renderCard } from 'whotdeck';

// Create a new deck
const deck = new Deck({
  numDecks: 1,
  whotLabel: 'WHOT',
  randomSeed: 123,
  renderer: 'template',
});

// Shuffle the deck
deck.shuffle();

// Draw a card
const [card] = deck.draw();

// Render the card as SVG
const svg = renderCard(card, { width: 200, className: 'card' });
document.querySelector('#app')!.innerHTML = svg as string;
```

## API Reference

### Deck Class

#### Constructor

```typescript
new Deck(options?: DeckOptions)
```

**Options:**

- `numDecks?: number` - Number of decks to include (default: 1)
- `whotLabel?: string` - Label for Whot cards (default: "WHOT")
- `randomSeed?: number | string` - Seed for deterministic shuffling
- `theme?: Partial<WhotTheme>` - Theme configuration
- `renderer?: 'template' | 'programmatic'` - Rendering backend

#### Methods

```typescript
// Reset deck to initial state
deck.reset(): void

// Shuffle deck (Fisher-Yates algorithm)
deck.shuffle(): void

// Draw cards from top of deck
deck.draw(n?: number): Card[]

// Deal cards to multiple players
deck.deal(opts: DealOptions): Card[][]

// Get current deck size
deck.size(): number

// Check if deck is empty
deck.isEmpty(): boolean

// Serialize deck to JSON
deck.toJSON(): string

// Create deck from JSON
Deck.fromJSON(json: string): Deck
```

### Rendering Functions

#### renderCard

```typescript
renderCard(card: Card, options?: RenderOptions): string | SVGElement
```

**Options:**

- `width?: number` - Override card width
- `height?: number` - Override card height
- `className?: string` - CSS class for SVG element
- `dataAttrs?: Record<string, string>` - Additional data attributes
- `asDom?: boolean` - Return SVGElement if true (browser only)
- `theme?: Partial<WhotTheme>` - Theme overrides
- `renderer?: 'template' | 'programmatic'` - Rendering backend

#### renderGrid

```typescript
renderGrid(cards: Card[], cols: number, options?: RenderOptions & { gap?: number }): string | SVGElement
```

**Additional Options:**

- `gap?: number` - Gap between cards in pixels

### Types

```typescript
type Suit = 'circle' | 'triangle' | 'square' | 'star' | 'cross' | 'whot';

interface Card {
  id: string; // Unique identifier
  suit: Suit; // Card suit
  label: string; // Display label (number or custom text)
}

interface WhotTheme {
  width: number;
  height: number;
  borderRadius: number;
  borderWidth: number;
  strokeColor: string;
  fillColor: string;
  cornerFontFamily: string;
  cornerFontSize: number;
  cornerInsetX: number;
  cornerInsetY: number;
  cornerSymbolSize: number;
  suitColors: Record<Suit, string>;
}
```

## Rendering Backends

### Template Backend (Default)

Uses embedded SVG templates for pixel-perfect rendering:

```typescript
const svg = renderCard(card, { renderer: 'template' });
```

**Features:**

- Exact visual fidelity to original templates
- Dynamic corner text replacement
- Preserved suit graphics and styling
- Optimized for quality

### Programmatic Backend

Generates SVG programmatically for maximum flexibility:

```typescript
const svg = renderCard(card, { renderer: 'programmatic' });
```

**Features:**

- Full theme customization
- Dynamic sizing and positioning
- No external dependencies
- Optimized for performance

## Theming

Customize card appearance with theme overrides:

```typescript
const customTheme = {
  width: 100,
  height: 140,
  strokeColor: '#ff0000',
  fillColor: '#ffffff',
  suitColors: {
    circle: '#e74c3c',
    triangle: '#3498db',
    square: '#2ecc71',
    star: '#f39c12',
    cross: '#9b59b6',
    whot: '#1abc9c',
  },
};

const svg = renderCard(card, { theme: customTheme });
```

## Deterministic Shuffling

Use seeds for reproducible deck shuffling:

```typescript
// Same seed = same shuffle order
const deck1 = new Deck({ randomSeed: 123 });
const deck2 = new Deck({ randomSeed: 123 });

deck1.shuffle();
deck2.shuffle();

// deck1 and deck2 will have identical card order
```

## Examples

### Basic Usage

```typescript
import { Deck, renderCard, renderGrid } from '@acme/whot';

// Create and shuffle deck
const deck = new Deck({ randomSeed: 'my-game-123' });
deck.shuffle();

// Draw and render cards
const cards = deck.draw(5);
const svg = renderGrid(cards, 3, { gap: 10 });
```

### Dealing to Players

```typescript
// Deal 5 cards to 4 players
const hands = deck.deal({ players: 4, cardsPerPlayer: 5 });

hands.forEach((hand, index) => {
  const handSvg = renderGrid(hand, 5, { gap: 5 });
  console.log(`Player ${index + 1}:`, handSvg);
});
```

### Custom Whot Labels

```typescript
// Create deck with custom Whot label
const deck = new Deck({ whotLabel: '20' });

// All Whot cards will display "20" instead of "WHOT"
```

### Multiple Decks

```typescript
// Create a game with 3 decks (162 total cards)
const deck = new Deck({ numDecks: 3 });
console.log(deck.size()); // 162
```

## Build Scripts

```bash
# Development
npm run dev          # Watch mode
npm run build:dev    # Development build

# Production
npm run build:prod   # Minified build
npm run build:prod:obf # Minified + obfuscated

# Testing
npm run test         # Run tests
npm run test:watch   # Watch mode tests

# Linting & Formatting
npm run lint         # ESLint
npm run format       # Prettier

# Example UI
npm run example      # Start Vite dev server
```

## Example UI

Run the interactive demo:

```bash
npm run example
```

This starts a Vite development server on http://localhost:3000 with a full-featured demo application.

### Alternative Ways to Run the Example

```bash
# From project root
npm run example

# Or directly from the example directory
cd examples/simple-ui
npm run dev

# Or build and serve the production version
npm run example:build
cd examples/simple-ui
npm run preview
```

**Note**: The example requires a modern browser with ES module support. Use the Vite dev server, not a static file server like PHP's built-in server.

The example UI demonstrates:

- Deck creation and management
- Shuffling and dealing
- Theme switching (Light/Dark/High Contrast)
- SVG export functionality
- Template vs Programmatic rendering
- Responsive design

## Browser Support

- Modern browsers with ES2020 support
- SVG rendering capabilities
- Optional: DOMParser for `asDom: true` option

## Development

### Project Structure

```
whot/
├── src/
│   ├── index.ts              # Main exports
│   ├── types.ts              # Type definitions
│   ├── deck.ts               # Deck class
│   ├── rng.ts                # Random number generator
│   ├── render/
│   │   ├── render-card.ts    # Main renderer
│   │   ├── layout.ts         # Theme and layout
│   │   ├── svg.ts            # SVG utilities
│   │   └── suit-symbols.ts   # Programmatic symbols
│   └── assets/
│       └── templates.ts      # SVG templates
├── tests/                    # Test files
├── examples/simple-ui/       # Demo application
└── dist/                     # Build output
```

### Testing

```bash
npm run test
```

Test coverage targets:

- Deck operations: ≥95%
- Rendering: ≥90%
- RNG: ≥95%

#### Template Validation

The library includes comprehensive template validation to ensure rendering accuracy:

```bash
# Run template validation tests
npm run test:templates
```

This validates that our rendering matches the original template files exactly, checking:
- CSS class preservation
- SVG namespace correctness
- Text replacement accuracy
- Suit-specific element structure
- Cross card namespace fixes

The validation covers all suits: circle, cross, square, triangle, star, and whot cards.

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following Google TypeScript Style Guide
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Versioning

This project uses [bumpversion](https://github.com/peritus/bumpversion) for version management. Configuration is in `.bumpversion.cfg`.

To bump version:

```bash
bumpversion patch  # 0.1.0 → 0.1.1
bumpversion minor  # 0.1.0 → 0.2.0
bumpversion major  # 0.1.0 → 1.0.0
```
