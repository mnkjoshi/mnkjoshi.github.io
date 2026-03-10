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
} from "react-icons/fi";

// Helper to format numbers
const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

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
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const analyticsRef = collection(db, "analytics");
      
      // Calculate date filter
      let q;
      if (dateRange === 0) {
        // All time
        q = query(analyticsRef, orderBy("timestamp", "desc"));
      } else {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - dateRange);
        q = query(
          analyticsRef,
          where("timestamp", ">=", Timestamp.fromDate(cutoffDate)),
          orderBy("timestamp", "desc")
        );
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));

      setAnalytics(data);
      calculateStats(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      // Use empty data on error
      setAnalytics([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(data) {
    if (data.length === 0) {
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
      });
      return;
    }

    // Unique visitors and sessions
    const uniqueVisitors = new Set(data.map(d => d.visitorId)).size;
    const uniqueSessions = new Set(data.map(d => d.sessionId)).size;
    const totalViews = data.length;

    // Page views count
    const pageViews = {};
    data.forEach(d => {
      pageViews[d.pagePath] = (pageViews[d.pagePath] || 0) + 1;
    });

    // Top pages
    const topPages = Object.entries(pageViews)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top projects (from metadata)
    const projectViews = {};
    data.forEach(d => {
      if (d.projectId) {
        projectViews[d.projectId] = (projectViews[d.projectId] || 0) + 1;
      }
    });
    const topProjects = Object.entries(projectViews)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top blogs (from metadata)
    const blogViews = {};
    data.forEach(d => {
      if (d.blogId) {
        blogViews[d.blogId] = (blogViews[d.blogId] || 0) + 1;
      }
    });
    const topBlogs = Object.entries(blogViews)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

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

    // Referrers (excluding direct)
    const referrerCounts = {};
    data.forEach(d => {
      if (d.referrer && d.referrer !== "Direct") {
        try {
          const url = new URL(d.referrer);
          const domain = url.hostname.replace("www.", "");
          referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
        } catch {
          // Invalid URL
        }
      }
    });
    const referrers = Object.entries(referrerCounts)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent visits (last 20)
    const recentVisits = data.slice(0, 20);

    // Views by date for chart
    const viewsByDate = {};
    data.forEach(d => {
      const dateStr = d.timestamp.toISOString().split("T")[0];
      viewsByDate[dateStr] = (viewsByDate[dateStr] || 0) + 1;
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
    });
  }

  if (loading) return <Loader />;

  const { uniqueVisitors, totalViews, uniqueSessions, topPages, topProjects, topBlogs, browsers, devices, operatingSystems, referrers, recentVisits, countries } = stats;

  // Individual view: show last 10 visitors with all details
  if (viewMode === "individual") {
    const lastTenVisits = analytics.slice(0, 10);
    
    return (
      <div className="space-y-6">
        {/* Header with toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("aggregate")}
              className="px-4 py-2 text-xs font-fira rounded-lg border border-white/[0.1] text-text_muted hover:text-cyber hover:border-cyber/30 transition-colors"
            >
              ← Aggregate
            </button>
            <h3 className="font-fira text-sm font-semibold text-cyber">
              Individual Visitors
            </h3>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="bg-obsidian border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs font-fira text-text_primary outline-none focus:border-cyber/60 transition-colors"
          >
            <option value="1">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="0">All Time</option>
          </select>
        </div>

        {/* Individual visitor cards */}
        {lastTenVisits.length === 0 ? (
          <p className="text-text_muted/60 text-center py-20">No visitor data available</p>
        ) : (
          <div className="space-y-4">
            {lastTenVisits.map((visit, idx) => (
              <div
                key={visit.id}
                className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyber/10 border border-cyber/30 flex items-center justify-center">
                      <span className="text-cyber font-fira font-bold text-sm">
                        {idx + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-fira text-sm font-semibold text-text_primary">
                        {visit.pageTitle || "Untitled Page"}
                      </h4>
                      <p className="text-text_muted/60 text-xs font-mono">
                        {visit.pagePath}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-text_muted/70 text-xs font-fira">
                      {visit.timestamp.toLocaleString()}
                    </p>
                    <p className="text-text_muted/50 text-[10px] font-fira">
                      {formatTime(visit.timestamp)}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Location */}
                  <DetailItem
                    label="Location"
                    value={
                      visit.location?.country !== "Unknown"
                        ? `${visit.location?.city || "Unknown"}, ${visit.location?.country || "Unknown"}`
                        : "Unknown"
                    }
                    icon="🌍"
                  />
                  
                  {/* Browser */}
                  <DetailItem
                    label="Browser"
                    value={`${visit.browser || "Unknown"}${visit.browserVersion ? ` ${visit.browserVersion}` : ""}`}
                    icon="🌐"
                  />
                  
                  {/* Operating System */}
                  <DetailItem
                    label="OS"
                    value={`${visit.os || "Unknown"}${visit.osVersion ? ` ${visit.osVersion}` : ""}`}
                    icon="💻"
                  />
                  
                  {/* Device */}
                  <DetailItem
                    label="Device"
                    value={visit.deviceType || "Unknown"}
                    icon={visit.deviceType === "Mobile" ? "📱" : visit.deviceType === "Tablet" ? "📲" : "🖥️"}
                  />
                  
                  {/* Screen Resolution */}
                  <DetailItem
                    label="Screen"
                    value={`${visit.screen?.width || "?"}×${visit.screen?.height || "?"} (${visit.screen?.viewportWidth || "?"}×${visit.screen?.viewportHeight || "?"} viewport)`}
                    icon="🖼️"
                  />
                  
                  {/* Language */}
                  <DetailItem
                    label="Language"
                    value={visit.screen?.language || "Unknown"}
                    icon="🗣️"
                  />
                  
                  {/* Timezone */}
                  <DetailItem
                    label="Timezone"
                    value={visit.location?.timezone || visit.screen?.timezone || "Unknown"}
                    icon="🕐"
                  />
                  
                  {/* Referrer */}
                  <DetailItem
                    label="Referrer"
                    value={
                      visit.referrer && visit.referrer !== "Direct"
                        ? new URL(visit.referrer).hostname.replace("www.", "")
                        : "Direct"
                    }
                    icon="🔗"
                  />
                  
                  {/* Pixel Ratio */}
                  <DetailItem
                    label="Pixel Ratio"
                    value={`${visit.screen?.pixelRatio || 1}x`}
                    icon="✨"
                  />
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-white/[0.05]">
                  <div className="grid sm:grid-cols-2 gap-2 text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="text-text_muted/50 font-fira">Visitor ID:</span>
                      <code className="text-text_muted/70 font-mono bg-white/[0.02] px-2 py-0.5 rounded">
                        {visit.visitorId?.slice(-12) || "Unknown"}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text_muted/50 font-fira">Session ID:</span>
                      <code className="text-text_muted/70 font-mono bg-white/[0.02] px-2 py-0.5 rounded">
                        {visit.sessionId?.slice(-12) || "Unknown"}
                      </code>
                    </div>
                    {visit.location?.ip && visit.location.ip !== "Unknown" && (
                      <div className="flex items-center gap-2">
                        <span className="text-text_muted/50 font-fira">IP:</span>
                        <code className="text-text_muted/70 font-mono bg-white/[0.02] px-2 py-0.5 rounded">
                          {visit.location.ip}
                        </code>
                      </div>
                    )}
                    {visit.location?.latitude && visit.location?.longitude && (
                      <div className="flex items-center gap-2">
                        <span className="text-text_muted/50 font-fira">Coordinates:</span>
                        <code className="text-text_muted/70 font-mono bg-white/[0.02] px-2 py-0.5 rounded">
                          {visit.location.latitude.toFixed(4)}, {visit.location.longitude.toFixed(4)}
                        </code>
                      </div>
                    )}
                  </div>
                  {visit.userAgent && (
                    <div className="mt-2">
                      <p className="text-text_muted/50 font-fira text-[10px] mb-1">User Agent:</p>
                      <code className="text-text_muted/60 font-mono text-[9px] leading-relaxed break-all block bg-white/[0.02] p-2 rounded">
                        {visit.userAgent}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Aggregate view (original dashboard)
  return (
    <div className="space-y-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-fira text-sm font-semibold text-cyber">
            Aggregate Statistics
          </h3>
          <button
            onClick={() => setViewMode("individual")}
            className="px-4 py-2 text-xs font-fira rounded-lg border border-white/[0.1] text-text_muted hover:text-cyber hover:border-cyber/30 transition-colors"
          >
            Individual →
          </button>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(Number(e.target.value))}
          className="bg-obsidian border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs font-fira text-text_primary outline-none focus:border-cyber/60 transition-colors"
        >
          <option value="1">Today</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="0">All Time</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>

      {/* Top Pages */}
      <StatSection title="Most Visited Pages" icon={<FiFileText />}>
        {topPages.length === 0 ? (
          <p className="text-text_muted/60 text-xs">No page views yet</p>
        ) : (
          <div className="space-y-2">
            {topPages.map((page, idx) => (
              <div
                key={page.path}
                className="flex items-center justify-between bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.04]"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-cyber/50 text-[10px] font-fira font-bold shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="text-text_primary text-xs font-mono truncate">
                    {page.path}
                  </span>
                </div>
                <span className="text-text_muted/70 text-xs font-fira shrink-0 ml-2">
                  {page.count} views
                </span>
              </div>
            ))}
          </div>
        )}
      </StatSection>

      {/* Top Projects & Blogs */}
      <div className="grid lg:grid-cols-2 gap-4">
        <StatSection title="Top Projects" icon={<FiTrendingUp />}>
          {topProjects.length === 0 ? (
            <p className="text-text_muted/60 text-xs">No project views yet</p>
          ) : (
            <div className="space-y-2">
              {topProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-cyber/50 text-[10px] font-fira font-bold">
                      #{idx + 1}
                    </span>
                    <span className="text-text_primary text-xs truncate">
                      {project.id}
                    </span>
                  </div>
                  <span className="text-text_muted/70 text-xs font-fira">
                    {project.count} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </StatSection>

        <StatSection title="Top Blog Posts" icon={<FiFileText />}>
          {topBlogs.length === 0 ? (
            <p className="text-text_muted/60 text-xs">No blog views yet</p>
          ) : (
            <div className="space-y-2">
              {topBlogs.map((blog, idx) => (
                <div
                  key={blog.id}
                  className="flex items-center justify-between bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-cyber/50 text-[10px] font-fira font-bold">
                      #{idx + 1}
                    </span>
                    <span className="text-text_primary text-xs truncate">
                      {blog.id}
                    </span>
                  </div>
                  <span className="text-text_muted/70 text-xs font-fira">
                    {blog.count} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </StatSection>
      </div>

      {/* Browsers, Devices, OS, Countries */}
      <div className="grid lg:grid-cols-4 gap-4">
        <StatSection title="Browsers" icon={<FiChrome />}>
          <PieData data={browsers} />
        </StatSection>
        <StatSection title="Devices" icon={<FiMonitor />}>
          <PieData data={devices} />
        </StatSection>
        <StatSection title="Operating Systems" icon={<FiSmartphone />}>
          <PieData data={operatingSystems} />
        </StatSection>
        <StatSection title="Countries" icon={<FiMapPin />}>
          <PieData data={countries} />
        </StatSection>
      </div>

      {/* Referrers */}
      <StatSection title="Traffic Sources" icon={<FiMapPin />}>
        {referrers.length === 0 ? (
          <p className="text-text_muted/60 text-xs">All traffic is direct</p>
        ) : (
          <div className="space-y-2">
            {referrers.map((ref, idx) => (
              <div
                key={ref.domain}
                className="flex items-center justify-between bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.04]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-cyber/50 text-[10px] font-fira font-bold">
                    #{idx + 1}
                  </span>
                  <span className="text-text_primary text-xs">{ref.domain}</span>
                </div>
                <span className="text-text_muted/70 text-xs font-fira">
                  {ref.count} visits
                </span>
              </div>
            ))}
          </div>
        )}
      </StatSection>

      {/* Recent Activity */}
      <StatSection title="Recent Activity" icon={<FiClock />}>
        {recentVisits.length === 0 ? (
          <p className="text-text_muted/60 text-xs">No recent activity</p>
        ) : (
          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {recentVisits.map((visit) => (
              <div
                key={visit.id}
                className="flex items-center justify-between bg-white/[0.01] rounded-lg p-2 border border-white/[0.03] text-[11px]"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-text_muted/50">
                    {getDeviceIcon(visit.deviceType)}
                  </span>
                  <span className="text-text_primary font-mono truncate">
                    {visit.pagePath}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-text_muted/60 text-[10px]">
                  <span>{visit.browser}</span>
                  <span className="text-text_muted/30">•</span>
                  <span>{formatTime(visit.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </StatSection>
    </div>
  );
}

// DetailItem component for individual view
function DetailItem({ label, value, icon }) {
  return (
    <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.04]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-text_muted/60 text-[10px] font-fira uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-text_primary text-xs font-fira truncate" title={value}>
        {value}
      </p>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color = "cyber" }) {
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
    </div>
  );
}

// Section Component
function StatSection({ title, icon, children }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-cyber/70 text-sm">{icon}</span>
        <h3 className="font-fira text-sm font-semibold text-text_primary">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// Pie Data Component (simple bar chart)
function PieData({ data }) {
  const entries = Object.entries(data)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);

  const total = entries.reduce((sum, e) => sum + e.value, 0);

  if (entries.length === 0) {
    return <p className="text-text_muted/60 text-xs">No data</p>;
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => {
        const percentage = ((entry.value / total) * 100).toFixed(1);
        return (
          <div key={entry.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-text_primary text-xs">{entry.key}</span>
              <span className="text-text_muted/70 text-xs font-fira">
                {percentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full bg-cyber/60 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Helper functions
function getDeviceIcon(deviceType) {
  switch (deviceType) {
    case "Mobile":
      return <FiSmartphone className="text-[10px]" />;
    case "Tablet":
      return <FiTablet className="text-[10px]" />;
    default:
      return <FiMonitor className="text-[10px]" />;
  }
}

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
