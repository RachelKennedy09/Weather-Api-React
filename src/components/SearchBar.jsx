//--------------------------------------------------------//
// Props: onSubmit(string), onUseMyLocation()
//What: Lets a user type a city name. Submitting that name back to the parent component
//      optionally letting the user click use my location
//Why: keep inputs controlled: submit on Enter/click
//--------------------------------------------------------//

import { useState } from "react";
import styles from "./SearchBar.module.css";

//This component is a search bar. It keeps track of what you type.
// When you press enter, it stops the page from refreshing, cleans up the input, and tells the parent component:
// “Here’s the city name they typed—go fetch the weather!”
export default function SearchBar({ onSubmit, onUseMyLocation }) {
  //value is empty string(text) in input box
  const [value, setValue] = useState("");

  //function when form is submitted
  //stops reload after submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    //trimming extra space in input after writing
    const q = value.trim();
    //if user submitted without typing anything exit early and don't call parent function
    if (!q) return;
    //finally call function
    onSubmit(q);
  };
  //-------------------------------------------------//

  return (
    <form
      className={styles.wrap}
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search city"
    >
      <input
        className={styles.input}
        placeholder="Search city (e.g., Banff)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="City name"
      />
      <button className={styles.btn} type="submit">
        Search
      </button>
      <button
        className={styles.btnGhost}
        type="button"
        onClick={onUseMyLocation}
        aria-label="Use my location"
      >
        Use my location
      </button>
    </form>
  );
}
