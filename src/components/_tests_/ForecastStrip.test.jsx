//-------------------------------------------------------------------------//
// WHAT: Unit tests for ForecastStrip component
// PURPOSE: Ensure forecast items render correctly with:
//   - Day labels
//   - High/low temperatures with unit suffix
//   - Weather icons (if provided)
//
// HOW IT FITS IN:
// - ForecastStrip shows the 5-day summary at the bottom of the app.
// - It’s a key deliverable: validating hi/lo temps and day labels ensures
//   the data-reduction logic (in App.jsx loadByCoords) actually surfaces
//   something visible to the user.
//
// KEY CHOICES / WHY:
// - We use a fake `items` array with 2 days to keep test fast and isolated.
// - Don’t need to test shimmer states (that’s SkeletonForecast’s job).
// - Assert day labels and hi/lo temps include the unit suffix (°C).
//-------------------------------------------------------------------------//

import { render, screen } from "@testing-library/react";
import ForecastStrip from "../ForecastStrip";

test("renders forecast items with days and temps", () => {
  // Mock forecast data (simplified view-model objects like App.jsx produces)
  const items = [
    { day: "Mon", hi: 20, lo: 10, icon: "01d", iconUrl: "" },
    { day: "Tue", hi: 22, lo: 12, icon: "02d", iconUrl: "" },
  ];

  // Render ForecastStrip with metric units
  render(<ForecastStrip items={items} units="metric" />);

  // Day labels visible
  expect(screen.getByText("Mon")).toBeInTheDocument();
  expect(screen.getByText("Tue")).toBeInTheDocument();

  // Temps show with °C suffix
  expect(screen.getByText(/20°C/i)).toBeInTheDocument();
  expect(screen.getByText(/12°C/i)).toBeInTheDocument();
});
