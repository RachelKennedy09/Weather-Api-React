import styles from "./UnitToggle.module.css";

export default function UnitToggle({ units, setUnits }) {
  const isC = units === "metric";

  return (
    <div className={styles.toggle} role="group" aria-label="Units">
      <button
        className={`%{styles.btn} ${isC ? styles.active : ""}`}
        type="button"
        onClick={() => setUnits("metric")}
      >
        °C
      </button>
      <button
        className={`${styles.btn} ${!isC ? styles.active : ""}`}
        type="button"
        onClick={() => setUnits("imperial")}
      >
        °F
      </button>
    </div>
  );
}
