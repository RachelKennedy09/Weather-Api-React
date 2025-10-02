//-------------------------------------------------------------------------//
// WHAT: CurrentCard component
// PURPOSE: Displays the "current conditions" weather card (city name, icon,
//          temperature, humidity, wind, last updated time).
//
// HOW IT FITS IN:
// - Gets a clean `data` view-model from App.jsx (already shaped nicely).
// - Units are passed separately (so card stays dumb/presentational).
// - Keeps UI consistent and avoids repeating logic across components.
//
// KEY CHOICES / WHY:
// - Guard clause: if no `data`, return null -> prevents rendering errors.
// - Units handled here with uTemp/uWind-> avoids hardcoding °C vs °F, km/h vs mph.
// - Weather icon: prefer prebuilt URL `data.iconUrl`, else fallback via utils.
// - Updated time: formatted with toLocaleTimeString() -> auto-localized.
//-------------------------------------------------------------------------//

import styles from "./CurrentCard.module.css";
import { iconUrl as buildIconUrl } from "../utils/format";

export default function CurrentCard({ data, units }) {
  // Defensive: if App hasn’t fetched data yet, don’t render anything
  if (!data) return null;

  // Choose proper display units
  const uTemp = units === "metric" ? "°C" : "°F";
  const uWind = units === "metric" ? "km/h" : "mph";
  // Build icon source:
  // - Prefer explicit data.iconUrl (set in App’s view-model)
  // - Fallback: build URL from short code if available
  const src = data.iconUrl || (data.icon ? buildIconUrl(data.icon) : "");

  return (
    <section className={styles.card} aria-label="Current conditions">
      {/* --- Top row: city + description + weather icon --- */}
      <div className={styles.top}>
        <div>
          <h2 className={styles.city}>{data.city}</h2>
          <span className={styles.desc}>{data.description}</span>
        </div>
        {src ? (
          <img
            className={styles.icon}
            src={src}
            alt={data.description || "weather"}
          />
        ) : null}
      </div>

      {/* --- Grid with temperature and metadata --- */}
      <div className={styles.grid}>
        {/* Big temperature block */}
        <div className={styles.bigTemp}>
          {Math.round(data.temp)}
          {uTemp}
          <div className={styles.feels}>
            feels {Math.round(data.feelsLike)}
            {uTemp}
          </div>
        </div>
        {/* Meta info: humidity, wind, last updated */}
        <div className={styles.meta}>
          <div>
            Humidity <strong>{data.humidity}%</strong>
          </div>
          <div>
            Wind{" "}
            <strong>
              {Math.round(data.windKph)} {uWind}
            </strong>
          </div>
          <div>
            Updated{" "}
            <strong>{new Date(data.updatedAt).toLocaleTimeString()}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
