/* ---------------------------------------------------------------------------
   FILE: ThemeToggle.jsx
   WHAT: Provides a toggle for switching between visual themes in the app.
   WHY:  Allows users to change both the color palette and background photo
         dynamically to match different weather moods (Fall, Sunny, Cloudy, Rain, Snow).
   HOW:  Uses React state + useEffect to update:
           1. data-theme attribute on <html> (for CSS color tokens)
           2. --photo CSS variable for the background image (via JS imports)
           3. localStorage to remember the user's theme between visits.
   CONNECTS TO:
           - App.module.css -> reads data-theme + --photo for dynamic theming
           - themeImages.js -> provides imported image paths per theme
           - ThemeToggle.module.css -> handles button layout and styling
--------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { THEME_IMAGES } from "../themeImages"; // JS map of theme -> image
import styles from "./ThemeToggle.module.css";

/* ---------------------------------------------------------------------------
   CONSTANTS
   THEMES: List of available theme keys (must match CSS selectors + themeImages)
   DEFAULT_THEME: Fallback when localStorage is empty or invalid
--------------------------------------------------------------------------- */
const THEMES = ["fall", "sunny", "cloudy", "rain", "snow"];
const DEFAULT_THEME = "sunny";

/* ---------------------------------------------------------------------------
   COMPONENT: ThemeToggle
   PURPOSE:
     - Displays a row of buttons (one per theme).
     - When clicked, updates the global theme and background photo.
     - Persists choice in localStorage for consistent user experience.
--------------------------------------------------------------------------- */
export default function ThemeToggle() {
  /* Load saved theme from localStorage or use default on first render */
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || DEFAULT_THEME
  );

  /* -------------------------------------------------------------------------
     EFFECT: Sync UI + CSS with selected theme
     Triggered whenever theme changes.
     ACTIONS:
       1. Set <html data-theme="..."> -> activates color tokens in CSS
       2. Set CSS variable --photo -> updates background image
       3. Save theme to localStorage -> persist across refreshes
  ------------------------------------------------------------------------- */
  useEffect(() => {
    // 1️ Update root <html> attribute for color scheme
    document.documentElement.setAttribute("data-theme", theme);

    // 2️ Update background photo variable (handled by App.module.css)
    const imgUrl = THEME_IMAGES[theme] ? `url(${THEME_IMAGES[theme]})` : "none";
    document.documentElement.style.setProperty("--photo", imgUrl);

    // 3️ Persist the chosen theme
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* -------------------------------------------------------------------------
     RENDER: A row of theme buttons.
     Accessibility:
       - role="group" -> communicates to screen readers that this is a control group
       - aria-pressed -> indicates which theme is currently active
  ------------------------------------------------------------------------- */
  return (
    <div className={styles.wrap} role="group" aria-label="App theme">
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={theme === t}
          onClick={() => setTheme(t)}
          className={`${styles.btn} ${theme === t ? styles.active : ""}`}
          title={`Switch to ${t}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
