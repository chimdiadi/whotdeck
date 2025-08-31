import type { Suit, WhotTheme } from '../types';
/**
 * Default theme configuration for Whot cards.
 */
export declare const DEFAULT_THEME: WhotTheme;
/**
 * ViewBox dimensions for SVG cards.
 */
export declare const VIEWBOX: {
    width: number;
    height: number;
};
/**
 * Card composition rules for Whot deck.
 */
export declare const DECK_COMPOSITION: Record<Suit, number[]>;
/**
 * Number of Whot cards per deck.
 */
export declare const WHOT_CARDS_PER_DECK = 5;
/**
 * Default Whot label.
 */
export declare const DEFAULT_WHOT_LABEL = "WHOT";
/**
 * Merge theme with defaults.
 */
export declare function mergeTheme(partial?: Partial<WhotTheme>): WhotTheme;
//# sourceMappingURL=layout.d.ts.map