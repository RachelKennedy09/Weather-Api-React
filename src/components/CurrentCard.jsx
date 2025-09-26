//--------------------------------------------------------
//What: This component is a weather card that displays: 
// City + weather description. 
// Big temperature + “feels like” temperature.
// Humidity, wind speed, and last update time.
// It doesn’t fetch data itself — it just takes the data object (from a parent component, like App) and formats it nicely for display.
//------------------------------------------------------

import styles from "./CurrentCard.module.css";

export default function CurrentCard({ data, units }) {
    //if units are metric, use celsius + kilometers per hour, otherwise fahrenheit + miles per hour.
  const uTemp = units === "metric" ? "°C" : "°F";
  const uWind = units === "metric" ? "km/h" : "mph";

  return (
    <section className={styles.card} aria-label="Current Conditions">
      <div className={styles.top}>
        <h2 className={styles.city}>{data.city}</h2>
        <span className={styles.desc}>{data.description}</span>
      </div>
      <div className={styles.grid}>
        {/*take current temp and rounds to nearest whole number, uTemp shows celsius or fahrenheit */}
        <div className={styles.bigTemp}>
          {Math.round(data.temp)}
          {uTemp}
          <div className={styles.feels}>
            feels {Math.round(data.feelsLike)}
            {uTemp}
          </div>
        </div>

        <div className={styles.meta}>
          <div>
            Humidity <strong>{data.humidity}%</strong>
          </div>
          <div>
            Wnd{" "}
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
