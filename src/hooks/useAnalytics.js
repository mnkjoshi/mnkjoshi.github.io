import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackEvent } from "../utils/analytics";

// Hook to automatically track page views
export function usePageTracking(pageTitle, metadata = {}) {
  const location = useLocation();

  useEffect(() => {
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
