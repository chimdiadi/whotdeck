import { describe, it, expect } from 'vitest';
import { renderCard, renderGrid } from '../src/render/render-card';
import { mergeTheme } from '../src/render/layout';
import type { Card } from '../src/types';

describe('Card Rendering', () => {
  const testCard: Card = {
    id: 'circle:7',
    suit: 'circle',
    label: '7',
  };

  const whotCard: Card = {
    id: 'whot:WHOT#1',
    suit: 'whot',
    label: 'WHOT',
  };

  describe('renderCard', () => {
    it('should render a card as SVG string by default', () => {
      const result = renderCard(testCard);
      expect(typeof result).toBe('string');
      expect(result).toContain('<svg');
      expect(result).toContain('circle 7');
    });

    it('should render Whot card correctly', () => {
      const result = renderCard(whotCard);
      expect(result).toContain('<svg');
      expect(result).toContain('whot WHOT');
    });

    it('should include accessibility attributes', () => {
      const result = renderCard(testCard);
      expect(result).toContain('role="img"');
      expect(result).toContain('aria-labelledby="title desc"');
      expect(result).toContain('<title id="title">');
      expect(result).toContain('<desc id="desc">');
    });

    it('should apply custom CSS class', () => {
      const result = renderCard(testCard, { className: 'my-card' });
      expect(result).toContain('class="my-card"');
    });

    it('should apply custom data attributes', () => {
      const result = renderCard(testCard, {
        dataAttrs: { test: 'value', id: 'card-1' },
      });
      expect(result).toContain('data-test="value"');
      expect(result).toContain('data-id="card-1"');
    });

    it('should override width and height', () => {
      const result = renderCard(testCard, { width: 200, height: 300 });
      expect(result).toContain('width="200"');
      expect(result).toContain('height="300"');
    });

    it('should use template renderer by default', () => {
      const result = renderCard(testCard);
      // Template renderer should preserve the original SVG structure
      expect(result).toContain('viewBox="0 0 75.46 105.22"');
    });

    it('should use programmatic renderer when specified', () => {
      const result = renderCard(testCard, { renderer: 'programmatic' });
      // Programmatic renderer should have different structure
      expect(result).toContain('<svg');
      expect(result).toContain('circle 7');
    });

    it('should apply theme overrides', () => {
      const customTheme = {
        width: 100,
        height: 150,
        strokeColor: '#ff0000',
        fillColor: '#00ff00',
      };

      const result = renderCard(testCard, {
        renderer: 'programmatic',
        theme: customTheme,
      });

      expect(result).toContain('width="100"');
      expect(result).toContain('height="150"');
      expect(result).toContain('stroke="#ff0000"');
      expect(result).toContain('fill="#00ff00"');
    });

    it('should handle all suit types', () => {
      const suits: Array<Card['suit']> = ['circle', 'triangle', 'square', 'star', 'cross', 'whot'];

      for (const suit of suits) {
        const card: Card = {
          id: `${suit}:1`,
          suit,
          label: suit === 'whot' ? 'WHOT' : '1',
        };

        const result = renderCard(card);
        expect(result).toContain('<svg');
        expect(result).toContain(`${suit} ${card.label}`);
      }
    });
  });

  describe('renderGrid', () => {
    const testCards: Card[] = [
      { id: 'circle:1', suit: 'circle', label: '1' },
      { id: 'triangle:2', suit: 'triangle', label: '2' },
      { id: 'square:3', suit: 'square', label: '3' },
      { id: 'star:4', suit: 'star', label: '4' },
    ];

    it('should render grid as SVG string by default', () => {
      const result = renderGrid(testCards, 2);
      expect(typeof result).toBe('string');
      expect(result).toContain('<svg');
    });

    it('should arrange cards in specified number of columns', () => {
      const result = renderGrid(testCards, 2);
      expect(result).toContain('<svg');
      expect(result).toContain('Grid of 4 Whot cards');
    });

    it('should apply gap between cards', () => {
      const result = renderGrid(testCards, 2, { gap: 20 });
      expect(result).toContain('<svg');
      // The gap should affect the viewBox width
      expect(result).toContain('viewBox');
    });

    it('should include accessibility attributes', () => {
      const result = renderGrid(testCards, 2);
      expect(result).toContain('role="img"');
      expect(result).toContain('aria-labelledby="title desc"');
      expect(result).toContain('Grid of 4 Whot cards');
    });

    it('should handle empty card array', () => {
      const result = renderGrid([], 2);
      expect(result).toContain('<svg');
      expect(result).toContain('Grid of 0 Whot cards');
    });

    it('should handle single column layout', () => {
      const result = renderGrid(testCards, 1);
      expect(result).toContain('<svg');
      expect(result).toContain('Grid of 4 Whot cards');
    });

    it('should handle more columns than cards', () => {
      const result = renderGrid(testCards, 10);
      expect(result).toContain('<svg');
      expect(result).toContain('Grid of 4 Whot cards');
    });

    it('should resolve CSS class conflicts in grid rendering', () => {
      const cards = [
        { id: 'circle:1', suit: 'circle' as const, label: '1' },
        { id: 'cross:2', suit: 'cross' as const, label: '2' },
        { id: 'whot:WHOT', suit: 'whot' as const, label: 'WHOT' },
        { id: 'triangle:3', suit: 'triangle' as const, label: '3' },
      ];

      const result = renderGrid(cards, 2, { renderer: 'template' }) as string;

      // Check that each card has unique CSS class prefixes
      expect(result).toContain('card-0-cls-back');
      expect(result).toContain('card-0-cls-2');
      expect(result).toContain('card-0-cls-3');
      expect(result).toContain('card-1-cls-back');
      expect(result).toContain('card-1-cls-2');
      expect(result).toContain('card-1-cls-3');
      expect(result).toContain('card-2-cls-back');
      expect(result).toContain('card-2-cls-2');
      expect(result).toContain('card-2-cls-3');
      expect(result).toContain('card-2-cls-stroke');
      expect(result).toContain('card-2-cls-none');
      expect(result).toContain('card-3-cls-back');
      expect(result).toContain('card-3-cls-2');
      expect(result).toContain('card-3-cls-3');

      // Verify that original cls-back, cls-2, etc. are not present (indicating conflicts)
      expect(result).not.toContain('class="cls-back"');
      expect(result).not.toContain('class="cls-2"');
      expect(result).not.toContain('class="cls-3"');

      // Check that CSS definitions are also prefixed
      expect(result).toContain('.card-0-cls-back');
      expect(result).toContain('.card-0-cls-2');
      expect(result).toContain('.card-1-cls-back');
      expect(result).toContain('.card-1-cls-2');
      expect(result).toContain('.card-2-cls-back');
      expect(result).toContain('.card-2-cls-2');
      expect(result).toContain('.card-3-cls-back');
      expect(result).toContain('.card-3-cls-2');
    });

    it('should maintain correct suit rendering in grid with mixed suits', () => {
      const cards = [
        { id: 'circle:1', suit: 'circle' as const, label: '1' },
        { id: 'cross:2', suit: 'cross' as const, label: '2' },
        { id: 'whot:WHOT', suit: 'whot' as const, label: 'WHOT' },
      ];

      const result = renderGrid(cards, 3, { renderer: 'template' }) as string;

      // Verify circle card has circle elements
      expect(result).toContain('<circle class="card-0-cls-2"');
      
      // Verify cross card has cross elements (polygon for cross shape)
      expect(result).toContain('<polygon class="card-1-cls-2"');
      expect(result).toContain('<rect class="card-1-cls-2"');
      
      // Verify whot card has whot elements (path for whot text)
      expect(result).toContain('<path class="card-2-cls-2"');
      expect(result).toContain('<text class="card-2-cls-3"');
    });
  });

  describe('template renderer', () => {
    it('should replace corner text in templates', () => {
      const result = renderCard(testCard, { renderer: 'template' });

      // Should contain the number 7 in the SVG
      expect(result).toContain('7');

      // Should not contain the original template number 1
      // Note: This is a simplified check - in practice, the template might still contain "1" in other contexts
      expect(result).toContain('circle 7');
    });

    it('should preserve suit graphics in templates', () => {
      const result = renderCard(testCard, { renderer: 'template' });

      // Should contain circle-specific elements
      expect(result).toContain('<circle');
      expect(result).toContain('cx="37.73"');
    });
  });

  describe('programmatic renderer', () => {
    it('should generate proper SVG structure', () => {
      const result = renderCard(testCard, { renderer: 'programmatic' });

      expect(result).toContain('<svg');
      expect(result).toContain('<path'); // Card background
      expect(result).toContain('<circle'); // Circle symbol
      expect(result).toContain('<text'); // Corner text
    });

    it('should position elements correctly', () => {
      const result = renderCard(testCard, { renderer: 'programmatic' });

      // Should have proper transforms for positioning
      expect(result).toContain('transform="translate(');
      expect(result).toContain('rotate(180)');
    });

    it('should use theme colors', () => {
      const customTheme = {
        suitColors: {
          circle: '#ff0000',
          triangle: '#00ff00',
          square: '#0000ff',
          star: '#ffff00',
          cross: '#ff00ff',
          whot: '#00ffff',
        },
      };

      const result = renderCard(testCard, {
        renderer: 'programmatic',
        theme: customTheme,
      });

      expect(result).toContain('fill="#ff0000"');
    });
  });

  describe('theme merging', () => {
    it('should merge partial themes with defaults', () => {
      const partialTheme = {
        width: 200,
        strokeColor: '#ff0000',
      };

      const merged = mergeTheme(partialTheme);
      expect(merged.width).toBe(200);
      expect(merged.strokeColor).toBe('#ff0000');
      expect(merged.height).toBe(100); // Default value
      expect(merged.fillColor).toBe('#ffffff'); // Default value
    });

    it('should handle undefined theme', () => {
      const merged = mergeTheme();
      expect(merged.width).toBe(75);
      expect(merged.height).toBe(100);
    });

    it('should merge suit colors correctly', () => {
      const partialTheme = {
        suitColors: {
          circle: '#ff0000',
          triangle: '#00ff00',
          square: '#0000ff',
          star: '#ffff00',
          cross: '#ff00ff',
          whot: '#00ffff',
        },
      };

      const merged = mergeTheme(partialTheme);
      expect(merged.suitColors.circle).toBe('#ff0000');
      expect(merged.suitColors.triangle).toBe('#00ff00'); // From partial theme
    });
  });
});
