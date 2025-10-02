//-------------------------------------------------------------------------//
// WHAT: Entry point of the React app
// PURPOSE: Bootstraps React, attaches <App /> to the DOM, and applies global styles.
//
// HOW IT FITS IN:
// - This is the very first JS file executed in my React app.
// - It renders the <App /> component into the <div id="root"> inside index.html.
// - Pulls in global CSS (index.css) before module styles.
// - Uses React 18’s new createRoot API instead of the old ReactDOM.render().
//-------------------------------------------------------------------------//

import React from "react";
import ReactDOM from "react-dom/client"; // React 18+ root API
import "./index.css"; // global styles (font, smoothing, reset)
import App from "./App.jsx"; // main app component

// Get the root DOM element defined in public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the entire React app inside #root
root.render(<App />);
