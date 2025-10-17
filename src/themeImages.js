/* ---------------------------------------------------------------------------
   FILE: themeImages.js
   WHAT: Central mapping of theme keys -> imported background images.
   WHY:  Avoids brittle CSS/public paths by letting Webpack/Vite bundle images.
         Consumers set a CSS variable (--photo) to update the background quickly.
   HOW:  Import images from src/assets, export a keyed map and a canonical
         THEMES list so components can iterate safely.
   CONNECTS TO:
         - App.module.css  -> uses var(--photo) for the ::before background layer
         - ThemeToggle.jsx -> reads THEMES; sets data-theme and --photo dynamically
         - index.js        -> sets the initial theme/--photo on first paint
--------------------------------------------------------------------------- */

/* Theme assets (kept in src/assets to ensure bundling + cache-fingerprints) */
import fall   from "./assets/themes/fall.jpg";
import sunny  from "./assets/themes/sunny.jpg";
import cloudy from "./assets/themes/cloudy.jpg";
import rain   from "./assets/themes/rain.jpg";
import snow   from "./assets/themes/snow.jpg";

/** list of supported themes (keep in sync with App.module.css) */
export const THEMES = ["fall", "sunny", "cloudy", "rain", "snow"];

/** Default theme used when no preference is stored */
export const DEFAULT_THEME = "sunny";

/** Map of theme -> image URL (bundled by the build tool) */
export const THEME_IMAGES = {
  fall,
  sunny,
  cloudy,
  rain,
  snow,
};

/** Type guard / safety check */
export function isValidTheme(t) {
  return THEMES.includes(t);
}

/**
 * Resolve a safe theme key from an arbitrary value.
 * Falls back to DEFAULT_THEME when invalid.
 */
export function resolveTheme(t) {
  return isValidTheme(t) ? t : DEFAULT_THEME;
}

/**
 * (Optional) Apply theme globals in one place.
 * Use this to DRY `index.js` and `ThemeToggle.jsx` if desired.
 *
 * Actions:
 *  1) <html data-theme="...">      -> color tokens in CSS
 *  2) documentElement --photo url  -> background image in CSS
 *  3) persist to localStorage
 */
export function applyThemeGlobals(theme) {
  const t = resolveTheme(theme);
  document.documentElement.setAttribute("data-theme", t);

  const imgUrl = THEME_IMAGES[t] ? `url(${THEME_IMAGES[t]})` : "none";
  document.documentElement.style.setProperty("--photo", imgUrl);

  localStorage.setItem("theme", t);
  return t; // return the applied key for convenience
}
