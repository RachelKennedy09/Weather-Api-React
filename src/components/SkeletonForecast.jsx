//-------------------------------------------------------------------------//
// WHAT: SkeletonForecast component
// PURPOSE: Placeholder for the 5-day forecast strip while data is loading.
//          Shows 5 "empty cards" with shimmer blocks (day, icon, temps).
//
// HOW IT FITS IN:
// - Used in App.jsx when `loading` is true.
// - Mirrors ForecastStrip.jsx (same structure: day label, icon, temps).
// - Keeps layout consistent so users don’t see "jumps" when real data loads.
//
// KEY CHOICES / WHY:
// - Array.from({ length: 5 }) -> generate 5 skeleton cards to match forecast days.
// - aria-hidden="true" -> skeletons are purely visual; screen readers ignore them.
// - Each card has 3 placeholder divs: day, icon, temps.
//-------------------------------------------------------------------------//

import styles from "./SkeletonForecast.module.css";

export default function SkeletonForecast() {
  return (
    <section className={styles.strip} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={styles.card}>
          {/* Placeholder for weekday label */}
          <div className={styles.day} />

          {/* Placeholder for weather icon */}
          <div className={styles.icon} />

          {/* Placeholder for hi/lo temperatures */}
          <div className={styles.temps} />
        </div>
      ))}
    </section>
  );
}
