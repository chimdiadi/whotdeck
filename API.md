# API Reference

## Core Types

### Suit
```typescript
type Suit = 'circle' | 'triangle' | 'square' | 'star' | 'cross' | 'whot';
```
Valid suit types for Whot cards.

### Card
```typescript
interface Card {
  id: string;       // Unique identifier (e.g., "circle:7" or "whot:WHOT#3")
  suit: Suit;       // The suit of the card
  label: string;    // The label displayed on the card (number or custom text)
}
```

### DeckOptions
```typescript
interface DeckOptions {
  numDecks?: number;           // Number of decks to include (default: 1)
  whotLabel?: string;          // Label for Whot cards (default: "WHOT")
  randomSeed?: number | string; // Seed for deterministic shuffling
  theme?: Partial<WhotTheme>;  // Theme configuration for rendering
  renderer?: 'template' | 'programmatic'; // Renderer type to use
}
```

### WhotTheme
```typescript
interface WhotTheme {
  width: number; height: number;            // Card dimensions
  borderRadius: number; borderWidth: number; // Card styling
  strokeColor: string; fillColor: string;   // Card colors
  cornerFontFamily: string; cornerFontSize: number; // Text styling
  cornerInsetX: number; cornerInsetY: number;       // Corner positioning
  cornerSymbolSize: number;                           // Symbol sizing
  suitColors: Record<Suit, string>; // Colors for each suit
}
```

### RenderOptions
```typescript
interface RenderOptions {
  width?: number; height?: number;          // Override card dimensions
  className?: string;                       // CSS class for SVG element
  dataAttrs?: Record<string, string>;      // Additional data attributes
  asDom?: boolean;                         // Return SVGElement if true (browser)
  theme?: Partial<WhotTheme>;              // Theme overrides
  renderer?: 'template' | 'programmatic';  // Renderer backend
}
```

### DealOptions
```typescript
interface DealOptions {
  players: number;        // Number of players
  cardsPerPlayer: number; // Number of cards per player
}
```

## Deck Class

### Constructor
```typescript
new Deck(options?: DeckOptions): Deck
```

Creates a new deck of Whot cards.

**Parameters:**
- `options` (optional): Configuration for deck creation

**Example:**
```typescript
// Default deck
const deck = new Deck();

// Custom deck
const deck = new Deck({
  numDecks: 2,
  whotLabel: '20',
  randomSeed: 123,
  renderer: 'template'
});
```

### Methods

#### reset()
```typescript
deck.reset(): void
```

Resets the deck to its initial state with all cards.

**Example:**
```typescript
deck.draw(10);
deck.reset(); // Deck now has all 54 cards again
```

#### shuffle()
```typescript
deck.shuffle(): void
```

Shuffles the deck using Fisher-Yates algorithm. Uses seeded RNG if `randomSeed` was provided.

**Example:**
```typescript
deck.shuffle(); // Random shuffle
// or
const deck = new Deck({ randomSeed: 123 });
deck.shuffle(); // Deterministic shuffle
```

#### draw()
```typescript
deck.draw(n?: number): Card[]
```

Draws cards from the top of the deck.

**Parameters:**
- `n` (optional): Number of cards to draw (default: 1)

**Returns:** Array of drawn cards

**Throws:** Error if trying to draw more cards than available

**Example:**
```typescript
const card = deck.draw()[0];        // Draw 1 card
const cards = deck.draw(5);         // Draw 5 cards
```

#### deal()
```typescript
deck.deal(opts: DealOptions): Card[][]
```

Deals cards to multiple players in round-robin fashion.

**Parameters:**
- `opts`: Deal configuration

**Returns:** Array of player hands (each hand is an array of cards)

**Throws:** Error if insufficient cards for deal

**Example:**
```typescript
const hands = deck.deal({ players: 4, cardsPerPlayer: 5 });
// Returns: [[card1, card2, ...], [card1, card2, ...], ...]
```

#### size()
```typescript
deck.size(): number
```

Returns the current number of cards in the deck.

**Example:**
```typescript
console.log(deck.size()); // 54 (or less if cards were drawn)
```

#### isEmpty()
```typescript
deck.isEmpty(): boolean
```

Checks if the deck is empty.

**Example:**
```typescript
if (deck.isEmpty()) {
  console.log('No cards left!');
}
```

#### getFullDeckSize()
```typescript
deck.getFullDeckSize(): number
```

Returns the total number of cards in a full deck (54 × number of decks).

**Example:**
```typescript
const deck = new Deck({ numDecks: 3 });
console.log(deck.getFullDeckSize()); // 162
```

#### toJSON()
```typescript
deck.toJSON(): string
```

Serializes the deck to JSON string.

**Example:**
```typescript
const json = deck.toJSON();
localStorage.setItem('savedDeck', json);
```

#### fromJSON()
```typescript
static Deck.fromJSON(json: string): Deck
```

Creates a deck from JSON string.

**Example:**
```typescript
const json = localStorage.getItem('savedDeck');
const deck = Deck.fromJSON(json);
```

#### getOptions()
```typescript
deck.getOptions(): Required<DeckOptions>
```

Returns a copy of the deck's configuration options.

**Example:**
```typescript
const options = deck.getOptions();
console.log(options.numDecks); // 1
```

#### getCards()
```typescript
deck.getCards(): Card[]
```

Returns a copy of all cards in the deck (without removing them).

**Example:**
```typescript
const allCards = deck.getCards();
console.log(allCards.length); // Current deck size
```

#### addCards()
```typescript
deck.addCards(cards: Card[]): void
```

Adds cards to the deck.

**Example:**
```typescript
const extraCard: Card = { id: 'test:1', suit: 'circle', label: '1' };
deck.addCards([extraCard]);
```

#### removeCards()
```typescript
deck.removeCards(cardIds: string[]): Card[]
```

Removes specific cards from the deck by ID.

**Returns:** Array of removed cards

**Example:**
```typescript
const removed = deck.removeCards(['circle:7', 'triangle:5']);
```

#### findCard()
```typescript
deck.findCard(cardId: string): Card | undefined
```

Finds a card by its ID.

**Example:**
```typescript
const card = deck.findCard('circle:7');
if (card) {
  console.log('Found:', card.label);
}
```

#### hasCard()
```typescript
deck.hasCard(cardId: string): boolean
```

Checks if the deck contains a specific card.

**Example:**
```typescript
if (deck.hasCard('whot:WHOT#1')) {
  console.log('Whot card found!');
}
```

## Rendering Functions

### renderCard()
```typescript
renderCard(card: Card, options?: RenderOptions): string | SVGElement
```

Renders a single card as SVG.

**Parameters:**
- `card`: The card to render
- `options` (optional): Rendering options

**Returns:** SVG string or SVGElement (if `asDom: true`)

**Example:**
```typescript
const card: Card = { id: 'circle:7', suit: 'circle', label: '7' };

// Basic rendering
const svg = renderCard(card);

// With options
const svg = renderCard(card, {
  width: 200,
  height: 300,
  className: 'my-card',
  renderer: 'template',
  theme: { strokeColor: '#ff0000' }
});

// As DOM element (browser only)
const svgElement = renderCard(card, { asDom: true });
```

### renderGrid()
```typescript
renderGrid(cards: Card[], cols: number, options?: RenderOptions & { gap?: number }): string | SVGElement
```

Renders multiple cards in a grid layout.

**Parameters:**
- `cards`: Array of cards to render
- `cols`: Number of columns in the grid
- `options` (optional): Rendering options including gap

**Returns:** SVG string or SVGElement (if `asDom: true`)

**Example:**
```typescript
const cards = deck.draw(6);

// Basic grid
const gridSvg = renderGrid(cards, 3);

// With gap and options
const gridSvg = renderGrid(cards, 2, {
  gap: 20,
  width: 100,
  height: 140,
  renderer: 'programmatic'
});
```

## Utility Functions

### createRNG()
```typescript
createRNG(seed?: number | string): SeededRNG | null
```

Creates a seeded random number generator.

**Parameters:**
- `seed` (optional): Seed for deterministic generation

**Returns:** SeededRNG instance or null if no seed provided

**Example:**
```typescript
const rng = createRNG(123);
if (rng) {
  const random = rng.next(); // 0.0 to 1.0
}
```

### mergeTheme()
```typescript
mergeTheme(partial?: Partial<WhotTheme>): WhotTheme
```

Merges partial theme with defaults.

**Parameters:**
- `partial` (optional): Partial theme overrides

**Returns:** Complete theme object

**Example:**
```typescript
const theme = mergeTheme({
  width: 100,
  strokeColor: '#ff0000'
});
// Returns complete theme with defaults for missing properties
```

## Constants

### VERSION
```typescript
const VERSION: string
```

Current library version.

### DEFAULT_THEME
```typescript
const DEFAULT_THEME: WhotTheme
```

Default theme configuration.

## Error Handling

The library throws descriptive errors for invalid operations:

```typescript
// Drawing more cards than available
try {
  deck.draw(100); // Throws: "Cannot draw 100 cards from deck of size 54"
} catch (error) {
  console.error(error.message);
}

// Dealing insufficient cards
try {
  deck.deal({ players: 10, cardsPerPlayer: 10 }); // Throws: "Cannot deal 100 cards to 10 players from deck of size 54"
} catch (error) {
  console.error(error.message);
}
```

## Browser vs Node.js

Most functions work in both environments, but some have browser-specific behavior:

```typescript
// Works in both environments
const svgString = renderCard(card);

// Browser only - returns SVGElement
const svgElement = renderCard(card, { asDom: true });
```

## Performance Notes

- **Template Backend**: Fast string replacement, larger bundle size
- **Programmatic Backend**: Dynamic generation, smaller bundle size
- **Seeded Shuffling**: Deterministic but slightly slower than Math.random()
- **Theme Merging**: Deep merge operation, cache results for repeated use
