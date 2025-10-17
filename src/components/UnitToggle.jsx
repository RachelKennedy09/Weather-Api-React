//-------------------------------------------------------------------------//
// WHAT: UnitToggle component
// PURPOSE: Lets the user switch between °C (metric) and °F (imperial).
//
// HOW IT FITS IN:
// - App.jsx owns `units` state, passes it here along with setUnits updater.
// - When a button is clicked, we call setUnits("metric" | "imperial").
// - Because App watches units with useEffect, it automatically re-fetches
//   weather data in the correct units.
//
// KEY CHOICES / WHY:
// - Role="group" + aria-label="Units": accessibility -> screen readers announce
//   these two buttons as a logical toggle group.
// - Active button styled differently → gives user feedback which unit is selected.
// - Two explicit buttons instead of a single toggle switch → clearer UI for all users.
//-------------------------------------------------------------------------//

import styles from "./UnitToggle.module.css";

export default function UnitToggle({ units, setUnits }) {
  const isC = units === "metric"; // Boolean flag for current selection

  return (
    <div className={styles.toggle} role="group" aria-label="Units">
      <button
        className={`${styles.btn} ${isC ? styles.active : ""}`} // Active style if Celsius selected
        type="button"
        onClick={() => setUnits("metric")}
      >
        °C
      </button>
      <button
        className={`${styles.btn} ${!isC ? styles.active : ""}`} // Active style if Fahrenheit selected
        type="button"
        onClick={() => setUnits("imperial")}
      >
        °F
      </button>
    </div>
  );
}
