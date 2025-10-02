//-------------------------------------------------------------------------//
// WHAT: ForecastStrip component
// PURPOSE: Displays the 5-day forecast as a horizontal strip of day cards.
//
// HOW IT FITS IN:
// - Gets processed forecast data from App.jsx (already reduced from OWM).
// - Each "item" has { day, hi, lo, icon, iconUrl }.
// - Stays purely presentational: no fetching, just rendering props.
//
// KEY CHOICES / WHY:
// - Guarded defaults: items = [] so map() never crashes.
// - Units are passed in as a prop (°C/°F), making it reusable.
// - Weather icons: prefer provided iconUrl, else build from short code.
// - Accessible <section> with aria-label for screen readers.
//-------------------------------------------------------------------------//

import styles from "./ForecastStrip.module.css";
import { iconUrl as buildIconUrl } from "../utils/format";

export default function ForecastStrip({ items = [], units }) {
  // Units shorthand for temperatures
  const u = units === "metric" ? "°C" : "°F";
  return (
    <section aria-label="5 day forecast" className={styles.strip}>
      {items.map((d, i) => {
        // Safe fallback: if no iconUrl provided, try building one
        const src = d.iconUrl || (d.icon ? buildIconUrl(d.icon) : "");
        return (
          <div key={i} className={styles.dayCard}>
            {/* Day label: e.g., "Mon", "Tue" */}
            <div className={styles.day}>{d.day}</div>
            {/* Icon (no alt text because context is clear + decorative) */}
            {src ? <img className={styles.smallIcon} src={src} alt="" /> : null}
            {/* Temps: hi in bold, then low */}
            <div className={styles.temps}>
              <strong>
                {d.hi}
                {u}
              </strong>{" "}
              / {d.lo}
              {u}
            </div>
          </div>
        );
      })}
    </section>
  );
}
