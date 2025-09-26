import styles from "./ForecastStrip.module.css";
import { iconUrl as buildIconUrl } from "../utils/format";

export default function ForecastStrip({ items = [], units }) {
  const u = units === "metric" ? "°C" : "°F";
  return (
    <section aria-label="5 day forecast" className={styles.strip}>
      {items.map((d, i) => {
        const src = d.iconUrl || (d.icon ? buildIconUrl(d.icon) : "");
        return (
          <div key={i} className={styles.dayCard}>
            <div className={styles.day}>{d.day}</div>
            {src ? <img className={styles.smallIcon} src={src} alt="" /> : null}
            <div className={styles.temps}><strong>{d.hi}{u}</strong> / {d.lo}{u}</div>
          </div>
        );
      })}
    </section>
  );
}
