import styles from "./CurrentCard.module.css";
import { iconUrl as buildIconUrl } from "../utils/format";

export default function CurrentCard({ data, units }) {
  if (!data) return null;

  const uTemp = units === "metric" ? "°C" : "°F";
  const uWind = units === "metric" ? "km/h" : "mph";
  const src = data.iconUrl || (data.icon ? buildIconUrl(data.icon) : "");

  return (
    <section className={styles.card} aria-label="Current conditions">
      <div className={styles.top}>
        <div>
          <h2 className={styles.city}>{data.city}</h2>
          <span className={styles.desc}>{data.description}</span>
        </div>
        {src ? <img className={styles.icon} src={src} alt={data.description || "weather"} /> : null}
      </div>

      <div className={styles.grid}>
        <div className={styles.bigTemp}>
          {Math.round(data.temp)}{uTemp}
          <div className={styles.feels}>feels {Math.round(data.feelsLike)}{uTemp}</div>
        </div>
        <div className={styles.meta}>
          <div>Humidity <strong>{data.humidity}%</strong></div>
          <div>Wind <strong>{Math.round(data.windKph)} {uWind}</strong></div>
          <div>Updated <strong>{new Date(data.updatedAt).toLocaleTimeString()}</strong></div>
        </div>
      </div>
    </section>
  );
}
