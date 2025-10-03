//-------------------------------------------------------------------------//
// WHAT: Unit tests for ErrorBanner component
// PURPOSE: Ensure error UI renders only when there is a message.
//
// HOW IT FITS IN:
// - App centralizes error strings; ErrorBanner is the thin UI surface.
// - We verify both "no error" (null render) and "has error" (visible alert).
//
// KEY CHOICES / WHY:
// - role="alert" lookup reflects the component’s accessibility semantics.
// - We use container query for the null-render case to assert absence.
//-------------------------------------------------------------------------//

import { render, screen } from "@testing-library/react";
import ErrorBanner from "../ErrorBanner";

test("renders nothing when message is empty", () => {
  const { container } = render(<ErrorBanner message="" />);

  // When no message is provided, the component returns null → no alert in DOM
  expect(container.querySelector('[role="alert"]')).toBeNull();
});

test("shows error message when provided", () => {
  render(<ErrorBanner message="No matching city found." />);

  // With a message, an alert should render and contain the text
  const alert = screen.getByRole("alert");
  expect(alert).toHaveTextContent(/no matching city found/i);
});
