/**
 * Helper functions for SVG manipulation and creation.
 */
/**
 * Create an SVG element with proper attributes.
 */
export declare function createSVGElement(tag: string, attributes?: Record<string, string>): string;
/**
 * Escape XML special characters.
 */
export declare function escapeXml(text: string): string;
/**
 * Create SVG attributes string.
 */
export declare function createAttributes(attributes: Record<string, string>): string;
/**
 * Replace text content in SVG tspan elements.
 */
export declare function replaceTspanText(svg: string, newText: string, occurrences?: number): string;
/**
 * Create accessible SVG with title and description.
 */
export declare function createAccessibleSVG(content: string, title: string, description: string, attributes?: Record<string, string>): string;
/**
 * Extract SVG content and attributes from template, removing XML declaration and outer SVG wrapper.
 */
export declare function extractSVGContent(template: string): {
    content: string;
    attributes: Record<string, string>;
};
/**
 * Clean SVG template by removing XML declaration only.
 */
export declare function cleanSVGTemplate(template: string): string;
/**
 * Parse SVG string to find tspan elements.
 */
export declare function findTspanElements(svg: string): Array<{
    fullMatch: string;
    content: string;
    attributes: string;
}>;
/**
 * Create SVG element in browser environment.
 */
export declare function createSVGElementInBrowser(tag: string, attributes?: Record<string, string>): SVGElement;
/**
 * Parse SVG string to DOM element in browser.
 */
export declare function parseSVGString(svgString: string): SVGElement;
//# sourceMappingURL=svg.d.ts.map