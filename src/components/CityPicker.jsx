//-------------------------------------------------------------------------//
// WHAT: CityPicker component
// PURPOSE: Shows a modal-style list of candidate cities when a search
//          returns multiple matches (e.g., "Paris" -> Paris, France vs Paris, TX).
//
// HOW IT FITS IN:
// - App.jsx triggers this if geocodeCity() returns >1 result
// - Lets the user disambiguate by clicking the correct city
// - Options array = { name, state?, country, lat, lon }
//
// KEY CHOICES / WHY:
// - Modal overlay with backdrop for focus and accessibility
// - Each option is a button -> ensures keyboard accessibility
// - Lat/Lon shown as a quick check that it’s the correct location
// - Uses CSS modules for scoped styling (see CityPicker.module.css)
//
// BUG FIXES:
//  - added role="dialog" + "aria-model="true" so screen readers know its a modal.
//  - if (!options.length) return null; avoids rendering an empty modal if something goes wrong.
//-------------------------------------------------------------------------//

import styles from "./CityPicker.module.css";

export default function CityPicker({ options = [], onPick, onCancel }) {
  // Defensive: if no options, render nothing (null)
  if (!options.length) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog" // Accessibility: announces as a modal dialog
      aria-modal="true" // Accessibility: signals focus trap context
      aria-label="Select a city"
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <h3>Select a city</h3>
          {/* Close button in header (X) */}
          <button
            type="button"
            className={styles.close}
            onClick={onCancel} // Calls parent cancel handler
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Options list */}
        <ul className={styles.list}>
          {options.map((p, i) => {
            // Build display label -> "City, State, Country"
            const label = [p.name, p.state, p.country]
              .filter(Boolean) // Only keep non-empty values
              .join(", ");
            return (
              <li key={`${p.lat},${p.lon}-${i}`}>
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => onPick(p)} // User picks this city
                >
                  <div className={styles.label}>{label}</div>
                  <div className={styles.sub}>
                    {/* Show coordinates to help distinguish duplicates */}
                    {p.lat.toFixed(2)}, {p.lon.toFixed(2)}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Footer Cancel button (secondary exit path) */}
        <div className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
