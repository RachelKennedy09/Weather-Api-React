//-------------------------------------------------------------------------//
// WHAT: Unit tests for UnitToggle component
// PURPOSE: Verify that the toggle displays both options and switches active
//          styles / calls setUnits with the correct value.
//
// HOW IT FITS IN:
// - UnitToggle doesn’t fetch data; it just updates "units" in App state.
// - These tests ensure the UI communicates the selected unit (“active” class)
//   and invokes the correct handler on click.
//
// KEY CHOICES / WHY:
// - We assert CSS class toggling by matching `.active` in className.
// - We rerender with a new prop to simulate parent state updating after click.
//-------------------------------------------------------------------------//

import { render, screen, fireEvent } from "@testing-library/react";
import UnitToggle from "../UnitToggle";

test("renders both unit buttons and toggles selection", () => {
  const setUnits = jest.fn();

  // Start in metric (Celsius active)
  const { rerender } = render(<UnitToggle units="metric" setUnits={setUnits} />);

  const cBtn = screen.getByRole("button", { name: "°C" });
  const fBtn = screen.getByRole("button", { name: "°F" });

  // Initial state: °C active, °F inactive
  expect(cBtn.className).toMatch(/active/);
  expect(fBtn.className).not.toMatch(/active/);

  // Click °F → handler should be called with "imperial"
  fireEvent.click(fBtn);
  expect(setUnits).toHaveBeenCalledWith("imperial");

  // Simulate App updating the prop after state change
  rerender(<UnitToggle units="imperial" setUnits={setUnits} />);

  // Now °F should be active
  expect(fBtn.className).toMatch(/active/);
  expect(cBtn.className).not.toMatch(/active/);
});
