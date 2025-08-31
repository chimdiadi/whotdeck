import type { Card, RenderOptions, WhotTheme, RendererType } from '../types';
/**
 * Render a single card.
 */
export declare function renderCard(card: Card, options?: RenderOptions & {
    theme?: Partial<WhotTheme>;
    renderer?: RendererType;
}): string | SVGElement;
/**
 * Render a grid of cards.
 */
export declare function renderGrid(cards: Card[], cols: number, options?: RenderOptions & {
    gap?: number;
    theme?: Partial<WhotTheme>;
    renderer?: RendererType;
}): string | SVGElement;
//# sourceMappingURL=render-card.d.ts.map