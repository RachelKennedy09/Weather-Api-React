//-------------------------------------------------------------------------//
// WHAT IT DOES: Renders the page frame and plugs in components with dummy props
// WHY: Proves the layout/visuals work before touching the API
//-------------------------------------------------------------------------//
import { useState, useEffect } from "react";
import styles from "./App.module.css";
// src/App.jsx
import SearchBar from "./components/SearchBar";
import UnitToggle from "./components/UnitToggle";
import CurrentCard from "./components/CurrentCard";
import ForecastStrip from "./components/ForecastStrip";
import ErrorBanner from "./components/ErrorBanner";
import Loader from "./components/Loader";

import { geocodeCity, getCurrent, getForecast } from "./api/openWeather";
import { iconUrl, kphFromMs, dayShortFrom } from "./utils/format";

function App() {
  // units is either metric or imperial, reads a previously saved value(unit) or defaults to metric
  const [units, setUnits] = useState(
    () => localStorage.getItem("units") || "metric"
  );
  //loading auto set to false unless true
  const [loading, setLoading] = useState(false);
  //null for best practices, no empty strings
  const [error, setError] = useState(null);

  //last chosen place { lat, lon, label }
  const [location, setLocation] = useState(() => {
    const s = localStorage.getItem("lastLocation");
    return s ? JSON.parse(s) : null;
  });

  //fake demo data to test layout
  const [current, setCurrent] = useState(null); //null until first fetch

  const [forecast, setForecast] = useState([]); // array of 5 days

  //persist unit choice, runs whenever units CHANGE. W
  // Write to localstorage for persistence between page loads
  useEffect(() => {
    localStorage.setItem("units", units);
  }, [units]);

  useEffect(() => {
    if (location) {
      localStorage.setItem("lastLocation", JSON.stringify(location));
    }
  }, [location]);

  //whenever units change, refetch for the saved location
  useEffect(() => {
    if (location) {
      loadByCoords(location.lat, location.lon, location.label).catch(() => {});
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  // ---------------------------
  // Fetch helpers
  // ---------------------------
  async function loadByCoords(lat, lon, label) {
    try {
      setError("");
      setLoading(true);

      const [cur, fc] = await Promise.all([
        getCurrent(lat, lon, units),
        getForecast(lat, lon, units),
      ]);

      // Current card mapping
      const curWeather = cur.weather?.[0];
      const displayLabel =
        label ||
        (cur.name
          ? `${cur.name}, ${cur.sys?.country || ""}`
          : "Selected location");

      const curData = {
        city: displayLabel,
        temp: Math.round(cur.main?.temp ?? 0),
        feelsLike: Math.round(cur.main?.feels_like ?? 0),
        humidity: cur.main?.humidity ?? 0,
        windKph:
          units === "metric"
            ? kphFromMs(cur.wind?.speed ?? 0)
            : Math.round(cur.wind?.speed ?? 0), // mph in imperial
        icon: curWeather?.icon || "",
        iconUrl: curWeather?.icon ? iconUrl(curWeather.icon) : "",
        description: curWeather?.description
          ? capitalize(curWeather.description)
          : "—",
        updatedAt: new Date().toISOString(),
      };

      // Reduce 3-hour forecast to 5 daily cards (robust)
      const tz = fc.city?.timezone ?? 0; // seconds

      // 1) Group entries by local YYYY-MM-DD
      const groups = new Map(); // dateKey -> array of items
      for (const item of fc.list || []) {
        const localMs = (item.dt + tz) * 1000;
        const d = new Date(localMs);
        const dateKey = d.toISOString().slice(0, 10); // YYYY-MM-DD in UTC; OK for grouping
        if (!groups.has(dateKey)) groups.set(dateKey, []);
        groups.get(dateKey).push(item);
      }

      // 2) For each date, compute hi/lo and pick an icon closest to local noon
      const daily = [];
      for (const items of groups.entries()) {
        let hi = Number.NEGATIVE_INFINITY;
        let lo = Number.POSITIVE_INFINITY;
        let bestIcon = "";
        let bestMidness = 999;

        for (const it of items) {
          hi = Math.max(hi, Math.round(it.main.temp_max));
          lo = Math.min(lo, Math.round(it.main.temp_min));

          const icon = it.weather?.[0]?.icon || "";
          const localHour = ((((it.dt + tz) / 3600) % 24) + 24) % 24; // 0..23
          const midness = Math.abs(localHour - 12);
          if (icon && midness < bestMidness) {
            bestMidness = midness;
            bestIcon = icon;
          }
        }

        if (!bestIcon) bestIcon = "01d"; // graceful fallback

        // Label (Fri, Sat...) based on the first item’s local day
        const first = items[0];
        const label = dayShortFrom(first.dt, tz);

        daily.push({
          day: label,
          hi,
          lo,
          icon: bestIcon,
          iconUrl: iconUrl(bestIcon),
        });
      }

      // Take first 5 days
      const firstFive = daily.slice(0, 5);
      setCurrent(curData);
      setForecast(firstFive);
      console.log("cur icon:", curData.icon, curData.iconUrl);
      console.log(
        "daily icons:",
        firstFive.map((d) => d.icon)
      );
      setLocation({ lat, lon, label: displayLabel });
    } catch (e) {
      console.error(e);
      setError(
        "Could not load weather. Check the city name, your API key, or try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function capitalize(s = "") {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ---------------------------
  // UI event handlers
  // ---------------------------
  const handleSearchSubmit = async (q) => {
    try {
      setError("");
      setLoading(true);
      const results = await geocodeCity(q, 5);
      if (!results || results.length === 0) {
        setError("No matching city found.");
        return;
      }
      // pick the best match (first)
      const place = results[0];
      const label = [place.name, place.state, place.country]
        .filter(Boolean)
        .join(", ");
      await loadByCoords(place.lat, place.lon, label);
    } catch (e) {
      console.error(e);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        loadByCoords(latitude, longitude, "My location");
      },
      () => setError("Location permission denied or unavailable.")
    );
  };

  // ---------------------------
  // Render
  // ---------------------------
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
        {error && <ErrorBanner message={error} />}

        {loading ? (
          <Loader label="Loading weather…" />
        ) : current ? (
          <>
            <CurrentCard data={current} units={units} />
            <ForecastStrip items={forecast} units={units} />
          </>
        ) : (
          <p className={styles.hint}>
            Search a city or use your location to see the forecast.
          </p>
        )}
      </main>

      <footer className={styles.footer}>
        <small>
          Data: OpenWeatherMap ·{" "}
          {current
            ? `Last updated ${new Date(current.updatedAt).toLocaleTimeString()}`
            : ""}
        </small>
      </footer>
    </div>
  );
}

export default App;
