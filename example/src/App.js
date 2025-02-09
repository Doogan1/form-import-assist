import React from 'react';
import './App.css';
import FormComponent from './formComponent';

// This will be where we import and showcase our converted component
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Form Import Assist Example</h1>
        <p>Your converted form will appear here</p>
      </header>
      <main>
        <FormComponent />
      </main>
    </div>
  );
}

export default App;