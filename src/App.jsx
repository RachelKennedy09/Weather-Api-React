//-------------------------------------------------------------------------//
// WHAT IT DOES: Renders the page frame and plugs in components with dummy props
// WHY: Proves the layout/visuals work before touching the API
//-------------------------------------------------------------------------//
import { useState, useEffect } from "react";
import styles from "./App.module.css";

import { SearchBar } from "./components/SearchBar";
import { UnitToggle } from "./components/UnitToggle";
import { ErrorBanner } from "./components/ErrorBanner";
import { Loader } from "./components/Loader";
import { CurrentCard } from "./components/CurrentCard";

function App() {
  // units is either metric or imperial, reads a previously saved value(unit) or defaults to metric
  const [units, setUnits] = useState(
    () => localStorage.getItem("units") || "metric"
  );
  //loading auto set to false unless true
  const [loading, setLoading] = useState(false);
  //null for best practices, no empty strings
  const [error, setError] = useState(null);

  //fake demo data to test layout
  const [current, setCurrent] = useState({
    city: "Banff",
    temp: 12,
    feelsLike: 10,
    humidity: 65,
    windKph: 14,
    icon: "cloud",
    description: "Cloudy",
    updatedAt: new Date().toISOString(),
  });

  const [forecast, setForecast] = useState([
    { day: "Fri", hi: 14, lo: 5, icon: "cloud" },
    { day: "Sat", hi: 15, lo: 6, icon: "rain" },
    { day: "Sun", hi: 11, lo: 2, icon: "sun" },
    { day: "Mon", hi: 9, lo: 1, icon: "snow" },
    { day: "Tue", hi: 12, lo: 4, icon: "cloud" },
  ]);

  //persist unit choice, runs whenever units CHANGE. W
  // Write to localstorage for persistence between page loads
  useEffect(() => {
    localStorage.setItem("units", units);
  }, [units]);

  //Event handlers to wire to search bar later, will trigger geocoding-fetch weather
  const handleSearchSubmit = (cityString) => {
    //Step 3 will fetch real data here
    console.log("Search for:", cityString);
  };
  //will call the geolocation api, then fetch lat/lon
  const handleUseMyLocation = () => {
    //step 3: geoLocate -> fetch
    console.log("Use my location clicked");
  };

  //JSX render tree
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.brand}>Weather Pro</h1>
        <div className={styles.controls}>
          <SearchBar
            onSubmit={handleSearchSubmit}
            onUseMyLocation={handleUseMyLocation}
          />
          <UnitToggle units={units} setUnits={setUnits} />
        </div>
      </header>

      <main className={styles.main}>
        {/* show errorBanner if error, show loader if loading, else show cards*/}
        {error && <ErrorBanner message={error} />}
        {loading ? (
          <Loader label="Loading weather..." />
        ) : (
          <>
            <CurrentCard data={current} units={units} />
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <small>
          Data from OpenWeatherMap - Last updated{" "}
          {new Date(current.updatedAt).toLocaleTimeString()}
        </small>
      </footer>
    </div>
  );
}
