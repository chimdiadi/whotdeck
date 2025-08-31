import type { Card, RenderOptions, WhotTheme, RendererType } from '../types';
import { SVG_TEMPLATES } from '../assets/templates';
import { mergeTheme } from './layout';
import { replaceTspanText, createAccessibleSVG, cleanSVGTemplate } from './svg';
import { renderCornerSymbol } from './suit-symbols';

/**
 * Get the appropriate template for a card.
 */
function getTemplateForCard(card: Card): string | undefined {
  return SVG_TEMPLATES[card.suit];
}

/**
 * Render a card using the template backend.
 */
function renderCardTemplate(
  card: Card,
  _theme: WhotTheme,
  options: RenderOptions,
): string {
  const template = getTemplateForCard(card);
  if (!template) {
    throw new Error(`No template found for card: ${card.suit} ${card.label}`);
  }

  const cleanedTemplate = cleanSVGTemplate(template);
  let svg = replaceTspanText(cleanedTemplate, card.label);

  // Templates are now normalized, so no CSS processing needed
  // The templates already have consistent CSS class structure

  const title = `${card.suit} ${card.label}`;
  const description = `Whot playing card with suit ${card.suit} and label ${card.label}`;

  let customAttrsString = ' role="img" aria-labelledby="title desc"';
  if (options.className) {
    customAttrsString += ` class="${options.className}"`;
  }
  if (options.dataAttrs) {
    Object.entries(options.dataAttrs).forEach(([key, value]) => {
      customAttrsString += ` data-${key}="${value}"`;
    });
  }
  if (options.width) {
    customAttrsString += ` width="${options.width}"`;
  }
  if (options.height) {
    customAttrsString += ` height="${options.height}"`;
  }

  // Add unique CSS class prefix to prevent conflicts in grid rendering
  const cssPrefix = options.cssPrefix || '';
  let processedSvg = svg;
  
  if (cssPrefix) {
    // Replace CSS class references with prefixed versions
    // Handle both numeric (cls-1, cls-2, etc.) and named (cls-back, cls-none, cls-stroke, etc.) classes
    processedSvg = processedSvg.replace(/class="cls-([^"]+)"/g, `class="${cssPrefix}-cls-$1"`);
    // Update CSS definitions with prefixed class names
    processedSvg = processedSvg.replace(/\.cls-([^,\s{]+)/g, `.${cssPrefix}-cls-$1`);
  }

  const svgWithAccessibility = processedSvg.replace(
    /<svg([^>]*)>/,
    `<svg$1${customAttrsString}>`
  );

  const titleElement = `<title id="title">${title}</title>`;
  const descElement = `<desc id="desc">${description}</desc>`;

  const finalSvg = svgWithAccessibility.replace(
    /<svg[^>]*>/,
    (match) => `${match}${titleElement}${descElement}`
  );

  return finalSvg;
}

/**
 * Render a card using the programmatic backend.
 */
function renderCardProgrammatic(card: Card, theme: WhotTheme, options: RenderOptions): string {
  const width = options.width ?? theme.width;
  const height = options.height ?? theme.height;

  // Card background
  const cardPath = `M${theme.borderRadius} 0h${width - 2 * theme.borderRadius}c${theme.borderRadius} 0 ${theme.borderRadius} ${theme.borderRadius} ${theme.borderRadius} ${theme.borderRadius}v${height - 2 * theme.borderRadius}c0 ${theme.borderRadius} -${theme.borderRadius} ${theme.borderRadius} -${theme.borderRadius} ${theme.borderRadius}H${theme.borderRadius}c-${theme.borderRadius} 0 -${theme.borderRadius} -${theme.borderRadius} -${theme.borderRadius} -${theme.borderRadius}V${theme.borderRadius}C0 ${theme.borderRadius} ${theme.borderRadius} 0 ${theme.borderRadius} 0z`;

  // Center suit symbol
  const centerSymbol = renderCornerSymbol(card.suit, theme.cornerSymbolSize * 2, theme.suitColors[card.suit]);
  const centerX = width / 2;
  const centerY = height / 2;

  // Corner elements
  const cornerSymbol = renderCornerSymbol(card.suit, theme.cornerSymbolSize, theme.suitColors[card.suit]);
  const cornerX = theme.cornerInsetX;
  const cornerY = theme.cornerInsetY;
  const cornerTextX = cornerX + theme.cornerSymbolSize + 2;
  const cornerTextY = cornerY + theme.cornerFontSize;

  // Bottom-right corner (rotated)
  const bottomRightX = width - theme.cornerInsetX;
  const bottomRightY = height - theme.cornerInsetY;

  const svgContent = `
    <path d="${cardPath}" fill="${theme.fillColor}" stroke="${theme.strokeColor}" stroke-width="${theme.borderWidth}"/>
    <g transform="translate(${centerX - theme.cornerSymbolSize} ${centerY - theme.cornerSymbolSize})">
      ${centerSymbol}
    </g>
    <g transform="translate(${cornerX} ${cornerY})">
      ${cornerSymbol}
    </g>
    <text x="${cornerTextX}" y="${cornerTextY}" 
          font-family="${theme.cornerFontFamily}" 
          font-size="${theme.cornerFontSize}" 
          font-weight="bold" 
          fill="${theme.suitColors[card.suit]}">${card.label}</text>
    <g transform="translate(${bottomRightX} ${bottomRightY}) rotate(180)">
      ${cornerSymbol}
    </g>
    <text x="${bottomRightX - theme.cornerSymbolSize - 2}" y="${bottomRightY - theme.cornerSymbolSize + theme.cornerFontSize}" 
          transform="translate(${bottomRightX} ${bottomRightY}) rotate(180)"
          font-family="${theme.cornerFontFamily}" 
          font-size="${theme.cornerFontSize}" 
          font-weight="bold" 
          fill="${theme.suitColors[card.suit]}">${card.label}</text>
  `;

  const title = `${card.suit} ${card.label}`;
  const description = `Whot playing card with suit ${card.suit} and label ${card.label}`;

  const attrs: Record<string, string> = {
    viewBox: `0 0 ${width} ${height}`,
    width: width.toString(),
    height: height.toString(),
  };

  if (options.className) {
    attrs.class = options.className;
  }
  if (options.dataAttrs) {
    Object.entries(options.dataAttrs).forEach(([key, value]) => {
      attrs[`data-${key}`] = value;
    });
  }

  return createAccessibleSVG(svgContent, title, description, attrs);
}

/**
 * Render a single card.
 */
export function renderCard(
  card: Card,
  options: RenderOptions & { theme?: Partial<WhotTheme>; renderer?: RendererType } = {},
): string | SVGElement {
  const theme = mergeTheme(options.theme);
  const renderer = options.renderer ?? 'template';

  let svgString: string;

  if (renderer === 'template') {
    svgString = renderCardTemplate(card, theme, options);
  } else {
    svgString = renderCardProgrammatic(card, theme, options);
  }

  if (options.asDom && typeof window !== 'undefined') {
    // Browser environment - return SVGElement
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      throw new Error('Failed to parse SVG string');
    }

    return svgElement as SVGElement;
  }

  return svgString;
}

/**
 * Render a grid of cards.
 */
export function renderGrid(
  cards: Card[],
  cols: number,
  options: RenderOptions & {
    gap?: number;
    theme?: Partial<WhotTheme>;
    renderer?: RendererType;
  } = {},
): string | SVGElement {
  const theme = mergeTheme(options.theme);
  const gap = options.gap ?? 10;
  const cardWidth = options.width ?? theme.width;
  const cardHeight = options.height ?? theme.height;

  const rows = Math.ceil(cards.length / cols);
  const gridWidth = cols * cardWidth + (cols - 1) * gap;
  const gridHeight = rows * cardHeight + (rows - 1) * gap;

  const cardElements = cards.map((card, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = col * (cardWidth + gap);
    const y = row * (cardHeight + gap);

    const cardSvg = renderCard(card, {
      ...options,
      asDom: false,
      cssPrefix: `card-${index}`, // Add unique CSS prefix for each card
    }) as string;

    // Extract the content from the SVG (remove the outer svg tag)
    const contentMatch = cardSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    const content = contentMatch ? contentMatch[1] : '';

    return `<g transform="translate(${x} ${y})">${content}</g>`;
  });

  const svgContent = cardElements.join('\n');

  const title = `Grid of ${cards.length} Whot cards`;
  const description = `Grid layout of ${cards.length} Whot playing cards arranged in ${cols} columns`;

  const attrs: Record<string, string> = {
    viewBox: `0 0 ${gridWidth} ${gridHeight}`,
    width: gridWidth.toString(),
    height: gridHeight.toString(),
  };

  if (options.className) {
    attrs.class = options.className;
  }
  if (options.dataAttrs) {
    Object.entries(options.dataAttrs).forEach(([key, value]) => {
      attrs[`data-${key}`] = value;
    });
  }

  const svgString = createAccessibleSVG(svgContent, title, description, attrs);

  if (options.asDom && typeof window !== 'undefined') {
    // Browser environment - return SVGElement
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      throw new Error('Failed to parse SVG string');
    }

    return svgElement as SVGElement;
  }

  return svgString;
}
