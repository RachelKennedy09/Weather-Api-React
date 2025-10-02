<!-- 1st- created trello cards to set up organization and visualize the project ahead of time.

Note: learned debouncing : Debouncing = waiting a short delay before running a function.
Think of debouncing like waiting to see if someone is finished talking before replying

learned geocoding: In the OpenWeatherMap API, you need geocoding to turn the city a user types into coordinates, because the weather endpoints work best with lat and lon. -->

# Weather App (React + OpenWeather API)

A modern weather dashboard built with React and the OpenWeatherMap API.
Users can search for any city or use their current location to see current weather and a 5-day forecast.

This project was a deep dive into React best practices, error handling, and API integration, and taught me persistence in debugging and problem-solving.

Built with Create React App (CRA).

👉 **[Live Demo](https://your-deployment-url-here)**  
👉 **[Documentation / Detailed Notes](./README.md)** 

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
        UnitToggle.jsx        # Switch between °C and °F

      utils/
        format.js             # Helpers for icons, wind conversion,
                                date formatting

App.jsx # Main app frame + state management
App.module.css # Theme tokens + layout styles
index.js # React entry point
index.css # Global reset/fonts
setupTests.js # Testing config
App.test.js # Sample smoke test

## Testing

- Run tests (npm test)
- NOTE: I tested search bar ( making sure it renders the Search button inside the search form )

## Features

- <b>Search by City -></b> Fetch current weather conditions by typing a city name.

- <b>City Disambiguation -> </b> If multiple cities match, a city picker modal lets the user choose.

- <b> 5-Day Forecast -> </b> Summarized daily hi/lo temperatures with weather icons.

- <b>Unit Toggle (°C / °F) -> </b> Switch units, with preference saved in localStorage.

- <b>Use My Location -> </b> Fetch weather using browser geolocation.

- <b>Loading States -> </b> Skeleton loaders + spinners for smooth UX.

-<b>Error Handling -> </b> Friendly error messages for missing/invalid API keys, rate limits, bad city names, or network errors.

- <b>Persistence -> </b> Last searched city + unit choice remembered across sessions.

-<b> Accessibility -> </b> ARIA roles, focus outlines, and keyboard-friendly controls.

## Project organization

Trello :

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
- ![alt text](image.png)
  
- Added issue/PR templates 

- <b>Debugging & Persistence: </b> Faced many bugs but worked through them step by step. I’m proud that I didn’t give up and always found a way forward.

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
