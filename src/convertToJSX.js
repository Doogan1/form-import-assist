/**
 * Converts parsed HTML DOM structure to valid JSX
 * @param {Object} parsedHtml - Parsed HTML structure from parseHtml
 * @returns {string} Valid JSX string
 */
function convertToJSX(parsedHtml) {
  const { document } = parsedHtml;

  // Helper function to convert HTML attributes to JSX format
  function convertAttributes(element) {
    const attributes = {};
    Array.from(element.attributes || []).forEach(attr => {
      let name = attr.name;
      let value = attr.value;
      
      // Convert common HTML attributes to JSX format
      switch (name) {
        case 'class':
          name = 'className';
          break;
        case 'for':
          name = 'htmlFor';
          break;
        case 'style':
          // Convert inline styles from string to object
          const styleObj = {};
          const styles = value.split(';');
          styles.forEach(style => {
            const [prop, val] = style.split(':').map(s => s.trim());
            if (prop && val) {
              // Convert kebab-case to camelCase
              const jsxProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());
              styleObj[jsxProp] = val;
            }
          });
          value = styleObj;
          break;
      }
      
      // Handle event handlers
      if (name.startsWith('on')) {
        name = name.toLowerCase();
      }

      // Only add the attribute if it has a real value
      if (value !== '' && value !== undefined) {
        attributes[name] = value;
      }
    });
    return attributes;
  }

  // Helper function to convert DOM nodes to JSX
  function convertNode(node) {
    if (!node) return '';
    
    if (node.nodeType === 3) { // Text node
      const text = node.textContent.trim();
      return text ? text : '';
    }
    
    if (node.nodeType === 1) { // Element node
      const tagName = node.tagName.toLowerCase();
      const attributes = convertAttributes(node);
      const children = Array.from(node.childNodes)
        .map(convertNode)
        .filter(Boolean)
        .join('');
      
      // Handle self-closing tags
      const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
      if (selfClosingTags.includes(tagName) && !children) {
        return `<${tagName}${stringifyAttributes(attributes)} />`;
      }
      
      return `<${tagName}${stringifyAttributes(attributes)}>${children}</${tagName}>`;
    }
    
    return '';
  }

  // Helper function to stringify JSX attributes
  function stringifyAttributes(attributes) {
    if (Object.keys(attributes).length === 0) return '';
    
    return ' ' + Object.entries(attributes)
      .map(([key, value]) => {
        if (value === true) return key;
        if (typeof value === 'object') {
          return `${key}={${JSON.stringify(value)}}`;
        }
        if (value === '') return '';
        return `${key}="${value}"`;
      })
      .filter(Boolean)
      .join(' ');
  }

  // If document is null (no form found), return empty div
  if (!document) {
    return '<div />';
  }

  const jsx = convertNode(document);
  console.log('Converted JSX:', jsx);
  
  return jsx;
}

export default convertToJSX;