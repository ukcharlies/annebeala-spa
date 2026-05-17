"use client";

import {
  Activity,
  BarChart3,
  Clock3,
  Eye,
  Globe2,
  KeyRound,
  MousePointerClick,
  RefreshCcw,
  Search,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
const tokenStorageKey = "annebeala.analytics.adminToken";

type Metric = {
  label: string;
  views: number;
};

type DailyMetric = {
  day: string;
  views: number;
  uniqueVisitors: number;
  sessions: number;
};

type Visit = {
  id: string;
  event: "page_view" | "engagement";
  visitorId?: string;
  sessionId?: string;
  path: string;
  url?: string;
  title: string;
  referrer?: string;
  screen?: string;
  viewport?: string;
  devicePixelRatio?: number;
  connectionType?: string;
  language?: string;
  timezone?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  durationMs?: number;
  maxScrollDepth?: number;
  ipAddress: string | null;
  userAgent: string | null;
  browser: string;
  operatingSystem: string;
  deviceType: string;
  createdAt: string;
};

type AnalyticsSummary = {
  totalEvents: number;
  totalViews: number;
  uniqueVisitors: number;
  sessions: number;
  firstSeen: string | null;
  lastSeen: string | null;
  avgDurationMs: number;
  avgScrollDepth: number;
  last30Days: DailyMetric[];
  topPages: Metric[];
  referrers: Metric[];
  campaigns: Metric[];
  devices: Metric[];
  browsers: Metric[];
  timezones: Metric[];
  recentVisits: Visit[];
};

const emptySummary: AnalyticsSummary = {
  totalEvents: 0,
  totalViews: 0,
  uniqueVisitors: 0,
  sessions: 0,
  firstSeen: null,
  lastSeen: null,
  avgDurationMs: 0,
  avgScrollDepth: 0,
  last30Days: [],
  topPages: [],
  referrers: [],
  campaigns: [],
  devices: [],
  browsers: [],
  timezones: [],
  recentVisits: [],
};

const formatNumber = (value: number) => new Intl.NumberFormat("en-NG").format(value);

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "No data yet";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const formatDuration = (value: number) => {
  if (!value) {
    return "0s";
  }

  const seconds = Math.round(value / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
};

const maxViews = (items: Array<{ views: number }>) =>
  Math.max(1, ...items.map((item) => item.views));

export default function AnalyticsDashboard() {
  const [token, setToken] = useState("");
  const [draftToken, setDraftToken] = useState("");
  const [rememberToken, setRememberToken] = useState(false);
  const [summary, setSummary] = useState<AnalyticsSummary>(emptySummary);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");

  const filteredVisits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return summary.recentVisits;
    }

    return summary.recentVisits.filter((visit) =>
      [
        visit.path,
        visit.title,
        visit.ipAddress,
        visit.browser,
        visit.operatingSystem,
        visit.deviceType,
        visit.referrer,
        visit.utmCampaign,
        visit.timezone,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
    );
  }, [query, summary.recentVisits]);

  const conversionSignals = useMemo(() => {
    const bookingViews = summary.topPages.find((page) =>
      page.label.startsWith("/booking"),
    )?.views;
    const contactViews = summary.topPages.find((page) =>
      page.label.startsWith("/contact"),
    )?.views;
    const usefulViews = (bookingViews ?? 0) + (contactViews ?? 0);
    const rate =
      summary.totalViews > 0 ? Math.round((usefulViews / summary.totalViews) * 100) : 0;

    return { usefulViews, rate };
  }, [summary.topPages, summary.totalViews]);

  const recommendations = useMemo(() => {
    const notes: string[] = [];

    if (summary.totalViews === 0) {
      notes.push("Deploy the updated frontend and visit the public site once to start collecting page views.");
      notes.push("Keep this page open after traffic arrives; the dashboard refreshes from the backend token only.");
      return notes;
    }

    if (summary.avgScrollDepth > 0 && summary.avgScrollDepth < 45) {
      notes.push("Average scroll depth is low. Move the booking call-to-action higher on high-traffic pages.");
    }

    if (summary.avgDurationMs > 0 && summary.avgDurationMs < 15000) {
      notes.push("Average engagement time is short. Tighten first-screen copy and make branch/contact details easier to scan.");
    }

    if (conversionSignals.rate < 12) {
      notes.push("Booking/contact intent is below target. Add stronger booking prompts from service and package pages.");
    }

    if (summary.referrers[0]?.label === "Direct / unknown") {
      notes.push("Most traffic is direct or unattributed. Use UTM links on Instagram, WhatsApp, and Google Business Profile.");
    }

    return notes.slice(0, 4);
  }, [conversionSignals.rate, summary]);

  const fetchSummary = async (activeToken = token) => {
    if (!apiBaseUrl) {
      setError("NEXT_PUBLIC_API_BASE_URL is not configured for this build.");
      return;
    }

    if (!activeToken) {
      setError("Enter the analytics admin token first.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${apiBaseUrl}/analytics/summary`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Token rejected by the backend."
            : `Analytics request failed with HTTP ${response.status}.`,
        );
      }

      setSummary(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = window.localStorage.getItem(tokenStorageKey);
    if (savedToken) {
      setToken(savedToken);
      setDraftToken(savedToken);
      setRememberToken(true);
      void fetchSummary(savedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanToken = draftToken.trim();

    setToken(cleanToken);
    if (rememberToken) {
      window.localStorage.setItem(tokenStorageKey, cleanToken);
    } else {
      window.localStorage.removeItem(tokenStorageKey);
    }

    void fetchSummary(cleanToken);
  };

  const clearToken = () => {
    window.localStorage.removeItem(tokenStorageKey);
    setToken("");
    setDraftToken("");
    setSummary(emptySummary);
  };

  const sendTestEvent = async () => {
    if (!apiBaseUrl) {
      setError("NEXT_PUBLIC_API_BASE_URL is not configured for this build.");
      return;
    }

    setTesting(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${apiBaseUrl}/traffic/collect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "page_view",
          visitorId: "dashboard-test-visitor",
          sessionId: `dashboard-test-${Date.now()}`,
          path: "/ops/traffic-test",
          url: window.location.href,
          title: "Dashboard Test Event",
          referrer: "dashboard",
          screen: `${window.screen.width}x${window.screen.height}`,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Test event failed with HTTP ${response.status}.`);
      }

      if (token) {
        await fetchSummary(token);
      }
      setNotice("Test event accepted. It should now appear in recent traffic.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send test event.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <section className="section-shell py-10 text-brand-charcoal sm:py-14">
      <div className="mb-8 flex flex-col gap-5 border-b border-brand-olive/25 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-olive">
            Private Traffic Console
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Site Analytics</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-brand-olive">
            Watch visits, referrers, sessions, devices, scroll depth, and
            engagement signals from the live Annebeala Spa website.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-brand-olive/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-olive">
          <ShieldCheck className="h-4 w-4 text-brand-forest" />
          Token protected
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-4 rounded-lg border border-brand-olive/25 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto_auto] lg:items-end"
      >
        <label className="block">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-olive">
            <KeyRound className="h-4 w-4" />
            Analytics token
          </span>
          <input
            value={draftToken}
            onChange={(event) => setDraftToken(event.target.value)}
            type="password"
            autoComplete="off"
            className="mt-2 w-full rounded-md border border-brand-olive/30 bg-brand-ivory px-4 py-3 text-sm outline-none transition focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/15"
            placeholder="Paste ANALYTICS_ADMIN_TOKEN"
          />
        </label>
        <label className="flex items-center gap-2 pb-3 text-sm text-brand-olive">
          <input
            checked={rememberToken}
            onChange={(event) => setRememberToken(event.target.checked)}
            type="checkbox"
            className="h-4 w-4 accent-brand-forest"
          />
          Remember on this browser
        </label>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary min-w-28">
            Load
          </button>
          <button type="button" onClick={clearToken} className="btn-secondary">
            Clear
          </button>
        </div>
      </form>

      {error ? (
        <div className="mb-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="mb-8 rounded-md border border-brand-forest/25 bg-brand-sage/30 px-4 py-3 text-sm text-brand-charcoal">
          {notice}
        </div>
      ) : null}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-olive">
          Last event: {formatDateTime(summary.lastSeen)}
        </p>
        <button
          type="button"
          onClick={() => void fetchSummary()}
          disabled={!token || loading}
          className="inline-flex items-center gap-2 rounded-full border border-brand-olive/35 bg-white px-4 py-2 text-sm font-semibold text-brand-charcoal transition hover:border-brand-forest disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
        <button
          type="button"
          onClick={() => void sendTestEvent()}
          disabled={testing}
          className="inline-flex items-center gap-2 rounded-full border border-brand-olive/35 bg-white px-4 py-2 text-sm font-semibold text-brand-charcoal transition hover:border-brand-forest disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Activity className={`h-4 w-4 ${testing ? "animate-pulse" : ""}`} />
          Send test event
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Eye} label="Page views" value={formatNumber(summary.totalViews)} />
        <StatCard
          icon={Users}
          label="Unique visitors"
          value={formatNumber(summary.uniqueVisitors)}
        />
        <StatCard
          icon={Activity}
          label="Sessions"
          value={formatNumber(summary.sessions)}
        />
        <StatCard
          icon={Clock3}
          label="Avg engagement"
          value={formatDuration(summary.avgDurationMs)}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Last 30 Days" icon={BarChart3}>
          <DailyChart days={summary.last30Days} />
        </Panel>
        <Panel title="Operator Notes" icon={TrendingUp}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <MiniMetric label="Intent views" value={formatNumber(conversionSignals.usefulViews)} />
              <MiniMetric label="Intent rate" value={`${conversionSignals.rate}%`} />
              <MiniMetric label="Avg scroll" value={`${summary.avgScrollDepth || 0}%`} />
              <MiniMetric label="Events" value={formatNumber(summary.totalEvents)} />
            </div>
            <ul className="space-y-2 text-sm leading-6 text-brand-olive">
              {recommendations.map((note) => (
                <li key={note} className="rounded-md bg-brand-ivory px-3 py-2">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Top Pages" icon={MousePointerClick}>
          <MetricList items={summary.topPages} />
        </Panel>
        <Panel title="Referrers" icon={Globe2}>
          <MetricList items={summary.referrers} />
        </Panel>
        <Panel title="Campaigns" icon={TrendingUp}>
          <MetricList items={summary.campaigns} />
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Devices" icon={Smartphone}>
          <MetricList items={summary.devices} />
        </Panel>
        <Panel title="Browsers" icon={Search}>
          <MetricList items={summary.browsers} />
        </Panel>
        <Panel title="Timezones" icon={Globe2}>
          <MetricList items={summary.timezones} />
        </Panel>
      </div>

      <Panel title="Recent Traffic" icon={Activity} className="mt-6">
        <div className="mb-4 flex items-center gap-2 rounded-md border border-brand-olive/25 bg-brand-ivory px-3 py-2">
          <Search className="h-4 w-4 text-brand-olive" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search path, IP, browser, device, campaign"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <RecentVisitsTable visits={filteredVisits} />
      </Panel>
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-brand-olive/25 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-olive">
          {label}
        </p>
        <Icon className="h-5 w-5 text-brand-forest" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-normal text-brand-charcoal">
        {value}
      </p>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  children,
  className = "",
}: {
  icon: typeof Eye;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-brand-olive/25 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-body text-base font-semibold tracking-normal text-brand-charcoal">
          {title}
        </h2>
        <Icon className="h-5 w-5 text-brand-forest" />
      </div>
      {children}
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-brand-olive/20 bg-white px-3 py-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-olive">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold tracking-normal">{value}</p>
    </div>
  );
}

function DailyChart({ days }: { days: DailyMetric[] }) {
  const orderedDays = [...days].reverse();
  const highest = maxViews(orderedDays);

  if (orderedDays.length === 0) {
    return <EmptyState message="No daily traffic has been recorded yet." />;
  }

  return (
    <div className="flex h-64 items-end gap-2 border-b border-brand-olive/20 pb-3">
      {orderedDays.map((day) => (
        <div key={day.day} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-md bg-brand-forest"
            style={{
              height: `${Math.max(6, (day.views / highest) * 210)}px`,
            }}
            title={`${day.day}: ${day.views} views`}
          />
          <span className="w-full truncate text-center text-[0.65rem] text-brand-olive">
            {new Date(day.day).toLocaleDateString("en-NG", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

function MetricList({ items }: { items: Metric[] }) {
  const highest = maxViews(items);

  if (items.length === 0) {
    return <EmptyState message="No records yet." />;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-brand-charcoal">{item.label}</span>
            <span className="font-semibold">{formatNumber(item.views)}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-olive/15">
            <div
              className="h-full rounded-full bg-brand-forest"
              style={{ width: `${Math.max(4, (item.views / highest) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentVisitsTable({ visits }: { visits: Visit[] }) {
  if (visits.length === 0) {
    return <EmptyState message="No matching recent visits." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-brand-olive/20 text-xs uppercase tracking-[0.16em] text-brand-olive">
            <th className="py-3 pr-4 font-semibold">Time</th>
            <th className="py-3 pr-4 font-semibold">Event</th>
            <th className="py-3 pr-4 font-semibold">Path</th>
            <th className="py-3 pr-4 font-semibold">Visitor</th>
            <th className="py-3 pr-4 font-semibold">IP</th>
            <th className="py-3 pr-4 font-semibold">Device</th>
            <th className="py-3 pr-4 font-semibold">Engagement</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit.id} className="border-b border-brand-olive/10">
              <td className="py-4 pr-4 text-brand-olive">
                {formatDateTime(visit.createdAt)}
              </td>
              <td className="py-4 pr-4">
                <span className="rounded-full bg-brand-ivory px-3 py-1 text-xs font-semibold text-brand-charcoal">
                  {visit.event}
                </span>
              </td>
              <td className="max-w-xs py-4 pr-4">
                <p className="truncate font-semibold">{visit.path}</p>
                <p className="truncate text-xs text-brand-olive">{visit.title}</p>
              </td>
              <td className="py-4 pr-4 text-xs text-brand-olive">
                {visit.visitorId?.slice(0, 8) ?? "unknown"}
              </td>
              <td className="py-4 pr-4 text-brand-olive">{visit.ipAddress ?? "-"}</td>
              <td className="py-4 pr-4 text-brand-olive">
                {visit.deviceType} / {visit.browser}
                <span className="block text-xs">{visit.viewport ?? visit.screen}</span>
              </td>
              <td className="py-4 pr-4 text-brand-olive">
                {visit.durationMs ? formatDuration(visit.durationMs) : "-"}
                {typeof visit.maxScrollDepth === "number" ? (
                  <span className="block text-xs">{visit.maxScrollDepth}% scroll</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-brand-olive/30 bg-brand-ivory px-4 py-8 text-center text-sm text-brand-olive">
      {message}
    </div>
  );
}
