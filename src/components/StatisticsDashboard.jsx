import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "./Loader";
import {
  FiUsers,
  FiEye,
  FiMonitor,
  FiSmartphone,
  FiTablet,
  FiChrome,
  FiMapPin,
  FiTrendingUp,
  FiClock,
  FiFileText,
  FiGlobe,
  FiCpu,
  FiMaximize2,
  FiLink,
  FiZap,
  FiAlertTriangle,
  FiAlertCircle,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

// Helper to format numbers
const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

// Bot detection function
function detectBot(visit) {
  const reasons = [];
  
  // Check user agent for known bots
  const ua = (visit.userAgent || "").toLowerCase();
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'headless',
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'facebookexternalhit', 'twitterbot', 'whatsapp',
    'phantomjs', 'selenium', 'puppeteer', 'playwright'
  ];
  
  for (const pattern of botPatterns) {
    if (ua.includes(pattern)) {
      reasons.push(`Bot keyword: ${pattern}`);
      break;
    }
  }
  
  // Check for Google's IP ranges (172.253.*.*, 66.249.*.*, etc.)
  const ip = visit.location?.ip || "";
  const knownBotIPs = [
    /^172\.253\./, // Google
    /^66\.249\./,  // Google
    /^207\.46\./,  // Microsoft/Bing
    /^40\.77\./,   // Microsoft/Bing
    /^157\.55\./,  // Microsoft/Bing
  ];
  
  for (const pattern of knownBotIPs) {
    if (pattern.test(ip)) {
      reasons.push("Known bot IP range");
      break;
    }
  }
  
  // Check for headless browser signatures
  if (visit.screen?.width === 1920 && visit.screen?.height === 1080 && 
      visit.screen?.viewportWidth === 1366 && visit.screen?.viewportHeight === 768) {
    reasons.push("Suspicious screen/viewport combo");
  }
  
  // Check for missing geolocation data (bots often can't get this)
  if (visit.location?.country === "Unknown" && visit.location?.timezone === "Unknown") {
    reasons.push("No geolocation data");
  }
  
  // Check for unrealistic viewport (smaller than minimum browser chrome)
  if (visit.screen?.viewportHeight && visit.screen?.height) {
    const chromeHeight = visit.screen.height - visit.screen.viewportHeight;
    if (chromeHeight < 50 || chromeHeight > 300) {
      reasons.push("Unrealistic browser chrome size");
    }
  }
  
  return {
    isBot: reasons.length > 0,
    confidence: reasons.length >= 2 ? "High" : reasons.length === 1 ? "Medium" : "Low",
    reasons: reasons
  };
}

export default function StatisticsDashboard() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30); // days
  const [viewMode, setViewMode] = useState("aggregate"); // "aggregate" or "individual"
  const [stats, setStats] = useState({
    uniqueVisitors: 0,
    totalViews: 0,
    uniqueSessions: 0,
    avgSessionDuration: 0,
    topPages: [],
    topProjects: [],
    topBlogs: [],
    browsers: {},
    devices: {},
    operatingSystems: {},
    referrers: [],
    recentVisits: [],
    viewsByDate: {},
    countries: {},
    botCount: 0,
    humanCount: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsRef = collection(db, "analytics");
      
      // Calculate start date based on range
      let q;
      if (dateRange === 0) {
        // All time
        q = query(analyticsRef, orderBy("timestamp", "desc"));
      } else {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);
        q = query(
          analyticsRef,
          where("timestamp", ">=", Timestamp.fromDate(startDate)),
          orderBy("timestamp", "desc")
        );
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      }));

      setAnalytics(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) {
      setStats({
        uniqueVisitors: 0,
        totalViews: 0,
        uniqueSessions: 0,
        avgSessionDuration: 0,
        topPages: [],
        topProjects: [],
        topBlogs: [],
        browsers: {},
        devices: {},
        operatingSystems: {},
        referrers: [],
        recentVisits: [],
        viewsByDate: {},
        countries: {},
        botCount: 0,
        humanCount: 0,
      });
      return;
    }

    // Unique visitors
    const uniqueVisitors = new Set(data.map(d => d.visitorId)).size;

    // Total page views
    const totalViews = data.length;

    // Unique sessions
    const uniqueSessions = new Set(data.map(d => d.sessionId)).size;

    // Top pages
    const pages = {};
    data.forEach(d => {
      const page = d.pageTitle || "Untitled";
      pages[page] = (pages[page] || 0) + 1;
    });
    const topPages = Object.entries(pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Top projects (filter pages that include "project")
    const projects = {};
    data.filter(d => d.pagePath?.includes("/projects/")).forEach(d => {
      const project = d.pageTitle || "Unknown Project";
      projects[project] = (projects[project] || 0) + 1;
    });
    const topProjects = Object.entries(projects)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Top blogs (filter pages that include "blog")
    const blogs = {};
    data.filter(d => d.pagePath?.includes("/blog/")).forEach(d => {
      const blog = d.pageTitle || "Unknown Blog";
      blogs[blog] = (blogs[blog] || 0) + 1;
    });
    const topBlogs = Object.entries(blogs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Referrers
    const refs = {};
    data.forEach(d => {
      const ref = d.referrer || "Direct";
      refs[ref] = (refs[ref] || 0) + 1;
    });
    const referrers = Object.entries(refs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Browsers
    const browsers = {};
    data.forEach(d => {
      const browser = d.browser || "Unknown";
      browsers[browser] = (browsers[browser] || 0) + 1;
    });

    // Devices
    const devices = {};
    data.forEach(d => {
      const device = d.deviceType || "Unknown";
      devices[device] = (devices[device] || 0) + 1;
    });

    // Operating Systems
    const operatingSystems = {};
    data.forEach(d => {
      const os = d.os || "Unknown";
      operatingSystems[os] = (operatingSystems[os] || 0) + 1;
    });

    // Countries
    const countries = {};
    data.forEach(d => {
      const country = d.location?.country || "Unknown";
      countries[country] = (countries[country] || 0) + 1;
    });

    // Bot detection stats
    let botCount = 0;
    let humanCount = 0;
    data.forEach(d => {
      const detection = detectBot(d);
      if (detection.isBot) {
        botCount++;
      } else {
        humanCount++;
      }
    });

    // Recent visits (last 10)
    const recentVisits = data.slice(0, 10);

    // Views by date
    const viewsByDate = {};
    data.forEach(d => {
      if (d.timestamp) {
        const dateKey = d.timestamp.toLocaleDateString();
        viewsByDate[dateKey] = (viewsByDate[dateKey] || 0) + 1;
      }
    });

    setStats({
      uniqueVisitors,
      totalViews,
      uniqueSessions,
      avgSessionDuration: 0, // Would need session end times to calculate
      topPages,
      topProjects,
      topBlogs,
      browsers,
      devices,
      operatingSystems,
      referrers,
      recentVisits,
      viewsByDate,
      countries,
      botCount,
      humanCount,
    });
  };

  if (loading) return <Loader />;

  const { uniqueVisitors, totalViews, uniqueSessions, topPages, topProjects, topBlogs, browsers, devices, operatingSystems, referrers, recentVisits, countries, botCount, humanCount } = stats;

  // Individual view: filter for unique visitors only
  const seenVisitors = new Set();
  const uniqueVisits = analytics.filter(visit => {
    if (visit.visitorId && !seenVisitors.has(visit.visitorId)) {
      seenVisitors.add(visit.visitorId);
      return true;
    }
    return false;
  });
  const lastTenVisits = uniqueVisits.slice(0, 10);

  // Shared header rendered for both views
  const header = (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-fira font-semibold text-text_primary">
        {viewMode === "individual"
          ? <>Individual Visitors <span className="text-text_muted/60 text-xs font-fira">({lastTenVisits.length} unique)</span></>
          : "Statistics Overview"
        }
      </h3>
      <div className="flex items-center gap-2">
        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-white/[0.1] overflow-hidden">
          <button
            onClick={() => setViewMode("aggregate")}
            className={`px-3 py-1.5 text-xs font-fira transition-colors ${
              viewMode === "aggregate"
                ? "bg-cyber/10 text-cyber"
                : "text-text_muted hover:text-text_primary"
            }`}
          >
            Aggregate
          </button>
          <div className="w-px h-4 bg-white/[0.1]" />
          <button
            onClick={() => setViewMode("individual")}
            className={`px-3 py-1.5 text-xs font-fira transition-colors ${
              viewMode === "individual"
                ? "bg-cyber/10 text-cyber"
                : "text-text_muted hover:text-text_primary"
            }`}
          >
            Individual
          </button>
        </div>
        {/* Date range */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(Number(e.target.value))}
          className="px-3 py-1.5 text-xs font-fira rounded-lg bg-white/[0.02] border border-white/[0.1] text-text_primary focus:outline-none focus:border-cyber/30 transition-colors"
        >
          <option value={1}>Today</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={0}>All time</option>
        </select>
        {/* Refresh */}
        <button
          onClick={fetchAnalytics}
          className="p-1.5 rounded-lg border border-white/[0.1] text-text_muted hover:text-cyber hover:border-cyber/30 transition-colors"
          title="Refresh"
        >
          <FiRefreshCw className="text-sm" />
        </button>
      </div>
    </div>
  );

  if (viewMode === "individual") {
    return (
      <div className="space-y-6">
        {header}

        {/* Individual visitor cards */}
        {lastTenVisits.length === 0 ? (
          <p className="text-text_muted/60 text-center py-20">No visitor data available</p>
        ) : (
          <div className="space-y-4">
            {lastTenVisits.map((visit, idx) => {
              const botDetection = detectBot(visit);
              
              return (
                <div
                  key={visit.id}
                  className={`bg-white/[0.02] border rounded-xl p-5 ${
                    botDetection.isBot 
                      ? 'border-red-500/30 bg-red-500/5' 
                      : 'border-white/[0.08]'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                        botDetection.isBot 
                          ? 'bg-red-500/10 border-red-500/30' 
                          : 'bg-cyber/10 border-cyber/30'
                      }`}>
                        <span className={`font-fira font-bold text-sm ${
                          botDetection.isBot ? 'text-red-400' : 'text-cyber'
                        }`}>
                          {botDetection.isBot ? <FiAlertCircle /> : idx + 1}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-fira text-sm font-semibold text-text_primary">
                            {visit.pageTitle || "Untitled Page"}
                          </h4>
                          {botDetection.isBot && (
                            <span className={`text-[10px] font-fira px-2 py-0.5 rounded-full ${
                              botDetection.confidence === 'High' 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {botDetection.confidence === 'High' ? 'Likely Bot' : 'Possible Bot'}
                            </span>
                          )}
                        </div>
                        <p className="text-text_muted/60 text-xs font-mono">
                          {visit.pagePath}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-text_muted/80 text-xs font-fira">
                        {visit.timestamp?.toLocaleDateString()}
                      </p>
                      <p className="text-text_muted/60 text-xs font-fira">
                        {visit.timestamp?.toLocaleTimeString()}
                      </p>
                      <p className="text-text_muted/50 text-[10px] font-fira mt-1">
                        {formatTime(visit.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Main visitor details */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <DetailItem
                      label="Location"
                      value={
                        visit.location?.city && visit.location?.country && 
                        visit.location?.city !== "Unknown" && 
                        visit.location?.country !== "Unknown"
                          ? `${visit.location.city}, ${visit.location.country}`
                          : visit.location?.country || "Unknown"
                      }
                      icon={<FiMapPin />}
                    />
                    <DetailItem
                      label="Browser"
                      value={`${visit.browser || "Unknown"}${visit.browserVersion ? ` ${visit.browserVersion}` : ""}`}
                      icon={<FiGlobe />}
                    />
                    <DetailItem
                      label="OS"
                      value={`${visit.os || "Unknown"}${visit.osVersion ? ` ${visit.osVersion}` : ""}`}
                      icon={<FiCpu />}
                    />
                    <DetailItem
                      label="Device"
                      value={visit.deviceType || "Unknown"}
                      icon={visit.deviceType === "Mobile" ? <FiSmartphone /> : visit.deviceType === "Tablet" ? <FiTablet /> : <FiMonitor />}
                    />
                    <DetailItem
                      label="Screen"
                      value={`${visit.screen?.width || "?"}×${visit.screen?.height || "?"} (${visit.screen?.viewportWidth || "?"}×${visit.screen?.viewportHeight || "?"} viewport)`}
                      icon={<FiMaximize2 />}
                    />
                    <DetailItem
                      label="Language"
                      value={visit.screen?.language || "Unknown"}
                      icon={<FiGlobe />}
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-white/[0.05]">
                    {/* Bot Detection Warning */}
                    {botDetection.isBot && (
                      <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FiAlertTriangle className="text-red-400 text-sm flex-shrink-0" />
                          <span className="text-red-400 font-fira font-semibold text-xs">
                            Bot Detection Alerts:
                          </span>
                        </div>
                        <ul className="space-y-1 ml-6">
                          {botDetection.reasons.map((reason, i) => (
                            <li key={i} className="text-red-400/80 text-[11px] font-fira">
                              • {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="grid sm:grid-cols-2 gap-2 text-[10px]">
                      <DetailItem
                        label="Timezone"
                        value={visit.location?.timezone || visit.screen?.timezone || "Unknown"}
                        icon={<FiClock />}
                      />
                      <DetailItem
                        label="Referrer"
                        value={
                          visit.referrer && visit.referrer !== "Direct"
                            ? visit.referrer
                            : "Direct"
                        }
                        icon={<FiLink />}
                      />
                      <DetailItem
                        label="Pixel Ratio"
                        value={`${visit.screen?.pixelRatio || 1}x`}
                        icon={<FiZap />}
                      />
                    </div>

                    {/* Technical Details (collapsible) */}
                    <details className="mt-3">
                      <summary className="text-text_muted/60 text-[10px] font-fira cursor-pointer hover:text-cyber transition-colors">
                        Show Technical Details
                      </summary>
                      <div className="mt-3 space-y-2 pl-4 border-l border-white/[0.05]">
                        <div>
                          <p className="text-text_muted/50 text-[9px] font-fira mb-1">Visitor ID:</p>
                          <p className="text-text_muted/80 text-[10px] font-mono">{visit.visitorId}</p>
                        </div>
                        <div>
                          <p className="text-text_muted/50 text-[9px] font-fira mb-1">Session ID:</p>
                          <p className="text-text_muted/80 text-[10px] font-mono">{visit.sessionId}</p>
                        </div>
                        {visit.location?.ip && (
                          <div>
                            <p className="text-text_muted/50 text-[9px] font-fira mb-1">IP:</p>
                            <p className="text-text_muted/80 text-[10px] font-mono">{visit.location.ip}</p>
                          </div>
                        )}
                        {visit.location?.latitude && visit.location?.longitude && (
                          <div>
                            <p className="text-text_muted/50 text-[9px] font-fira mb-1">Coordinates:</p>
                            <p className="text-text_muted/80 text-[10px] font-mono">
                              {visit.location.latitude}, {visit.location.longitude}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-text_muted/50 text-[9px] font-fira mb-1">User Agent:</p>
                          <p className="text-text_muted/80 text-[10px] font-mono break-all">{visit.userAgent}</p>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Aggregate view (default)
  return (
    <div className="space-y-6">
      {header}

      {/* Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FiUsers />}
          label="Unique Visitors"
          value={formatNumber(uniqueVisitors)}
          color="cyber"
        />
        <StatCard
          icon={<FiEye />}
          label="Total Page Views"
          value={formatNumber(totalViews)}
          color="neon"
        />
        <StatCard
          icon={<FiClock />}
          label="Unique Sessions"
          value={formatNumber(uniqueSessions)}
          color="purple"
        />
        <StatCard
          icon={<FiShield />}
          label="Human vs Bot"
          value={`${formatNumber(humanCount)} / ${formatNumber(botCount)}`}
          color="cyber"
          subtitle={`${((humanCount / (humanCount + botCount || 1)) * 100).toFixed(0)}% human`}
        />
      </div>

      {/* Content sections */}
      <div className="space-y-6">
        {/* Top Pages */}
        {topPages.length > 0 && (
          <StatSection title="Top Pages" icon={<FiFileText />}>
            <PieData data={topPages} />
          </StatSection>
        )}

        {/* Split into two columns for smaller sections */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Projects */}
          {topProjects.length > 0 && (
            <StatSection title="Top Projects" icon={<FiTrendingUp />}>
              <PieData data={topProjects} />
            </StatSection>
          )}

          {/* Top Blog Posts */}
          {topBlogs.length > 0 && (
            <StatSection title="Top Blog Posts" icon={<FiFileText />}>
              <PieData data={topBlogs} />
            </StatSection>
          )}
        </div>

        {/* Three columns for device data */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Browsers */}
          <StatSection title="Browsers" icon={<FiChrome />}>
            <PieData data={Object.entries(browsers).map(([name, count]) => ({ name, count }))} />
          </StatSection>

          {/* Devices */}
          <StatSection title="Devices" icon={<FiMonitor />}>
            <PieData data={Object.entries(devices).map(([name, count]) => ({ name, count }))} />
          </StatSection>

          {/* Operating Systems */}
          <StatSection title="Operating Systems" icon={<FiMonitor />}>
            <PieData data={Object.entries(operatingSystems).map(([name, count]) => ({ name, count }))} />
          </StatSection>
        </div>

        {/* Two columns for geography and sources */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Countries */}
          <StatSection title="Countries" icon={<FiMapPin />}>
            <PieData data={Object.entries(countries).map(([name, count]) => ({ name, count }))} />
          </StatSection>

          {/* Traffic Sources */}
          {referrers.length > 0 && (
            <StatSection title="Traffic Sources" icon={<FiTrendingUp />}>
              <PieData data={referrers} />
            </StatSection>
          )}
        </div>

        {/* Recent Activity */}
        {recentVisits.length > 0 && (
          <StatSection title="Recent Activity" icon={<FiClock />}>
            <div className="space-y-2">
              {recentVisits.slice(0, 5).map((visit, idx) => {
                const botDetection = detectBot(visit);
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      botDetection.isBot 
                        ? 'bg-red-500/5 border border-red-500/20' 
                        : 'bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${botDetection.isBot ? 'opacity-50' : ''}`}>
                        {getDeviceIcon(visit.deviceType)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-text_primary text-xs font-fira">{visit.pageTitle || "Untitled"}</p>
                          {botDetection.isBot && (
                            <span className="text-[9px] font-fira px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
                              Bot
                            </span>
                          )}
                        </div>
                        <p className="text-text_muted/60 text-[10px] font-mono">
                          {visit.location?.city || "Unknown"} · {visit.browser || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <p className="text-text_muted/50 text-[10px] font-fira">
                      {formatTime(visit.timestamp)}
                    </p>
                  </div>
                );
              })}
            </div>
          </StatSection>
        )}
      </div>
    </div>
  );
}

// Detail Item Component for individual view
function DetailItem({ label, value, icon }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-text_muted/60 text-sm mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-text_muted/50 text-[9px] font-fira mb-0.5">{label}</p>
        <p className="text-text_primary text-xs font-fira">{value}</p>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color = "cyber", subtitle }) {
  const colorClasses = {
    cyber: "text-cyber border-cyber/20 bg-cyber/5",
    neon: "text-neon border-neon/20 bg-neon/5",
    purple: "text-purple-400 border-purple-400/20 bg-purple-400/5",
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4">
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border ${colorClasses[color]} mb-3`}>
        <span className="text-sm">{icon}</span>
      </div>
      <p className="text-text_muted/60 text-[11px] font-fira mb-1">{label}</p>
      <p className={`text-2xl font-fira font-bold ${color === "cyber" ? "text-cyber" : color === "neon" ? "text-neon" : "text-purple-400"}`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-text_muted/50 text-[10px] font-fira mt-1">{subtitle}</p>
      )}
    </div>
  );
}

// Stat Section Component
function StatSection({ title, icon, children }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-cyber text-sm">{icon}</span>
        <h4 className="text-text_primary font-fira font-semibold text-sm">{title}</h4>
      </div>
      {children}
    </div>
  );
}

// Pie Data Component (simplified bar chart style)
function PieData({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-text_muted/60 text-xs">No data available</p>;
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const colors = [
    "bg-cyber",
    "bg-neon",
    "bg-purple-400",
    "bg-blue-400",
    "bg-pink-400",
  ];

  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((item, idx) => {
        const percentage = ((item.count / total) * 100).toFixed(1);
        return (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-text_primary text-xs font-fira truncate">
                {item.name}
              </span>
              <span className="text-text_muted/60 text-[10px] font-fira ml-2">
                {item.count} ({percentage}%)
              </span>
            </div>
            <div className="w-full bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${colors[idx % colors.length]} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Helper function to get device icon
function getDeviceIcon(deviceType) {
  switch (deviceType) {
    case "Mobile":
      return <FiSmartphone />;
    case "Tablet":
      return <FiTablet />;
    default:
      return <FiMonitor />;
  }
}

// Helper function to format time ago
function formatTime(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}
