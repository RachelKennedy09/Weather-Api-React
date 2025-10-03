//-------------------------------------------------------------------------//
// WHAT: Unit tests for SearchBar component
// PURPOSE: Validate core interactions:
//  - The Search button renders
//  - Submitting trims whitespace and calls onSubmit with the cleaned query
//  - "Use my location" button calls its handler
//
// HOW IT FITS IN:
// - Confirms the entry point UX is wired correctly without hitting the network.
// - Keeps tests fast by passing spy functions (jest.fn()) instead of real API.
//
// KEY CHOICES / WHY:
// - getByRole with accessible names (Search / Use my location) mirrors real UX.
// - fireEvent.click is sufficient here because submission is via button click.
// - Trimming assertion ensures we don’t send junk to the API.
//-------------------------------------------------------------------------//

import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../SearchBar";

test("renders Search button and submits trimmed query", () => {
  const onSubmit = jest.fn();          // spy for parent handler
  const onUseMyLocation = jest.fn();   // spy for geo handler

  render(<SearchBar onSubmit={onSubmit} onUseMyLocation={onUseMyLocation} />);

  // Button is present (accessibility-friendly lookup)
  expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();

  // Type with extra spaces, then submit via button click
  const input = screen.getByLabelText(/city name/i);
  fireEvent.change(input, { target: { value: "  Banff  " } });
  fireEvent.click(screen.getByRole("button", { name: /search/i }));

  // Parent handler called with TRIMMED value
  expect(onSubmit).toHaveBeenCalledWith("Banff");
});

test("Use my location button calls handler", () => {
  const onSubmit = jest.fn();
  const onUseMyLocation = jest.fn();

  render(<SearchBar onSubmit={onSubmit} onUseMyLocation={onUseMyLocation} />);

  // Clicking the geo button calls the handler
  fireEvent.click(screen.getByRole("button", { name: /use my location/i }));
  expect(onUseMyLocation).toHaveBeenCalled();
});
