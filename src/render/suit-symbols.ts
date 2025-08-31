import type { Suit } from '../types';

/**
 * Generate Circle suit symbol SVG.
 */
export function renderCircleSymbol(size: number = 20, color: string = '#640d0d'): string {
  const center = size / 2;
  const radius = size * 0.4;

  return `<circle cx="${center}" cy="${center}" r="${radius}" fill="${color}"/>`;
}

/**
 * Generate Triangle suit symbol SVG.
 */
export function renderTriangleSymbol(size: number = 20, color: string = '#640d0d'): string {
  const center = size / 2;
  const height = size * 0.8;
  const width = size * 0.7;

  const top = center - height / 2;
  const left = center - width / 2;
  const right = center + width / 2;
  const bottom = center + height / 2;

  const points = `${center},${top} ${left},${bottom} ${right},${bottom}`;

  return `<polygon points="${points}" fill="${color}"/>`;
}

/**
 * Generate Square suit symbol SVG.
 */
export function renderSquareSymbol(size: number = 20, color: string = '#640d0d'): string {
  const center = size / 2;
  const side = size * 0.6;
  const x = center - side / 2;
  const y = center - side / 2;

  return `<rect x="${x}" y="${y}" width="${side}" height="${side}" fill="${color}"/>`;
}

/**
 * Generate Star suit symbol SVG.
 */
export function renderStarSymbol(size: number = 20, color: string = '#640d0d'): string {
  const center = size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = size * 0.15;
  const points = 5;

  const starPoints: string[] = [];

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points;
    const x = center + radius * Math.cos(angle - Math.PI / 2);
    const y = center + radius * Math.sin(angle - Math.PI / 2);
    starPoints.push(`${x},${y}`);
  }

  return `<polygon points="${starPoints.join(' ')}" fill="${color}"/>`;
}

/**
 * Generate Cross suit symbol SVG.
 */
export function renderCrossSymbol(size: number = 20, color: string = '#640d0d'): string {
  const center = size / 2;
  const thickness = size * 0.2;
  const length = size * 0.6;

  const verticalX = center - thickness / 2;
  const verticalY = center - length / 2;
  const horizontalX = center - length / 2;
  const horizontalY = center - thickness / 2;

  return (
    `<rect x="${verticalX}" y="${verticalY}" width="${thickness}" height="${length}" fill="${color}"/>` +
    `<rect x="${horizontalX}" y="${horizontalY}" width="${length}" height="${thickness}" fill="${color}"/>`
  );
}

/**
 * Generate Whot symbol SVG (simplified text representation).
 */
export function renderWhotSymbol(size: number = 20, color: string = '#640d0d'): string {
  const center = size / 2;
  const fontSize = size * 0.3;

  return `<text x="${center}" y="${center + fontSize / 3}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${color}">W</text>`;
}

/**
 * Generate corner symbol for a suit.
 */
export function renderCornerSymbol(suit: Suit, size: number = 10, color?: string): string {
  switch (suit) {
    case 'circle':
      return renderCircleSymbol(size, color);
    case 'triangle':
      return renderTriangleSymbol(size, color);
    case 'square':
      return renderSquareSymbol(size, color);
    case 'star':
      return renderStarSymbol(size, color);
    case 'cross':
      return renderCrossSymbol(size, color);
    case 'whot':
      return renderWhotSymbol(size, color);
    default:
      return '';
  }
}

/**
 * Suit symbol renderer mapping.
 */
export const SUIT_SYMBOL_RENDERERS = {
  circle: renderCircleSymbol,
  triangle: renderTriangleSymbol,
  square: renderSquareSymbol,
  star: renderStarSymbol,
  cross: renderCrossSymbol,
  whot: renderWhotSymbol,
} as const;
