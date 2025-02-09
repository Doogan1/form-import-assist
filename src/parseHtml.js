import { JSDOM } from 'jsdom';
/**
 * Parses HTML content and extracts relevant information
 * @param {string} htmlContent - Raw HTML content to parse
 * @returns {Object} Structured object containing parsed HTML information
 */
function parseHtml(htmlContent) {
  // TODO: Implement HTML parsing logic
  // 1. Parse HTML into DOM structure
  // 2. Extract scripts and other relevant elements
  // 3. Return structured data
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  
  // Extract form element and all its contents
  const form = document.querySelector('form') || document.body;
  
  // Extract ALL scripts
  const scripts = Array.from(document.getElementsByTagName('script'));
  const scriptUrls = [];
  const inlineScripts = [];

  scripts.forEach(script => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
    if (script.src) {
      scriptUrls.push(script.src);
    } else if (script.textContent) {
      inlineScripts.push(script.textContent);
    }
  });

  // Extract ALL styles (both link and style tags)
  const styleUrls = Array.from(document.getElementsByTagName('link'))
    .filter(link => link.rel === 'stylesheet')
    .map(style => style.href);

  const inlineStyles = Array.from(document.getElementsByTagName('style'))
    .map(style => {
      const styleContent = style.textContent;
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      return styleContent;
    });

  return {
    document: form,
    scripts: {
      urls: scriptUrls,
      inline: inlineScripts
    },
    styles: {
      urls: styleUrls,
      inline: inlineStyles
    }
  };
}

export default parseHtml;