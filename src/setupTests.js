//-------------------------------------------------------------------------//
// WHAT: setupTests.js
// PURPOSE: Configures Jest + Testing Library to extend test matchers.
//
// HOW IT FITS IN:
// - Automatically runs before every test file (CRA wiring).
// - Pulls in "@testing-library/jest-dom" which adds extra matchers
//   for making assertions about the DOM.
//
// EXAMPLES (with jest-dom):
// - expect(element).toHaveTextContent(/react/i)
// - expect(button).toBeDisabled()
// - expect(img).toHaveAttribute('src', 'icon.png')
//
// WHY: These matchers make tests more readable + semantic compared to
// just using expect(element.textContent).toMatch(...).
//-------------------------------------------------------------------------//

import "@testing-library/jest-dom";
