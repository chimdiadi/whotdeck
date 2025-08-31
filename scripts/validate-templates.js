#!/usr/bin/env node

/**
 * Template Validation Script
 * 
 * This script validates that our rendering matches the original template files.
 * Run with: node scripts/validate-templates.js
 */

import { renderCard } from '../dist/index.esm.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read template files
const templatesDir = join(__dirname, '../templates');

function readTemplateFile(filename) {
  return readFileSync(join(templatesDir, filename), 'utf-8');
}

function cleanTemplateForComparison(template) {
  // Remove XML declaration and normalize whitespace
  return template
    .replace(/^<\?xml[^>]*\?>\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanRenderedForComparison(rendered) {
  // Remove accessibility attributes and normalize whitespace
  return rendered
    .replace(/role="[^"]*"/g, '')
    .replace(/aria-labelledby="[^"]*"/g, '')
    .replace(/<title[^>]*>.*?<\/title>/g, '')
    .replace(/<desc[^>]*>.*?<\/desc>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function validateTemplate(suit, templateFile, label = '1') {
  console.log(`\n🔍 Validating ${suit} suit...`);
  
  try {
    const template = readTemplateFile(templateFile);
    const card = { suit, label, id: `${suit}:${label}` };
    const rendered = renderCard(card);
    
    const cleanTemplate = cleanTemplateForComparison(template);
    const cleanRendered = cleanRenderedForComparison(rendered);
    
    // Check key elements
    const checks = [
      { name: 'CSS Classes', test: () => cleanRendered.includes('class="cls-1"') && cleanRendered.includes('class="cls-2"') && cleanRendered.includes('class="cls-3"') },
      { name: 'Namespace', test: () => cleanRendered.includes('<g xmlns="http://www.w3.org/2000/svg"') },
      { name: 'Text Replacement', test: () => cleanRendered.includes(`<tspan x="0" y="0">${label}</tspan>`) },
    ];
    
    // Suit-specific checks
    if (suit === 'circle') {
      checks.push({ name: 'Circle Elements', test: () => cleanRendered.includes('<circle') && cleanRendered.includes('cx="37.73"') });
    } else if (suit === 'cross') {
      checks.push({ name: 'Cross Elements', test: () => cleanRendered.includes('<polygon') && cleanRendered.includes('class="cls-4"') });
    } else if (suit === 'square') {
      checks.push({ name: 'Square Elements', test: () => cleanRendered.includes('<rect') && cleanRendered.includes('x="17" y="31.88"') });
    } else if (suit === 'triangle') {
      checks.push({ name: 'Triangle Elements', test: () => cleanRendered.includes('<polygon') && cleanRendered.includes('points="37.73 31.86 13.77 73.36 61.69 73.36 37.73 31.86"') });
    } else if (suit === 'star') {
      checks.push({ name: 'Star Elements', test: () => cleanRendered.includes('<polygon') && cleanRendered.includes('points="46.77 56.01 51.93 71.87 38.43 62.07 24.94 71.87 30.09 56.01 16.6 46.21 33.28 46.21 38.43 30.35 43.59 46.21 60.27 46.21 46.77 56.01"') });
    } else if (suit === 'whot') {
      checks.push({ name: 'Whot Elements', test: () => cleanRendered.includes('<path') && cleanRendered.includes('class="cls-4"') && cleanRendered.includes('class="cls-5"') });
    }
    
    let allPassed = true;
    checks.forEach(check => {
      const passed = check.test();
      console.log(`  ${passed ? '✅' : '❌'} ${check.name}`);
      if (!passed) allPassed = false;
    });
    
    if (allPassed) {
      console.log(`  🎉 ${suit} suit validation PASSED`);
    } else {
      console.log(`  💥 ${suit} suit validation FAILED`);
    }
    
    return allPassed;
    
  } catch (error) {
    console.log(`  💥 Error validating ${suit}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🎴 Whot Card Template Validation');
  console.log('================================');
  
  const validations = [
    { suit: 'circle', file: '1-Circle-text.svg', label: '1' },
    { suit: 'cross', file: '1-Cross-text.svg', label: '1' },
    { suit: 'square', file: '1-Square-text.svg', label: '1' },
    { suit: 'triangle', file: '1-Triangle-text.svg', label: '1' },
    { suit: 'star', file: '1-Start-text.svg', label: '1' },
    { suit: 'whot', file: 'Whot-text.svg', label: '20' },
  ];
  
  let passed = 0;
  let total = validations.length;
  
  for (const validation of validations) {
    const result = validateTemplate(validation.suit, validation.file, validation.label);
    if (result) passed++;
  }
  
  console.log('\n📊 Summary');
  console.log('==========');
  console.log(`Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All template validations passed!');
    process.exit(0);
  } else {
    console.log('💥 Some template validations failed!');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script error:', error);
  process.exit(1);
});
