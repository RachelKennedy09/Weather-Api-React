//-------------------------------------------------------------------------//
// WHAT: ErrorBanner component
// PURPOSE: Displays a user-friendly error message when something goes wrong.
//
// HOW IT FITS IN:
// - App.jsx sets `error` when fetches fail or invalid input occurs.
// - If error is present, <ErrorBanner/> renders a styled alert at top of main area.
// - Keeps error UI cleanly separated from app logic.
//
// KEY CHOICES / WHY:
// - Guard clause: if no message, return null-> no empty DOM noise.
// - role="alert": tells assistive tech (screen readers) this is urgent info.
// - Styling handled in ErrorBanner.module.css to keep visuals separate.
//-------------------------------------------------------------------------//

import styles from "./ErrorBanner.module.css";

export default function ErrorBanner({ message }) {
  // Defensive: if no error message, don’t render anything
  if (!message) return null;
  return (
    // role="alert" makes screen readers announce the error immediately.
    <div role="alert" className={styles.err}>
      {message}
    </div>
  );
}
