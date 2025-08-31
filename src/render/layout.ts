import type { Suit, WhotTheme } from '../types';

/**
 * Default theme configuration for Whot cards.
 */
export const DEFAULT_THEME: WhotTheme = {
  width: 75,
  height: 100,
  borderRadius: 6,
  borderWidth: 0,
  strokeColor: '#640d0d',
  fillColor: '#ffffff',
  cornerFontFamily: 'system-ui, -apple-system, sans-serif',
  cornerFontSize: 8,
  cornerInsetX: 7,
  cornerInsetY: 11,
  cornerSymbolSize: 10,
  suitColors: {
    circle: '#640d0d',
    triangle: '#640d0d',
    square: '#640d0d',
    star: '#640d0d',
    cross: '#640d0d',
    whot: '#640d0d',
  },
};

/**
 * ViewBox dimensions for SVG cards.
 */
export const VIEWBOX = {
  width: 75.46,
  height: 105.22,
};

/**
 * Card composition rules for Whot deck.
 */
export const DECK_COMPOSITION: Record<Suit, number[]> = {
  circle: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
  triangle: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
  cross: [1, 2, 3, 5, 7, 10, 11, 13, 14],
  square: [1, 2, 3, 5, 7, 10, 11, 13, 14],
  star: [1, 2, 3, 4, 5, 7, 8],
  whot: [], // Whot cards are handled separately
};

/**
 * Number of Whot cards per deck.
 */
export const WHOT_CARDS_PER_DECK = 5;

/**
 * Default Whot label.
 */
export const DEFAULT_WHOT_LABEL = 'WHOT';

/**
 * Merge theme with defaults.
 */
export function mergeTheme(partial?: Partial<WhotTheme>): WhotTheme {
  if (!partial) {
    return { ...DEFAULT_THEME };
  }

  return {
    ...DEFAULT_THEME,
    ...partial,
    suitColors: {
      ...DEFAULT_THEME.suitColors,
      ...partial.suitColors,
    },
  };
}
