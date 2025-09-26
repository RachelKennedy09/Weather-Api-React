// WHAT: OpenWeatherMap API helpers (geocode, current, 5-day forecast)

const KEY = process.env.REACT_APP_OWM_KEY;

async function http(url) {
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error(
      "Network error: request failed (check connection or ad-blockers)."
    );
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    // ignore if no JSON
  }

  if (!res.ok) {
    const msg = body?.message
      ? `${res.status} ${body.message}`
      : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

// City name -> list of places { name, lat, lon, country, state? }
export async function geocodeCity(q, limit = 5) {
  if (!KEY) throw new Error("Missing REACT_APP_OWM_KEY (.env.local)");
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    q
  )}&limit=${limit}&appid=${KEY}`;
  return http(url);
}

// Current weather for coordinates
export async function getCurrent(lat, lon, units = "metric") {
  if (!KEY) throw new Error("Missing REACT_APP_OWM_KEY (.env.local)");
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${KEY}`;
  return http(url);
}

// 5-day / 3-hour forecast for coordinates
export async function getForecast(lat, lon, units = "metric") {
  if (!KEY) throw new Error("Missing REACT_APP_OWM_KEY (.env.local)");
  // FIX: remove duplicated "&&lon=${lon}"
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${KEY}`;
  return http(url);
}
