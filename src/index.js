#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import parseHtml from './parseHtml.js';
import convertToJSX from './convertToJSX.js';
import buildComponent from './buildComponent.js';
import { fileURLToPath } from 'url';
import { URL, pathToFileURL } from 'url';

async function main() {
  // TODO: Add CLI functionality here
  // 1. Accept input HTML file
  // 2. Parse HTML
  // 3. Convert to JSX
  // 4. Build React component
  // 5. Output component file
  // Read input HTML file

  // Get HTML file path from command line args
  const htmlFile = process.argv[2];
  if (!htmlFile) {
    console.error('Please provide an HTML file path');
    process.exit(1);
  }

  // Read and parse HTML content
  const htmlContent = await fs.readFile(htmlFile, 'utf8');
  const parsedHtml = parseHtml(htmlContent);

  // Convert HTML to JSX
  const jsx = convertToJSX(parsedHtml);

  // Build React component
  const componentCode = buildComponent(jsx, {
    scripts: parsedHtml.scripts,
    styles: parsedHtml.styles
  });

  // Generate output file path
  const outputFile = path.join(
    path.dirname(htmlFile),
    `${path.basename(htmlFile, '.html')}Component.jsx`
  );

  // Write component to file
  await fs.writeFile(outputFile, componentCode);
  console.log(`React component written to ${outputFile}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(console.error);
}

export default main;