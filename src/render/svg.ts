/**
 * Helper functions for SVG manipulation and creation.
 */

/**
 * Create an SVG element with proper attributes.
 */
export function createSVGElement(tag: string, attributes: Record<string, string> = {}): string {
  const attrs = Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeXml(value)}"`)
    .join(' ');
  return `<${tag}${attrs ? ` ${attrs}` : ''}>`;
}

/**
 * Escape XML special characters.
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Create SVG attributes string.
 */
export function createAttributes(attributes: Record<string, string>): string {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeXml(value)}"`)
    .join(' ');
}

/**
 * Replace text content in SVG tspan elements.
 */
export function replaceTspanText(svg: string, newText: string, occurrences: number = 2): string {
  let result = svg;
  let count = 0;

  // Replace tspan content with new text
  result = result.replace(/<tspan[^>]*>([^<]*)<\/tspan>/g, (match, content) => {
    if (count < occurrences) {
      count++;
      return match.replace(content, newText);
    }
    return match;
  });

  return result;
}

/**
 * Create accessible SVG with title and description.
 */
export function createAccessibleSVG(
  content: string,
  title: string,
  description: string,
  attributes: Record<string, string> = {},
): string {
  const baseAttrs = {
    role: 'img',
    'aria-labelledby': 'title desc',
    ...attributes,
  };

  const attrs = createAttributes(baseAttrs);

  return `<svg ${attrs}>
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">${escapeXml(description)}</desc>
  ${content}
</svg>`;
}

/**
 * Extract SVG content and attributes from template, removing XML declaration and outer SVG wrapper.
 */
export function extractSVGContent(template: string): { content: string; attributes: Record<string, string> } {
  // Remove XML declaration if present
  let content = template.replace(/^<\?xml[^>]*\?>\s*/, '');
  
  // Extract SVG attributes and content
  const svgMatch = content.match(/<svg([^>]*)>([\s\S]*)<\/svg>/);
  if (svgMatch) {
    const attributes = svgMatch[1];
    const innerContent = svgMatch[2];
    
    // Parse attributes
    const attrMap: Record<string, string> = {};
    const attrRegex = /(\w+)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributes)) !== null) {
      attrMap[attrMatch[1]] = attrMatch[2];
    }
    
    return { content: innerContent, attributes: attrMap };
  }
  
  return { content, attributes: {} };
}

/**
 * Clean SVG template by removing XML declaration only.
 */
export function cleanSVGTemplate(template: string): string {
  // Remove XML declaration if present
  let cleaned = template.replace(/^<\?xml[^>]*\?>\s*/, '');
  
  // Add xmlns to g elements that don't have it
  cleaned = cleaned.replace(/<g\s+([^>]*?)>/g, (match, attributes) => {
    if (!attributes.includes('xmlns=')) {
      return `<g xmlns="http://www.w3.org/2000/svg" ${attributes}>`;
    }
    return match;
  });
  
  return cleaned;
}

/**
 * Parse SVG string to find tspan elements.
 */
export function findTspanElements(svg: string): Array<{
  fullMatch: string;
  content: string;
  attributes: string;
}> {
  const matches: Array<{
    fullMatch: string;
    content: string;
    attributes: string;
  }> = [];

  const regex = /<tspan([^>]*)>([^<]*)<\/tspan>/g;
  let match;

  while ((match = regex.exec(svg)) !== null) {
    matches.push({
      fullMatch: match[0],
      content: match[2],
      attributes: match[1],
    });
  }

  return matches;
}

/**
 * Create SVG element in browser environment.
 */
export function createSVGElementInBrowser(
  tag: string,
  attributes: Record<string, string> = {},
): SVGElement {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  return element;
}

/**
 * Parse SVG string to DOM element in browser.
 */
export function parseSVGString(svgString: string): SVGElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = doc.querySelector('svg');

  if (!svgElement) {
    throw new Error('Invalid SVG string');
  }

  return svgElement as SVGElement;
}
