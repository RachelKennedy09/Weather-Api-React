export const iconUrl = (code) =>
  code ? `https://openweathermap.org/img/wn/${code}@2x.png` : "";
export const kphFromMs = (ms) => Math.round((ms || 0) * 3.6);
export function dayShortFrom(unixSec, tzOffsetSec = 0) {
  const date = new Date((unixSec + tzOffsetSec) * 1000);
  return date.toLocaleDateString(undefined, { weekday: "short" });
}
