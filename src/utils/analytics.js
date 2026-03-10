import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Generate or retrieve a unique visitor ID
function getVisitorId() {
  let visitorId = localStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
}

// Get session ID (expires after 30 minutes of inactivity)
function getSessionId() {
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const now = Date.now();
  
  let sessionData = localStorage.getItem("session_data");
  if (sessionData) {
    try {
      const { sessionId, lastActivity } = JSON.parse(sessionData);
      if (now - lastActivity < SESSION_TIMEOUT) {
        // Update last activity and return existing session
        localStorage.setItem("session_data", JSON.stringify({
          sessionId,
          lastActivity: now
        }));
        return sessionId;
      }
    } catch (e) {
      // Invalid session data, create new session
    }
  }
  
  // Create new session
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem("session_data", JSON.stringify({
    sessionId: newSessionId,
    lastActivity: now
  }));
  return newSessionId;
}

// Get browser and device information
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let browserVersion = "";
  let os = "Unknown";
  let osVersion = "";
  let deviceType = "Desktop";

  // Detect browser with version
  if (ua.includes("Firefox")) {
    browser = "Firefox";
    const match = ua.match(/Firefox\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes("Edg")) {
    browser = "Edge";
    const match = ua.match(/Edg\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes("Chrome") && !ua.includes("Edg")) {
    browser = "Chrome";
    const match = ua.match(/Chrome\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
    browser = "Safari";
    const match = ua.match(/Version\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes("Opera") || ua.includes("OPR")) {
    browser = "Opera";
    const match = ua.match(/(?:Opera|OPR)\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  }

  // Detect OS with version
  if (ua.includes("Windows NT 10.0")) {
    os = "Windows";
    osVersion = "10/11";
  } else if (ua.includes("Windows NT")) {
    os = "Windows";
    const match = ua.match(/Windows NT (\d+\.\d+)/);
    if (match) osVersion = match[1];
  } else if (ua.includes("Mac OS X")) {
    os = "macOS";
    const match = ua.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
    if (match) osVersion = match[1].replace(/_/g, ".");
  } else if (ua.includes("Linux")) {
    os = "Linux";
  } else if (ua.includes("Android")) {
    os = "Android";
    const match = ua.match(/Android (\d+\.\d+)/);
    if (match) osVersion = match[1];
  } else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) {
    os = "iOS";
    const match = ua.match(/OS (\d+_\d+)/);
    if (match) osVersion = match[1].replace(/_/g, ".");
  }

  // Detect device type
  if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) {
    deviceType = "Mobile";
  } else if (ua.includes("Tablet") || ua.includes("iPad")) {
    deviceType = "Tablet";
  }

  return { browser, browserVersion, os, osVersion, deviceType };
}

// Get screen resolution and additional device info
function getScreenInfo() {
  return {
    width: window.screen.width,
    height: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language || navigator.userLanguage,
  };
}

// Get approximate location from IP (using a free geolocation API)
async function getLocationInfo() {
  try {
    // Using ipapi.co free tier (no API key needed, 1000 requests/day)
    const response = await fetch("https://ipapi.co/json/", {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    
    if (!response.ok) {
      throw new Error("Geolocation API failed");
    }
    
    const data = await response.json();
    
    return {
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "Unknown",
      city: data.city || "Unknown",
      region: data.region || "Unknown",
      timezone: data.timezone || "Unknown",
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      ip: data.ip || "Unknown", // Store for admin purposes
    };
  } catch (error) {
    console.warn("Geolocation failed:", error);
    return {
      country: "Unknown",
      countryCode: "Unknown",
      city: "Unknown",
      region: "Unknown",
      timezone: "Unknown",
      latitude: null,
      longitude: null,
      ip: "Unknown",
    };
  }
}

// Track a page view
export async function trackPageView(pagePath, pageTitle, metadata = {}) {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const browserInfo = getBrowserInfo();
    const screenInfo = getScreenInfo();
    
    // Get location info (async, but don't wait too long)
    const locationPromise = getLocationInfo();
    const locationInfo = await Promise.race([
      locationPromise,
      new Promise(resolve => setTimeout(() => resolve({
        country: "Unknown",
        countryCode: "Unknown",
        city: "Unknown",
        region: "Unknown",
        timezone: "Unknown",
        latitude: null,
        longitude: null,
        ip: "Unknown",
      }), 2000)) // 2 second timeout
    ]);
    
    const analyticsData = {
      visitorId,
      sessionId,
      pagePath,
      pageTitle,
      referrer: document.referrer || "Direct",
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      ...browserInfo,
      screen: screenInfo,
      location: locationInfo,
      ...metadata,
    };

    // Only track in production or if explicitly enabled
    if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_ANALYTICS === "true") {
      await addDoc(collection(db, "analytics"), analyticsData);
    } else {
      console.log("[Analytics Debug]", analyticsData);
    }
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.warn("Analytics tracking failed:", error);
  }
}

// Track a custom event
export async function trackEvent(eventName, eventData = {}) {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    
    const eventPayload = {
      visitorId,
      sessionId,
      eventName,
      eventData,
      timestamp: serverTimestamp(),
      pagePath: window.location.pathname,
    };

    if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_ANALYTICS === "true") {
      await addDoc(collection(db, "analytics_events"), eventPayload);
    } else {
      console.log("[Event Debug]", eventPayload);
    }
  } catch (error) {
    console.warn("Event tracking failed:", error);
  }
}
