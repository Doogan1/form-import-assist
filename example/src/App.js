import React from 'react';
import './App.css';
import FormComponent from './Land_Division_PortalComponent';

// This will be where we import and showcase our converted component
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Form Import Assist Example</h1>
        <p>Your converted form will appear here</p>
      </header>
      <main>
      <link type="text/css" rel="stylesheet" href="https://cdn01.jotfor.ms/stylebuilder/static/form-common.css?v=674b3f4
      "/>
      <link type="text/css" rel="stylesheet" href="https://cdn02.jotfor.ms/themes/CSS/5e6b428acc8c4e222d1beb91.css?v=3.3.60851&themeRevisionID=5f30e2a790832f3e96009402"/>
      <link type="text/css" rel="stylesheet" href="https://cdn03.jotfor.ms/css/styles/payment/payment_styles.css?3.3.60851" />
      <link type="text/css" rel="stylesheet" href="https://cdn01.jotfor.ms/css/styles/payment/payment_feature.css?3.3.60851" />
        <FormComponent />
      </main>
    </div>

  );
}

export default App;