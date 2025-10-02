//-------------------------------------------------------------------------//
// WHAT: SearchBar component
// PURPOSE: Lets the user type a city name to search for weather,
//          or optionally click "Use my location".
//
// HOW IT FITS IN:
// - Calls parent’s onSubmit(q) when user presses Enter or clicks "Search"
// - Calls parent’s onUseMyLocation() when location button is clicked
// - Keeps its own input value state (controlled input pattern)
//
// KEY CHOICES / WHY:
// - Controlled <input>: keeps React in charge of input value.
// - e.preventDefault() stops default form refresh behavior on submit.
// - .trim() removes stray whitespace so “ Banff ” still works.
// - Guard clause (if no q) avoids wasting API calls on empty strings.
// - Accessibility: role="search", aria-labels on form + input + buttons.
//-------------------------------------------------------------------------//

import { useState } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ onSubmit, onUseMyLocation }) {
  // Local state for input field
  const [value, setValue] = useState("");

  // Handles form submit -> passes cleaned-up query to parent
  const handleSubmit = (e) => {
    e.preventDefault(); // stop full page reload

    const q = value.trim();

    if (!q) return; // skip empty submissions
    onSubmit(q); // tell parent component “fetch this city’s weather”
  };
  //-------------------------------------------------//

  return (
    <form
      className={styles.wrap}
      onSubmit={handleSubmit}
      role="search" // Accessibility: defines region as search
      aria-label="Search city"
    >
      <input
        className={styles.input}
        placeholder="Search city (e.g., Banff)"
        value={value} // controlled input value
        onChange={(e) => setValue(e.target.value)}
        aria-label="City name"
      />
      <button className={styles.btn} type="submit">
        Search
      </button>
      <button
        className={styles.btnGhost}
        type="button" // prevent acting as submit button
        onClick={onUseMyLocation}
        aria-label="Use my location"
      >
        Use my location
      </button>
    </form>
  );
}
