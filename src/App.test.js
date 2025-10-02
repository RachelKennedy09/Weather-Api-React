//-------------------------------------------------------------------------//
// WHAT: Basic test for App component
// PURPOSE: Sanity check that the app renders key UI elements without crashing.
//
// HOW IT FITS IN:
// - Uses React Testing Library (render, screen) to simulate rendering <App />.
// - Instead of boilerplate "learn react" test, I check for something real
//   in my Weather app (like the "Search" button).
//
// KEY CHOICES / WHY:
// - getByText(/Search/i): ensures the SearchBar renders properly.
// - Simple smoke test, not full integration.
//
// FUTURE NOTE: Can add more tests later (e.g., typing in search input, mock API).
//-------------------------------------------------------------------------//

import { render, screen, within } from "@testing-library/react";
import App from "./App";

test("renders the Search button inside the search form", () => {
  render(<App />);
  // find the form (role="search" with accessible name)
  const form = screen.getByRole("search", { name: /search city/i });
  // now look for the button inside just that form
  const searchBtn = within(form).getByRole("button", { name: /^search$/i });
  expect(searchBtn).toBeInTheDocument();
});
