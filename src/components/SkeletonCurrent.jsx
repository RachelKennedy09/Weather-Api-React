//-------------------------------------------------------------------------//
// WHAT: SkeletonCurrent component
// PURPOSE: Shows a placeholder "skeleton" card while the current weather
//          data is loading. Creates a shimmer effect so users see
//          something immediately instead of a blank space.
//
// HOW IT FITS IN:
// - Used in App.jsx when `loading` is true (before API response).
// - Mirrors the structure of CurrentCard (title, big temp, meta lines).
// - Marked aria-hidden -> accessibility: screen readers ignore placeholders.
//
// KEY CHOICES / WHY:
// - Empty divs with shimmer classes simulate content blocks (title, lines).
// - Layout matches CurrentCard, so swap feels seamless when data loads.
//------------------------------------------------------------------------

import styles from "./SkeletonCurrent.module.css";
export default function SkeletonCurrent() {
  return (
    <section className={styles.card} aria-hidden="true">
      {/* Fake city title block */}
      <div className={`${styles.shimmer} ${styles.title}`} />

      <div className={styles.row}>
        <div className={`${styles.shimmer} ${styles.big}`} />

        {/* Fake meta info: 3 stacked lines */}
        <div className={styles.meta}>
          <div className={`${styles.shimmer} ${styles.line}`} />
          <div className={`${styles.shimmer} ${styles.line}`} />
          <div className={`${styles.shimmer} ${styles.line}`} />
        </div>
      </div>
    </section>
  );
}
