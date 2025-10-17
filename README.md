# Weather App (React + OpenWeather API)

A modern weather dashboard built with React and the OpenWeatherMap API.
Users can search for any city or use their current location to see current weather and a 5-day forecast.

This project was a deep dive into React best practices, error handling, and API integration, and taught me persistence in debugging and problem-solving.

Built with Create React App (CRA).

👉 **[Live Demo](https://neatherwetwork.netlify.app/)**

- Deployed using Create React App’s production build (`npm run build`) with an environment variable (`REACT_APP_OWM_KEY`) configured in Netlify’s dashboard.

👉 **[Online GitHub Documentation / Detailed Notes](https://github.com/RachelKennedy09/Weather-Api-React/blob/main/README.md)**

## 🔍 Search / Table of Contents

- [Weather App (React + OpenWeather API)](#weather-app-react--openweather-api)
  - [🔍 Search / Table of Contents](#-search--table-of-contents)
  - [Getting Started / Prerequisites](#getting-started--prerequisites)
  - [Installation](#installation)
    - [1. Clone the repo](#1-clone-the-repo)
    - [2. Install dependencies](#2-install-dependencies)
    - [3. Set up environment variables](#3-set-up-environment-variables)
    - [4. Run the app](#4-run-the-app)
  - [Project Structure](#project-structure)
  - [Testing](#testing)
    - [SearchBar.test.jsx](#searchbartestjsx)
    - [ErrorBanner.test.jsx](#errorbannertestjsx)
    - [UnitToggle.test.jsx](#unittoggletestjsx)
    - [ForecastStrip.test.jsx](#forecaststriptestjsx)
  - [Tech Stack \& Libraries](#tech-stack--libraries)
  - [Features](#features)
  - [Project organization](#project-organization)
- [Notes \& Learnings](#notes--learnings)
  - [Future Improvements](#future-improvements)
  - [Design Notes](#design-notes)

Use your browser’s search (Ctrl+F / Cmd+F) or click the links above to jump directly to the section.

## Getting Started / Prerequisites

- Node.js
  (v18+ recommended)

- npm (comes with Node)

## Installation

### 1. Clone the repo

- git clone https://github.com/Rachelkennedy09/Weather-Api-React.git

- cd Weather-Api-React

### 2. Install dependencies

- npm install or npm i

### 3. Set up environment variables

- create a .env.local file in the root directory
  - insert REACT_APP_OWM_KEY=your_api_key_here
- NOTE: Get your free key at [Open Weather Map API](https://openweathermap.org/api)

### 4. Run the app

- npm start (NOTE: NOT npm run dev)
- The app will run at http://localhost:3000

## Project Structure

    .github/
      ISSUE_TEMPLATE/
        bug_report_template.md  # template for bug reports
        feature_request_template.md # template for feature ideas
        pull_request_template.md # template for a pull
    src/
      api/
        openWeather.js        # API helper functions
                                (geocode, current forecast)
      components/
        CityPicker.jsx       # Dialog for selecting city if
                                multiple results
        CurrentCard.jsx       # Shows current conditions
        ErrorBanner.jsx       # Displays errors (invalid key,
                                network, etc.)
        ForecastStrip.jsx     # 5-day forecast
        Loader.jsx            # Loading spinner with label
        SearchBar.jsx         # Search input + "Use my location" button
        SkeletonCurrent.jsx   # Placeholder for current card
                                while loading
        SkeletonForecast.jsx  # Placeholder for forecast while loading
        ThemeToggle.jsx       # Component for switching between seasonal/weather-based themes
        UnitToggle.jsx        # Switch between °C and °F

      utils/
        format.js             # Helpers for icons, wind conversion,
                                date formatting

      assets/                 # theme images
        themes/
          .jpg
    

    App.jsx                   # Main app frame + state management

    App.module.css            # Theme tokens + layout styles

    index.js                  # React entry point

    index.css                 # Global reset/fonts

    setupTests.js             # Testing config

    App.test.js               # Sample smoke test

## Testing

- TODO IN TERMINAL CONSOLE: Run test (npm test)

### SearchBar.test.jsx

- Renders Search button inside form

- Submits trimmed input text to parent handler

- Calls “Use my location” handler on click

### ErrorBanner.test.jsx

- Renders nothing when message is empty

- Displays correct error message when provided

### UnitToggle.test.jsx

- Renders both °C and °F buttons

- Applies active styles correctly based on units prop

- Calls parent handler with correct unit on click

### ForecastStrip.test.jsx

- Renders forecast items with correct day labels

- Displays hi/lo temperatures with unit suffix

## Tech Stack & Libraries

**Core Framework**

- [React](https://react.dev/) (via Create React App)

**API**

- [OpenWeatherMap API](https://openweathermap.org/api)
  - Geocoding (city → lat/lon)
  - Current Weather Data
  - 5-day / 3-hour Forecast

**Styling**

- CSS Modules (`*.module.css`) for scoped, component-level styling
- Custom CSS tokens (colors, radius, shadows) in `App.module.css`
  

**State & Data Handling**

- React hooks (`useState`, `useEffect`)
- LocalStorage (persist units + last location)
- Promise-based fetch helpers for API calls

**UX Enhancements**

- Custom Loader (spinner) component
- Skeleton placeholders for Current Weather + Forecast cards
- ErrorBanner with friendly messages
- Accessible toggle buttons + ARIA roles

**Testing**

- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/)
- [jest-dom](https://github.com/testing-library/jest-dom) custom matchers

**Tooling / Workflow**

- GitHub (repo hosting, issue/PR templates, branch protections)
- Trello (task tracking + project organization)
- ESLint (default CRA linting rules)

## Features

- <b>Search by City -></b> Fetch current weather conditions by typing a city name.

- <b>City Disambiguation -> </b> If multiple cities match, a city picker modal lets the user choose.

- <b> 5-Day Forecast -> </b> Summarized daily hi/lo temperatures with weather icons.

- <b>Unit Toggle (°C / °F) -> </b> Switch units, with preference saved in localStorage.

- <b>Use My Location -> </b> Fetch weather using browser geolocation.

- <b>Loading States -> </b> Skeleton loaders + spinners for smooth UX.

- <b>Error Handling -> </b> Friendly error messages for missing/invalid API keys, rate limits, bad city names, or network errors.

- <b>Persistence -> </b> Last searched city + unit choice remembered across sessions.

- <b> Accessibility -> </b> ARIA roles, focus outlines, and keyboard-friendly controls.

- <b>Theme Toggle -> </b> Users can switch between seasonal and weather-inspired color themes:  
  **☀️ Sunny (blue), ☁️ Cloudy (grey), 🌧️ Rain (purple), ❄️ Snow (white), 🍂 Fall (orange)**.  
  Each theme updates both the app’s colors and the background photo dynamically.

## Project organization

Trello : https://trello.com/invite/b/68d6da578ba85414121f9624/ATTI6edf943782d601a11a1760099410f1764690D109/weather-api-react

# Notes & Learnings

- <b>Environment Variables:</b> Learned how to configure and use .env.local in React to securely manage API keys.

- <b>Modular Architecture:</b> Built a clean, reusable component structure with clear separation of logic (data fetching, state) from UI (presentational components).

- <b>Accessibility:</b> Practiced applying aria-\* roles, aria-hidden, and focus outlines to ensure the app is usable by screen readers and keyboard users.

- <b>Persistence with localStorage:</b> Implemented saving of the user’s last location and unit preference so the app feels more personal and responsive on reload.

- <b>Skeleton Loaders:</b> Explored skeleton components to improve UX, practicing how to design placeholders and learning why they feel better than spinners alone.

- <b>Error Handling: </b> Spent significant time adding robust error handlers for network issues, invalid API keys, missing data, and rate limits — important because OpenWeatherMap often returns inconsistent payloads.

- <b>Documentation & Study Notes:</b> Made sure to include detailed docstrings and code annotations — both for my professor’s review and as a study resource for myself later.

- <b>Learning Resources: </b>
  Combined YouTube tutorials, GPT guidance, and self-debugging. While I needed a lot of help, I absorbed valuable patterns and problem-solving strategies along the way.

- <b>Github Workflow: </b> Learned about and added branch protections + practiced CI/CD workflow
- Added issue/PR templates

- <b>Debugging & Persistence: </b> Faced many bugs but worked through them step by step. I’m proud that I didn’t give up and always found a way forward.

-  <b>Dynamic Theme Toggle:</b> Implementing a full theme switcher with background images was challenging because CSS Modules couldn’t directly reference public assets in a stable way.  
  I refactored the design to use a JavaScript-driven approach — importing images from `src/assets/themes` and setting them as CSS variables (`--photo`).  
  This avoided build errors and ensured instant, smooth transitions when toggling between themes (Fall, Sunny, Cloudy, Rain, Snow).  
  It was a big lesson in the difference between static asset handling and dynamic runtime styles in React.

## Future Improvements

- Add hourly forecast view.

- Add weather icons for night vs day.

- Add location autocomplete suggestions.

- Deploy to Netlify/Render with environment variables set in hosting dashboard.

- Unit + integration tests for SearchBar and CityPicker.

## Design Notes

- Dark, modern theme inspired by Weather Network.

- Consistent use of CSS Modules for component-scoped styles.

- Theme tokens (--bg, --card, --accent, etc.) keep design cohesive.
  
- Each theme features its own color palette and background image for immersion.  
  The background photo is applied via a CSS variable, ensuring fast and consistent visual updates.
