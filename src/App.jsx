//-------------------------------------------------------------------------//
// WHAT IT DOES: Renders the app frame, wires search/geolocate/unit toggle,
// and fetches current + 5-day forecast from OpenWeatherMap.
//
// HOW THIS FILE FITS IN:
// - Imports UI components (SearchBar, UnitToggle, cards, skeletons, etc.)
// - Calls API helpers from ./api/openWeather (geocodeCity, getCurrent, getForecast)
// - Uses small format helpers from ./utils/format
// - Owns high-level state (units, location, current, forecast, loading, error)
//
// KEY IDEAS / WHY WE CHOSE THIS SHAPE:
// - Keep API calls out of components like <CurrentCard/> and <ForecastStrip/>.
//   That keeps UI components pure/presentational and easier to test.
// - LocalStorage is used for two nice UX wins:
//   (1) remember unit choice; (2) reload last location on refresh.
// - Forecast reduction: OWM returns 3-hour slices; we group by day (local tz),
//   compute hi/lo, and pick an icon near midday for a stable daily summary.
// - Error messages are normalized in niceErrorMessage() to keep UI tidy.
//-------------------------------------------------------------------------//

import { useState, useEffect } from "react";
import styles from "./App.module.css";
import ThemeToggle from "./components/ThemeToggle";

import SearchBar from "./components/SearchBar";
import UnitToggle from "./components/UnitToggle";
import CurrentCard from "./components/CurrentCard";
import ForecastStrip from "./components/ForecastStrip";
import ErrorBanner from "./components/ErrorBanner";
import CityPicker from "./components/CityPicker";
import SkeletonCurrent from "./components/SkeletonCurrent";
import SkeletonForecast from "./components/SkeletonForecast";

// API: network Logic + response shaping lives in ./api
import { geocodeCity, getCurrent, getForecast } from "./api/openWeather";
//Utils: small, synchronous helpers for display/formatting
import { iconUrl, kphFromMs, dayShortFrom } from "./utils/format";

function App() {
  //candidate geocode hits shown in CityPicker when search is ambiguous
  const [candidates, setCandidates] = useState([]);
  // units persist across reloads -> "metric" or "imperial"
  const [units, setUnits] = useState(
    () => localStorage.getItem("units") || "metric"
  );
  // App-wide async flags + error message
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // last chosen place { lat, lon, label } persists via LocalStorage
  //WHY: refreshing the page keeps the same city visible
  const [location, setLocation] = useState(() => {
    const s = localStorage.getItem("lastLocation");
    return s ? JSON.parse(s) : null;
  });

  //View models for UI (kept simple so presentational components stay dumb)
  const [current, setCurrent] = useState(null); // current weather view-model
  const [forecast, setForecast] = useState([]); // 5-day summary

  // ---------- tiny display helpers ----------
  function capitalize(s = "") {
    //WHY: OWM descriptions are lowercase; capitalize for nicer UI
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function niceErrorMessage(err) {
    //WHY: unify many possible error shapes -> 1 clean user message
    //Common bug history:
    //-  Missing .env key -> dev server must restart after adding .env.local
    // - 401s from OWM when they key is invalid
    // - 429 rate-limits if testing frequently on free tier
    // - Network errors (ad blockers sometimes block Localhost fetch)
    const msg = String(err?.message || err);
    if (msg.includes("Missing REACT_APP_OWM_KEY"))
      return "API key missing (.env.local). Restart the dev server.";
    if (msg.match(/401|invalid api key/i))
      return "Invalid API key. Double-check your key and restart.";
    if (msg.includes("429"))
      return "Rate limit reached on OpenWeatherMap. Try again shortly.";
    if (msg.match(/Network error|Failed to fetch/i))
      return "Network error. Check your connection or disable ad-blockers for localhost.";
    return "Could not load weather. Check the city name and try again.";
  }

  // Persist unit choice for future visits
  useEffect(() => {
    localStorage.setItem("units", units);
  }, [units]);

  // Persist last location when it changes
  useEffect(() => {
    if (location) {
      localStorage.setItem("lastLocation", JSON.stringify(location));
    }
  }, [location]);

  // When units change, refetch with the same coordinates to update UI
  // NOTE: eslint-disable comment avoids re-calling on function identity changes
  useEffect(() => {
    if (location) {
      // fire and forget: errors are already handled inside LoadBycoords
      loadByCoords(location.lat, location.lon, location.label).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  // ---------------------------
  // Fetch helpers
  // ---------------------------
  async function loadByCoords(lat, lon, label) {
    // WHY centralize: keeps all fetch/error/parsing logic in one place
    try {
      setError("");
      setLoading(true);

      //Run both calls in parallel for speed
      const [cur, fc] = await Promise.all([
        getCurrent(lat, lon, units),
        getForecast(lat, lon, units),
      ]);

      // Map "Current" API payload -> compact view-model
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
        updatedAt: new Date().toISOString(), // used for footer "Last updated"
      };

      // ----- Reduce 3-hour forecast → 5 daily summaries (robust) -----
      // WHY: OWM 5-day endpoint provides 40x 3-hour slots; I group by local day
      const tz = fc?.city?.timezone ?? 0; // seconds offset from UTC
      const list = Array.isArray(fc?.list) ? fc.list : [];
      if (list.length === 0) {
        // Defensive: if OWM changes/limits payload, fail gracefully
        throw new Error("Forecast payload missing 'list' from OWM.");
      }

      // 1) Group entries by local YYYY-MM-DD using city timezone
      const groups = new Map();
      for (const it of list) {
        // shift by timezone so "day" boundaries are correct for the location
        const local = new Date((it.dt + tz) * 1000); // shift by tz
        const y = local.getUTCFullYear();
        const m = String(local.getUTCMonth() + 1).padStart(2, "0");
        const d = String(local.getUTCDate()).padStart(2, "0");
        const key = `${y}-${m}-${d}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(it);
      }

      // 2) Build day summaries in chronological order (first 5 days)
      const daily = [];
      for (const key of Array.from(groups.keys()).slice(0, 5)) {
        const items = groups.get(key) ?? [];
        if (items.length === 0) continue;

        let hi = Number.NEGATIVE_INFINITY;
        let lo = Number.POSITIVE_INFINITY;
        let bestIcon = "";
        let bestMidness = 999;

        // WHY pick "midday-ish" icon:
        // Morning/evening icons can feel misleading noon-ish is a stable preview
        for (const it of items) {
          hi = Math.max(
            hi,
            Math.round(it.main?.temp_max ?? Number.NEGATIVE_INFINITY)
          );
          lo = Math.min(
            lo,
            Math.round(it.main?.temp_min ?? Number.POSITIVE_INFINITY)
          );

          const code = it.weather?.[0]?.icon || "";
          const localHour = ((((it.dt + tz) / 3600) % 24) + 24) % 24; // 0..23, safe mod
          const midness = Math.abs(localHour - 12); // closeness to midday
          if (code && midness < bestMidness) {
            bestMidness = midness;
            bestIcon = code;
          }
        }
        // Defensive checks to skip malformed days while keeping the app alive
        if (!Number.isFinite(hi) || !Number.isFinite(lo)) continue; // skip malformed days
        if (!bestIcon) bestIcon = "01d"; // sunny fallback

        daily.push({
          day: dayShortFrom(items[0].dt, tz), // e.g., "Fri" using city timezone
          hi,
          lo,
          icon: bestIcon,
          iconUrl: `https://openweathermap.org/img/wn/${bestIcon}@2x.png`,
        });
      }

      if (daily.length === 0) {
        throw new Error("Could not summarize daily forecast.");
      }
      // commit all view-model state at once after successful parsing
      setCurrent(curData);
      setForecast(daily);
      setLocation({ lat, lon, label: displayLabel });
    } catch (err) {
      // Centralized error surface -> consistent UX + easier debugging
      console.error(err);
      setError(niceErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------
  // UI event handlers
  // ---------------------------
  const handleSearchSubmit = async (q) => {
    // WHY: decouple search from LoadByCoords, so we can handle 1 vs many results
    try {
      setError("");
      setLoading(true);
      setCandidates([]);

      const results = await geocodeCity(q, 5);

      if (!results || results.length === 0) {
        setError("No matching city found.");
        return;
      }

      // Single hit -> skip City Picker, load immediately
      if (results.length === 1) {
        const p = results[0];
        const label = [p.name, p.state, p.country].filter(Boolean).join(", ");
        await loadByCoords(p.lat, p.lon, label);
        return;
      }

      // multiple results → let the user choose
      setCandidates(results);
    } catch (err) {
      console.error(err);
      setError(niceErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    // WHY: quick UX path for current location
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
      (geoErr) => {
        console.error(geoErr);
        setError("Location permission denied or unavailable.");
      }
    );
  };

  // -- CityPicker handlers (must be inside App component) --
  const handlePickCity = async (p) => {
    // WHY: flows from CityPicker ->finalizes the users choice
    const label = [p.name, p.state, p.country].filter(Boolean).join(", ");
    setCandidates([]);
    await loadByCoords(p.lat, p.lon, label);
  };

  const handleCancelPick = () => setCandidates([]);

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className={styles.app}>
      
      <header className={styles.header}>
        <h1 className={styles.brand}>The Neather Wetwork</h1>
        <div className={styles.controls}>
          <SearchBar
            onSubmit={handleSearchSubmit}
            onUseMyLocation={handleUseMyLocation}
          />
          {/* Why: unit togggle here keeps global state centralized in App */}
          <UnitToggle units={units} setUnits={setUnits} />
          <ThemeToggle />
        </div>
      </header>
      {/*  If there are multiple city matches, show a modal/panel to choose */}
      {candidates.length > 0 && (
        <CityPicker
          options={candidates}
          onPick={handlePickCity}
          onCancel={handleCancelPick}
        />
      )}

      <main className={styles.main}>
        {/* Top-level error surface (human-friendly via niceErrorMessage) */}
        {error && <ErrorBanner message={error} />}

        {/* Loading skeletons -> instant perceived performance */}
        {loading ? (
          <>
            <SkeletonCurrent />
            <SkeletonForecast />
          </>
        ) : current ? (
          // Happy path: current + summarized forecast
          <>
            <CurrentCard data={current} units={units} />
            <ForecastStrip items={forecast} units={units} />
          </>
        ) : (
          // First-run empty state
          <p className={styles.hint}>
            Search a city or use your location to see the forecast.
          </p>
        )}
      </main>
      {/*  footer shows "Last updated" for transparency */}
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
