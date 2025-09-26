
//------------------------------------------
//This component creates a row of mini-cards, one for each day in the forecast:
//hows the day name (Mon, Tue, etc.).
//Shows the high and low temperatures, formatted with the right unit (°C or °F).
// It doesn’t fetch or calculate weather itself — it just formats whatever items you pass it.
//------------------------------------------------------


import styles from "./ForecastStrip.module.css";

export default function ForecastStrip({ items, units }) {
  const u = units === "metric" ? "°C" : "°F";
  return (
    <section aria-label="5 day forecast" className={styles.strip}>
        {/* loops through each forecast item(array of days) 
        key gives react a unique idea, using index here
        inside each card you have the day label, high and low temp with unit*/}
      {items.map((d, i) => (
        <div key={i} className={styles.dayCard}>
          <div className={styles.day}>{d.day}</div>
          <div className={styles.temps}>
            <strong>
              {d.hi}
              {u}
            </strong>{" "}
            / {d.lo}
            {u}
          </div>
        </div>
      ))}
    </section>
  );
}
