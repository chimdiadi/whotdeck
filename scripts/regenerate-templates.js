#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const templatesDir = path.join(process.cwd(), 'templates');
const outputFile = path.join(process.cwd(), 'src/assets/templates.ts');

console.log('🔄 Regenerating templates.ts from updated template files...');

// Read all template files
const templateFiles = {
  circle: '1-Circle-text.svg',
  cross: '1-Cross-text.svg', 
  square: '1-Square-text.svg',
  triangle: '1-Triangle-text.svg',
  star: '1-Start-text.svg', // Note: filename uses "Start" instead of "Star"
  whot: 'Whot-text.svg'
};

const templates = {};

// Read each template file
for (const [suit, filename] of Object.entries(templateFiles)) {
  const filePath = path.join(templatesDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Warning: ${filename} not found, skipping...`);
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  templates[suit] = content;
  console.log(`✅ Loaded ${filename}`);
}

// Generate the TypeScript file content
const tsContent = `/**
 * Auto-generated SVG templates from the templates/ directory.
 * This file is regenerated automatically when template files are updated.
 * 
 * Generated on: ${new Date().toISOString()}
 */

${Object.entries(templates).map(([suit, content]) => {
  const constName = `SVG_${suit.toUpperCase()}_${suit === 'whot' ? '' : '1'}`;
  return `/**
 * SVG template for ${suit.charAt(0).toUpperCase() + suit.slice(1)} suit${suit === 'whot' ? ' (Whot card)' : ' (number 1)'}.
 * Exact contents from ${templateFiles[suit]}
 */
export const ${constName} = ${JSON.stringify(content)};`;
}).join('\n\n')}

/**
 * Template mapping for easy access.
 */
export const SVG_TEMPLATES = {
${Object.entries(templates).map(([suit, _]) => {
  const constName = `SVG_${suit.toUpperCase()}_${suit === 'whot' ? '' : '1'}`;
  return `  ${suit}: ${constName},`;
}).join('\n')}
} as const;
`;

// Write the file
fs.writeFileSync(outputFile, tsContent, 'utf8');

console.log(`\n✅ Successfully regenerated ${outputFile}`);
console.log(`📊 Updated ${Object.keys(templates).length} templates:`);
Object.keys(templates).forEach(suit => {
  console.log(`   - ${suit}: ${templateFiles[suit]}`);
});

console.log('\n🎉 Template regeneration complete!');
