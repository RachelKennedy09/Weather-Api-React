//-------------------------------------------------------------------------//
// WHAT: Small utility helpers for display/formatting.
// WHY: Keep UI components and App.jsx cleaner by isolating "pure functions".
//      Each function is synchronous and side-effect free.
//-------------------------------------------------------------------------//

// Build an icon URL from an OpenWeatherMap icon code.
// Example: code "01d" → "https://openweathermap.org/img/wn/01d@2x.png"
// WHY: OWM only gives a short code ("01d"), so we expand it into a full URL.
export const iconUrl = (code) =>
  code ? `https://openweathermap.org/img/wn/${code}@2x.png` : "";

// Convert wind speed from meters/second → kilometers/hour.
// WHY: OWM returns wind speed in m/s (SI units). Users expect km/h (in metric).
// Defensive: if ms is null/undefined, default to 0.
export const kphFromMs = (ms) => Math.round((ms || 0) * 3.6);

// Turn a unix timestamp (seconds) + timezone offset (seconds) → short weekday.
// Example: dayShortFrom(1696550400, -21600) → "Fri"
// WHY: Forecast needs human-friendly labels ("Mon", "Tue") instead of raw dates.
// - unixSec: the timestamp from OWM (UTC seconds)
// - tzOffsetSec: offset from UTC in seconds, provided in OWM city.timezone
// NOTE: Multiplying by 1000 because JS Date expects ms, not seconds.
export function dayShortFrom(unixSec, tzOffsetSec = 0) {
  const date = new Date((unixSec + tzOffsetSec) * 1000);
  return date.toLocaleDateString(undefined, { weekday: "short" });
}
