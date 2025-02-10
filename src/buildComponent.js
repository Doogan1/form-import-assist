/**
 * Builds a complete React component from converted JSX
 * @param {string} jsx - Converted JSX string
 * @param {Object} options - Component building options
 * @returns {string} Complete React component code
 */
function buildComponent(jsx, options = {}) {
  // Filter out or modify the print media style
  const filteredStyles = (options.styles.inline || []).map(style => {
    if (style.includes('@media print')) {
      // Ensure the print media query is properly scoped
      return `
        @media print {
          .form-section {
            display: inline !important;
          }
          .form-pagebreak {
            display: none !important;
          }
          .form-section-closed {
            height: auto !important;
          }
          .page-section {
            position: initial !important;
          }
        }
      `;
    }
    return style;
  });

  const componentTemplate = `
    import React, { useEffect, useState } from 'react';

    function FormComponent() {
      const [scriptsLoaded, setScriptsLoaded] = useState(false);

      // Helper function to safely execute scripts with debugging
      const executeScripts = (scripts) => {
        scripts.forEach(script => {
          try {
            const scriptContent = script.trim();
            const existingScripts = Array.from(document.scripts);
            const scriptExists = existingScripts.some(s => 
              s.text && s.text.trim() === scriptContent
            );
            
            if (!scriptExists) {
              console.log('Executing script:', scriptContent.substring(0, 100) + '...');
              
              // Remove existing event listeners before executing script
              const elementsToClean = document.querySelectorAll(
                '.form-collapse-table, .form-pagebreak-next, .form-pagebreak-back'
              );
              elementsToClean.forEach(element => {
                const clone = element.cloneNode(true);
                element.parentNode.replaceChild(clone, element);
              });
              
              new Function(script)();
            }
          } catch (error) {
            console.error('Error executing script:', error);
          }
        });
      };

      // Load scripts and styles
      useEffect(() => {
        console.log('Initial useEffect running - loading scripts and styles');
        
        // Check if style already exists
        const existingStyle = document.querySelector('style[data-jotform-styles]');
        if (!existingStyle) {
          const styleElement = document.createElement('style');
          styleElement.textContent = ${JSON.stringify(filteredStyles.join('\n'))};
          styleElement.setAttribute('data-jotform-styles', 'true');
          document.head.appendChild(styleElement);
        }

        const loadScript = (src) => {
          return new Promise((resolve, reject) => {
            if (document.querySelector(\`script[src="\${src}"]\`)) {
              resolve();
              return;
            }

            console.log('Loading script:', src);
            const script = document.createElement('script');
            script.src = src;
            script.setAttribute('data-jotform-script', 'true');
            script.onload = () => {
              console.log('Script loaded:', src);
              resolve();
            };
            script.onerror = reject;
            document.body.appendChild(script);
          });
        };

        const loadScripts = async () => {
          if (scriptsLoaded) {
            console.log('Scripts already loaded, skipping...');
            return;
          }
          
          const scripts = ${JSON.stringify(options.scripts)};
          
          // First load all external scripts
          for (const scriptUrl of scripts.urls) {
            await loadScript(scriptUrl);
          }

          // Remove any existing event listeners before executing inline scripts
          const elementsToClean = document.querySelectorAll(
            '.form-collapse-table, .form-pagebreak-next, .form-pagebreak-back'
          );
          elementsToClean.forEach(element => {
            const clone = element.cloneNode(true);
            element.parentNode.replaceChild(clone, element);
          });

          // Then execute inline scripts in isolated scope
          executeScripts(scripts.inline);

          console.log('All scripts loaded and executed');
          setScriptsLoaded(true);
        };

        loadScripts();

        return () => {
          console.log('Cleanup running...');
          
          // Remove event listeners by cloning elements
          const elementsToClean = document.querySelectorAll(
            '.form-collapse-table, .form-pagebreak-next, .form-pagebreak-back'
          );
          elementsToClean.forEach(element => {
            const clone = element.cloneNode(true);
            element.parentNode.replaceChild(clone, element);
          });

          // Remove scripts and styles we added
          const scripts = document.querySelectorAll('script[data-jotform-script]');
          scripts.forEach(script => {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
          });
          
          const styles = document.querySelectorAll('style[data-jotform-styles]');
          styles.forEach(style => {
            if (style.parentNode) {
              style.parentNode.removeChild(style);
            }
          });
        };
      }, []);

      return (
        ${jsx}
      );
    }

    export default FormComponent;
  `;

  return componentTemplate;
}
export default buildComponent;