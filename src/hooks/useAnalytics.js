import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackEvent } from "../utils/analytics";

// Hook to automatically track page views.
// Uses a ref to ensure each unique pathname is only tracked once per navigation,
// even if pageTitle resolves asynchronously (e.g. after a Firestore fetch).
export function usePageTracking(pageTitle, metadata = {}) {
  const location = useLocation();
  const trackedPath = useRef(null);

  useEffect(() => {
    if (!pageTitle) return; // wait for dynamic titles to resolve
    if (trackedPath.current === location.pathname) return; // already tracked this path
    trackedPath.current = location.pathname;
    trackPageView(location.pathname, pageTitle, metadata);
  }, [location.pathname, pageTitle]);
}

// Hook to get tracking functions
export function useAnalytics() {
  return {
    trackPageView,
    trackEvent,
  };
}
