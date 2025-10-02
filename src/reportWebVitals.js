//-------------------------------------------------------------------------//
// WHAT: reportWebVitals.js
// PURPOSE: Hook into the Web Vitals library to measure app performance metrics.
//
// HOW IT FITS IN:
// - Imported in index.js if I want to start measuring performance.
// - Provides Core Web Vitals like:
//   CLS  = Cumulative Layout Shift
//   FID  = First Input Delay
//   FCP  = First Contentful Paint
//   LCP  = Largest Contentful Paint
//   TTFB = Time To First Byte
//
// - These are important for real-world performance monitoring (SEO, UX).
// - By default, but don’t *need* it unless I want analytics.
//-------------------------------------------------------------------------//

const reportWebVitals = (onPerfEntry) => {
  // Only run if a callback function is passed in
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import web-vitals (code-splitting → only load if needed)
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Call each Web Vitals function with the provided callback
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
