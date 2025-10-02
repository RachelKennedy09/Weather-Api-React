//-------------------------------------------------------------------------//
// WHAT: OpenWeatherMAP API helpers (geocode, current, 5-day forecast)
//
//HOW THIS FILE FITS IN:
// - Provides async functions for all network calls to OpenWeatherMap
// - Keeps API URLS, API key usage, and fetch error handling in on place
// - Lets UI components (App.jsx, etc.) stay clean by importing these helpers
//
// KEY IDEAS/ WHY I CHOSE THIS SHAPE:
// - centralized fetch wrapper (`http`) avoids repeating try/catch everywhere
// - Each export corresponds to one OWM endpoint (geocode, current, forecast)
// - We throw Errors with human-readable messages -> caught in App and converted
//   to nice messages by niceErrorMessage()
// - BUG FIX NOTES:
// - Forecast endpoint URL originally had '&&long` duplication and typo;
//     I fixed to a single `&lon=${lon} and bug was fixed.
// - .env.local with REACT_APP_OWM_KEY must exist, and server must restart after editing it.
//-------------------------------------------------------------------------//

// API key is injected from .env.local at build-time by Vite/CRA.
// Example: REACT_AP_OWM_KEY=abc123 in .env.local
const KEY = process.env.REACT_APP_OWM_KEY;

// Generic fetch wrapper
async function http(url) {
  let res;
  try {
    // WHY: wrap fetch in try/catch -> so it can give a clean "network" error
    res = await fetch(url);
  } catch (err) {
    // Common issue: offline, bad wifi, or ad-blocker intercepting requests
    throw new Error(
      "Network error: request failed (check connection or ad-blockers)."
    );
  }
  // Try parsing JSON( may fail if server sends empty body or plain text)
  let body = null;
  try {
    body = await res.json();
  } catch {
    // Defensive: ignore if no JSON
  }
  // If server responded but status is not OK throw detailed error
  if (!res.ok) {
    const msg = body?.message
      ? `${res.status} ${body.message}`
      : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body; // Parsed JSON payload
}
//-------------------------------------------------------------------------//
// City name -> list of places { name, lat, lon, country, state? }
// Example: geocodeCity("Paris") → [{ name: "Paris", lat, lon, country, state }]
//-------------------------------------------------------------------------//
export async function geocodeCity(q, limit = 5) {
  if (!KEY) throw new Error("Missing REACT_APP_OWM_KEY (.env.local)");
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    q
  )}&limit=${limit}&appid=${KEY}`;
  return http(url);
}

//-------------------------------------------------------------------------//
// Current weather → single city snapshot
// Example: getCurrent(51.5, -0.12, "metric")
//-------------------------------------------------------------------------//
export async function getCurrent(lat, lon, units = "metric") {
  if (!KEY) throw new Error("Missing REACT_APP_OWM_KEY (.env.local)");
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${KEY}`;
  return http(url);
}

//-------------------------------------------------------------------------//
// Forecast (5-day / 3-hourly slices)
// Example: getForecast(51.5, -0.12, "metric") → ~40 slots of 3h forecasts
//-------------------------------------------------------------------------//
export async function getForecast(lat, lon, units = "metric") {
  if (!KEY) throw new Error("Missing REACT_APP_OWM_KEY (.env.local)");
  // FIX: remove duplicated "&&lon=${lon}"
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${KEY}`;
  return http(url);
}
