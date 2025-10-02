//-------------------------------------------------------------------------//
// WHAT: Loader component
// PURPOSE: Shows a spinner + text while data is being fetched.
//
// HOW IT FITS IN:
// - Used in places where I want to indicate loading state (e.g. before
//   current weather/forecast appear).
// - Keeps loading logic reusable instead of duplicating spinners everywhere.
//
// KEY CHOICES / WHY:
// - Default label = "Loading..." but customizable via prop → flexible.
// - role="status" + aria-live="polite": accessibility -> screen readers
//   announce when loading starts/changes, but politely (not interrupting).
// - Spinner is a styled div (via CSS) for smooth animation.
//-------------------------------------------------------------------------//

import styles from "./Loader.module.css";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      {/* Visual spinner, styled with CSS animation */}
      <div className={styles.spinner} />
      {/* Text label (e.g., "Loading forecast..." if custom label passed) */}
      <span>{label}</span>
    </div>
  );
}
