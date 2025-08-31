import { describe, it, expect } from 'vitest';
import { renderCard } from '../src/render/render-card';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read template files
const templatesDir = join(__dirname, '../templates');

function readTemplateFile(filename: string): string {
  return readFileSync(join(templatesDir, filename), 'utf-8');
}

function cleanTemplateForComparison(template: string): string {
  // Remove XML declaration and normalize whitespace
  return template
    .replace(/^<\?xml[^>]*\?>\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanRenderedForComparison(rendered: string): string {
  // Remove accessibility attributes and normalize whitespace
  return rendered
    .replace(/role="[^"]*"/g, '')
    .replace(/aria-labelledby="[^"]*"/g, '')
    .replace(/<title[^>]*>.*?<\/title>/g, '')
    .replace(/<desc[^>]*>.*?<\/desc>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('Template Validation', () => {
  describe('Circle Suit', () => {
    it('should render circle card matching template structure', () => {
      const template = readTemplateFile('1-Circle-text.svg');
      const card = { suit: 'circle', label: '1', id: 'circle:1' };
      const rendered = renderCard(card);
      
      const cleanTemplate = cleanTemplateForComparison(template);
      const cleanRendered = cleanRenderedForComparison(rendered);
      
      // Check that key elements are present
      expect(cleanRendered).toContain('class="cls-1"');
      expect(cleanRendered).toContain('class="cls-2"');
      expect(cleanRendered).toContain('class="cls-3"');
      expect(cleanRendered).toContain('<circle');
      expect(cleanRendered).toContain('cx="37.73"');
      expect(cleanRendered).toContain('cy="52.61"');
      expect(cleanRendered).toContain('r="20.8"');
      
      // Check that the card number is correctly replaced
      expect(cleanRendered).toContain('<tspan x="0" y="0">1</tspan>');
      
      // Check that xmlns is properly added to g element
      expect(cleanRendered).toContain('<g xmlns="http://www.w3.org/2000/svg"');
    });
  });

  describe('Cross Suit', () => {
    it('should render cross card matching template structure', () => {
      const template = readTemplateFile('1-Cross-text.svg');
      const card = { suit: 'cross', label: '1', id: 'cross:1' };
      const rendered = renderCard(card);
      
      const cleanTemplate = cleanTemplateForComparison(template);
      const cleanRendered = cleanRenderedForComparison(rendered);
      
      // Check that key elements are present
      expect(cleanRendered).toContain('class="cls-1"');
      expect(cleanRendered).toContain('class="cls-2"');
      expect(cleanRendered).toContain('class="cls-3"');
      expect(cleanRendered).toContain('class="cls-4"');
      expect(cleanRendered).toContain('<polygon');
      expect(cleanRendered).toContain('<rect');
      
      // Check specific cross polygon points
      expect(cleanRendered).toContain('points="32.64 57.71 32.64 73.38 42.82 73.38 42.82 57.71');
      
      // Check that the card number is correctly replaced
      expect(cleanRendered).toContain('<tspan x="0" y="0">1</tspan>');
      
      // Check that xmlns is properly added to g element
      expect(cleanRendered).toContain('<g xmlns="http://www.w3.org/2000/svg"');
    });
  });

  describe('Square Suit', () => {
    it('should render square card matching template structure', () => {
      const template = readTemplateFile('1-Square-text.svg');
      const card = { suit: 'square', label: '1', id: 'square:1' };
      const rendered = renderCard(card);
      
      const cleanTemplate = cleanTemplateForComparison(template);
      const cleanRendered = cleanRenderedForComparison(rendered);
      
      // Check that key elements are present
      expect(cleanRendered).toContain('class="cls-1"');
      expect(cleanRendered).toContain('class="cls-2"');
      expect(cleanRendered).toContain('class="cls-3"');
      expect(cleanRendered).toContain('<rect');
      
      // Check specific square rectangle coordinates
      expect(cleanRendered).toContain('x="17" y="31.88" width="41.46" height="41.46"');
      
      // Check that the card number is correctly replaced
      expect(cleanRendered).toContain('<tspan x="0" y="0">1</tspan>');
      
      // Check that xmlns is properly added to g element
      expect(cleanRendered).toContain('<g xmlns="http://www.w3.org/2000/svg"');
    });
  });

  describe('Triangle Suit', () => {
    it('should render triangle card matching template structure', () => {
      const template = readTemplateFile('1-Triangle-text.svg');
      const card = { suit: 'triangle', label: '1', id: 'triangle:1' };
      const rendered = renderCard(card);
      
      const cleanTemplate = cleanTemplateForComparison(template);
      const cleanRendered = cleanRenderedForComparison(rendered);
      
      // Check that key elements are present
      expect(cleanRendered).toContain('class="cls-1"');
      expect(cleanRendered).toContain('class="cls-2"');
      expect(cleanRendered).toContain('class="cls-3"');
      expect(cleanRendered).toContain('<polygon');
      
      // Check specific triangle polygon points
      expect(cleanRendered).toContain('points="37.73 31.86 13.77 73.36 61.69 73.36 37.73 31.86"');
      
      // Check that the card number is correctly replaced
      expect(cleanRendered).toContain('<tspan x="0" y="0">1</tspan>');
      
      // Check that xmlns is properly added to g element
      expect(cleanRendered).toContain('<g xmlns="http://www.w3.org/2000/svg"');
    });
  });

  describe('Star Suit', () => {
    it('should render star card matching template structure', () => {
      const template = readTemplateFile('1-Start-text.svg');
      const card = { suit: 'star', label: '1', id: 'star:1' };
      const rendered = renderCard(card);
      
      const cleanTemplate = cleanTemplateForComparison(template);
      const cleanRendered = cleanRenderedForComparison(rendered);
      
      // Check that key elements are present
      expect(cleanRendered).toContain('class="cls-1"');
      expect(cleanRendered).toContain('class="cls-2"');
      expect(cleanRendered).toContain('class="cls-3"');
      expect(cleanRendered).toContain('<polygon');
      
      // Check specific star polygon points
      expect(cleanRendered).toContain('points="46.77 56.01 51.93 71.87 38.43 62.07 24.94 71.87 30.09 56.01 16.6 46.21 33.28 46.21 38.43 30.35 43.59 46.21 60.27 46.21 46.77 56.01"');
      
      // Check that the card number is correctly replaced
      expect(cleanRendered).toContain('<tspan x="0" y="0">1</tspan>');
      
      // Check that xmlns is properly added to g element
      expect(cleanRendered).toContain('<g xmlns="http://www.w3.org/2000/svg"');
    });
  });

  describe('Whot Card', () => {
    it('should render whot card matching template structure', () => {
      const template = readTemplateFile('Whot-text.svg');
      const card = { suit: 'whot', label: '20', id: 'whot:20' };
      const rendered = renderCard(card);
      
      const cleanTemplate = cleanTemplateForComparison(template);
      const cleanRendered = cleanRenderedForComparison(rendered);
      
      // Check that key elements are present
      expect(cleanRendered).toContain('class="cls-1"');
      expect(cleanRendered).toContain('class="cls-2"');
      expect(cleanRendered).toContain('class="cls-3"');
      expect(cleanRendered).toContain('class="cls-4"');
      expect(cleanRendered).toContain('class="cls-5"');
      expect(cleanRendered).toContain('<path');
      
      // Check that the whot label is correctly replaced
      expect(cleanRendered).toContain('<tspan x="0" y="0">20</tspan>');
      
      // Check that xmlns is properly added to g element
      expect(cleanRendered).toContain('<g xmlns="http://www.w3.org/2000/svg"');
    });
  });

  describe('CSS Classes Validation', () => {
    it('should preserve all CSS classes from templates', () => {
      const suits = ['circle', 'cross', 'square', 'triangle', 'star', 'whot'] as const;
      
      suits.forEach(suit => {
        const card = { suit, label: suit === 'whot' ? '20' : '1', id: `${suit}:${suit === 'whot' ? '20' : '1'}` };
        const rendered = renderCard(card);
        
        // All templates should have these basic classes
        expect(rendered).toContain('class="cls-1"');
        expect(rendered).toContain('class="cls-2"');
        expect(rendered).toContain('class="cls-3"');
        
        // Cross and Whot have additional classes
        if (suit === 'cross' || suit === 'whot') {
          expect(rendered).toContain('class="cls-4"');
        }
        
        // Whot has an additional class
        if (suit === 'whot') {
          expect(rendered).toContain('class="cls-5"');
        }
      });
    });
  });

  describe('Namespace Validation', () => {
    it('should add xmlns to all g elements', () => {
      const suits = ['circle', 'cross', 'square', 'triangle', 'star', 'whot'] as const;
      
      suits.forEach(suit => {
        const card = { suit, label: suit === 'whot' ? '20' : '1', id: `${suit}:${suit === 'whot' ? '20' : '1'}` };
        const rendered = renderCard(card);
        
        expect(rendered).toContain('<g xmlns="http://www.w3.org/2000/svg"');
      });
    });
  });

  describe('Text Replacement Validation', () => {
    it('should correctly replace tspan text for different numbers', () => {
      const suits = ['circle', 'cross', 'square', 'triangle', 'star'] as const;
      const testNumbers = ['1', '7', '14'];
      
      suits.forEach(suit => {
        testNumbers.forEach(number => {
          const card = { suit, label: number, id: `${suit}:${number}` };
          const rendered = renderCard(card);
          
          expect(rendered).toContain(`<tspan x="0" y="0">${number}</tspan>`);
        });
      });
    });

    it('should correctly replace whot label', () => {
      const card = { suit: 'whot', label: '20', id: 'whot:20' };
      const rendered = renderCard(card);
      
      expect(rendered).toContain('<tspan x="0" y="0">20</tspan>');
    });
  });
});
