export const initializeForm = () => {
    // Function to safely execute scripts in React context
    const executeScripts = (scripts) => {
      scripts.forEach(script => {
        try {
          // Use Function constructor to create isolated scope
          new Function(script)();
        } catch (error) {
          console.error('Error executing script:', error);
        }
      });
    };
  
    return executeScripts;
  };