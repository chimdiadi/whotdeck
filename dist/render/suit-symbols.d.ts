import type { Suit } from '../types';
/**
 * Generate Circle suit symbol SVG.
 */
export declare function renderCircleSymbol(size?: number, color?: string): string;
/**
 * Generate Triangle suit symbol SVG.
 */
export declare function renderTriangleSymbol(size?: number, color?: string): string;
/**
 * Generate Square suit symbol SVG.
 */
export declare function renderSquareSymbol(size?: number, color?: string): string;
/**
 * Generate Star suit symbol SVG.
 */
export declare function renderStarSymbol(size?: number, color?: string): string;
/**
 * Generate Cross suit symbol SVG.
 */
export declare function renderCrossSymbol(size?: number, color?: string): string;
/**
 * Generate Whot symbol SVG (simplified text representation).
 */
export declare function renderWhotSymbol(size?: number, color?: string): string;
/**
 * Generate corner symbol for a suit.
 */
export declare function renderCornerSymbol(suit: Suit, size?: number, color?: string): string;
/**
 * Suit symbol renderer mapping.
 */
export declare const SUIT_SYMBOL_RENDERERS: {
    readonly circle: typeof renderCircleSymbol;
    readonly triangle: typeof renderTriangleSymbol;
    readonly square: typeof renderSquareSymbol;
    readonly star: typeof renderStarSymbol;
    readonly cross: typeof renderCrossSymbol;
    readonly whot: typeof renderWhotSymbol;
};
//# sourceMappingURL=suit-symbols.d.ts.map