/* ---------------------------------------------------------------------------
   FILE: index.js
   WHAT: App entry point. Mounts the React application to #root.
   WHY:  Applies the saved theme *before* React renders (first paint),
         so the correct colors + background photo are visible immediately.
   HOW:  Reads theme key from localStorage (fallback: "sunny"),
         then sets:
           1) <html data-theme="...">  -> enables CSS color tokens in App.module.css
           2) CSS variable --photo     -> used by App.module.css ::before for the bg image
         Finally, renders <App />.
   CONNECTS TO:
         - themeImages.js -> provides THEME_IMAGES (theme → bundled image)
         - App.module.css -> consumes data-theme and var(--photo)
         - ThemeToggle.jsx -> updates the same globals when the user changes theme
--------------------------------------------------------------------------- */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { THEME_IMAGES } from "./themeImages";

/* ---------------------------------------------------------------------------
   SAFETY: Resolve a valid theme key (fallback to "sunny").
   Notes:
     - Guards against missing/bad localStorage values.
     - Keep this in sync with the valid keys in themeImages.js (THEMES array).
--------------------------------------------------------------------------- */
function resolveInitialTheme() {
  try {
    const stored = localStorage.getItem("theme");
    const valid = ["fall", "sunny", "cloudy", "rain", "snow"];
    return valid.includes(stored) ? stored : "sunny";
  } catch {
    // localStorage may be blocked/unsupported; default safely
    return "sunny";
  }
}

/* ---------------------------------------------------------------------------
   FIRST PAINT: Apply theme globals before React mounts.
   Sets:
     - data-theme on <html> -> color palette tokens
     - --photo CSS var      -> background image (via imported URLs)
--------------------------------------------------------------------------- */
const initial = resolveInitialTheme();
document.documentElement.setAttribute("data-theme", initial);
document.documentElement.style.setProperty(
  "--photo",
  THEME_IMAGES[initial] ? `url(${THEME_IMAGES[initial]})` : "none"
);

/* ---------------------------------------------------------------------------
   MOUNT: Render the application.
--------------------------------------------------------------------------- */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
