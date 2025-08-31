/**
 * Valid suit types for Whot cards.
 */
export type Suit = 'circle' | 'triangle' | 'square' | 'star' | 'cross' | 'whot';

/**
 * Represents a single Whot card.
 */
export interface Card {
  /** Unique identifier for the card (e.g., "circle:7" or "whot:WHOT#3") */
  id: string;
  /** The suit of the card */
  suit: Suit;
  /** The label displayed on the card (number or custom text) */
  label: string;
}

/**
 * Options for creating a deck.
 */
export interface DeckOptions {
  /** Number of decks to include (default: 1) */
  numDecks?: number;
  /** Label for Whot cards (default: "WHOT") */
  whotLabel?: string;
  /** Seed for deterministic shuffling */
  randomSeed?: number | string | undefined;
  /** Theme configuration for rendering */
  theme?: Partial<WhotTheme> | undefined;
  /** Renderer type to use */
  renderer?: 'template' | 'programmatic';
}

/**
 * Theme configuration for card rendering.
 */
export interface WhotTheme {
  /** Card width in pixels */
  width: number;
  /** Card height in pixels */
  height: number;
  /** Border radius in pixels */
  borderRadius: number;
  /** Border width in pixels */
  borderWidth: number;
  /** Stroke color for card border */
  strokeColor: string;
  /** Fill color for card background */
  fillColor: string;
  /** Font family for corner text */
  cornerFontFamily: string;
  /** Font size for corner text */
  cornerFontSize: number;
  /** Horizontal inset for corner elements */
  cornerInsetX: number;
  /** Vertical inset for corner elements */
  cornerInsetY: number;
  /** Size of corner suit symbols */
  cornerSymbolSize: number;
  /** Colors for each suit */
  suitColors: Record<Suit, string>;
}

/**
 * Options for rendering cards.
 */
export interface RenderOptions {
  /** Override card width */
  width?: number;
  /** Override card height */
  height?: number;
  /** CSS class name for the SVG element */
  className?: string;
  /** Additional data attributes */
  dataAttrs?: Record<string, string>;
  /** Return SVGElement if true (browser), else string */
  asDom?: boolean;
  /** CSS class prefix to prevent conflicts in grid rendering */
  cssPrefix?: string;
}

/**
 * Options for dealing cards.
 */
export interface DealOptions {
  /** Number of players */
  players: number;
  /** Number of cards per player */
  cardsPerPlayer: number;
}

/**
 * Renderer type for card rendering.
 */
export type RendererType = 'template' | 'programmatic';
