# Architecture

## Overview

The Whot card library is designed with a clean separation of concerns between deck management, rendering, and assets. The architecture supports two rendering backends while maintaining a unified API.

## Core Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Deck        │    │   Renderer      │    │    Assets       │
│                 │    │                 │    │                 │
│ • Card creation │───▶│ • Template      │───▶│ • SVG templates │
│ • Shuffling     │    │ • Programmatic  │    │ • Theme config  │
│ • Drawing       │    │ • Grid layout   │    │ • Layout consts │
│ • Dealing       │    │ • Accessibility │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Deck Management

The `Deck` class is the central component that manages card state and operations:

- **Composition**: Creates exactly 54 cards per deck with proper suit distribution
- **Shuffling**: Uses seeded RNG for deterministic or random shuffling
- **Operations**: Draw, deal, reset, and serialization
- **Multiple Decks**: Support for combining multiple decks

## Rendering System

### Dual Backend Architecture

The library provides two rendering backends that share the same public API:

#### Template Backend (Default)
- **Purpose**: Pixel-perfect rendering using embedded SVG templates
- **Process**: 
  1. Load SVG template for the suit
  2. Replace `<tspan>1</tspan>` elements with card number
  3. Preserve all suit graphics and styling
  4. Add accessibility attributes
- **Advantages**: Exact visual fidelity, optimized for quality
- **Use Case**: Production applications requiring precise visual reproduction

#### Programmatic Backend
- **Purpose**: Dynamic SVG generation for maximum flexibility
- **Process**:
  1. Generate card background with rounded corners
  2. Render suit symbol using vector primitives
  3. Position corner text and symbols
  4. Apply theme colors and styling
- **Advantages**: Full customization, no external dependencies
- **Use Case**: Applications requiring dynamic theming or custom styling

### Backend Selection

```typescript
// Auto-select template backend (default)
const svg1 = renderCard(card);

// Explicit backend selection
const svg2 = renderCard(card, { renderer: 'template' });
const svg3 = renderCard(card, { renderer: 'programmatic' });
```

## Asset Management

### SVG Templates
- **Location**: `src/assets/templates.ts`
- **Content**: Inline SVG strings from original template files
- **Structure**: Each template contains `<tspan>1</tspan>` for dynamic number replacement
- **Suits**: Circle, Triangle, Square, Star, Cross, Whot

### Theme System
- **Default Theme**: `src/render/layout.ts`
- **Customization**: Partial theme overrides for colors, dimensions, fonts
- **Inheritance**: Deep merge with defaults for complete customization

## Data Flow

```
1. Deck Creation
   ┌─────────────┐
   │ DeckOptions │
   └─────┬───────┘
         │
         ▼
   ┌─────────────┐
   │    Deck     │
   │ (54 cards)  │
   └─────┬───────┘
         │
         ▼
2. Card Rendering
   ┌─────────────┐    ┌─────────────────┐
   │    Card     │───▶│   renderCard    │
   │ (suit, #)   │    │                 │
   └─────────────┘    └─────────┬───────┘
                                │
                                ▼
                        ┌─────────────┐
                        │   Backend   │
                        │ Selection   │
                        └─────┬───────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌─────────────┐    ┌─────────────┐
            │  Template   │    │Programmatic │
            │  Backend    │    │  Backend    │
            └─────────────┘    └─────────────┘
```

## Extension Points

### Adding New Suits
1. Add suit to `Suit` type in `types.ts`
2. Create SVG template in `assets/templates.ts`
3. Add suit symbol generator in `render/suit-symbols.ts`
4. Update deck composition in `render/layout.ts`

### Custom Themes
```typescript
const customTheme = {
  width: 100,
  height: 140,
  strokeColor: '#ff0000',
  suitColors: {
    circle: '#e74c3c',
    // ... other suits
  }
};
```

### Custom Whot Labels
```typescript
const deck = new Deck({ whotLabel: '20' });
// All Whot cards display "20" instead of "WHOT"
```

## Performance Considerations

### Template Backend
- **Memory**: SVG templates are inlined (larger bundle)
- **CPU**: Simple string replacement (fast)
- **Quality**: Pixel-perfect reproduction

### Programmatic Backend
- **Memory**: Minimal (smaller bundle)
- **CPU**: Vector calculations (moderate)
- **Quality**: High-quality with theme flexibility

## Accessibility

Both backends generate accessible SVG with:
- `role="img"` attribute
- `aria-labelledby` pointing to title and description
- `<title>` and `<desc>` elements with card information
- Proper contrast ratios (theme-dependent)

## Error Handling

- **Invalid Operations**: Throws descriptive errors for invalid draw/deal operations
- **Missing Templates**: Graceful fallback to programmatic backend
- **Theme Validation**: Type-safe theme merging with defaults
- **Serialization**: Robust JSON serialization with validation

## Testing Strategy

- **Unit Tests**: Individual component testing (Deck, RNG, Renderers)
- **Integration Tests**: End-to-end rendering workflows
- **Visual Tests**: Template vs programmatic output comparison
- **Edge Cases**: Invalid operations, empty decks, theme overrides
