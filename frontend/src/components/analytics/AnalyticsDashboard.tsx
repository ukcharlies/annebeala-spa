"use client";

import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  Globe2,
  Info,
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
const trackerDebugKey = "annebeala.analytics.lastAttempt";

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

type TrafficFilters = {
  query: string;
  event: "all" | Visit["event"];
  device: string;
  campaign: string;
};

type Insight = {
  title: string;
  body: string;
  bullets: string[];
};

type MetricInsightKind =
  | "pages"
  | "referrers"
  | "campaigns"
  | "devices"
  | "browsers"
  | "timezones";

type TrackerDebug = {
  status: string;
  detail?: string;
  event: string;
  path: string;
  endpoint: string;
  at: string;
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

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-NG").format(value);

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

const trafficPageSizes = [5, 10, 20];

const initialTrafficFilters: TrafficFilters = {
  query: "",
  event: "all",
  device: "all",
  campaign: "all",
};

const getCampaignLabel = (visit: Visit) =>
  visit.utmCampaign || visit.utmSource || "No campaign";

const getUniqueOptions = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );

const getMetricInsight = (kind: MetricInsightKind): Insight => {
  const shared = {
    pages: {
      title: "Page detail",
      body: "This shows which site path received traffic. Paths with tracking query strings usually came from ads, social links, or tagged campaigns.",
      bullets: [
        "High page views show where visitors are landing most often.",
        "Compare booking and contact pages against the home page to judge booking intent.",
        "Long URLs with query strings can be campaign clicks and may need cleaner UTM links.",
      ],
    },
    referrers: {
      title: "Referrer detail",
      body: "A referrer is the previous website or app that sent the visitor here. Direct / unknown means the browser did not share that source.",
      bullets: [
        "Google, TikTok, Instagram, and partner links help identify useful traffic sources.",
        "Direct / unknown can include typed URLs, bookmarks, WhatsApp, Instagram app traffic, or privacy-blocked referrers.",
        "Use tagged UTM links when sharing campaigns so important traffic does not fall into unknown.",
      ],
    },
    campaigns: {
      title: "Campaign detail",
      body: "Campaigns come from UTM tracking on links. They help separate Instagram, ads, WhatsApp, Google Business Profile, and other promotions.",
      bullets: [
        "No campaign means the visit did not include a campaign label.",
        "Use utm_source, utm_medium, and utm_campaign on every promotional link.",
        "A named campaign with good booking/contact traffic is a strong signal to repeat or increase that channel.",
      ],
    },
    devices: {
      title: "Device detail",
      body: "Device counts show whether visitors browse from phones, desktops, or tablets.",
      bullets: [
        "Mobile-heavy traffic means booking, contact, and location actions should be easy with one thumb.",
        "Desktop traffic often needs more scannable package and pricing detail.",
        "Unexpected device patterns can reveal bot traffic or tracking gaps.",
      ],
    },
    browsers: {
      title: "Browser detail",
      body: "Browser counts help spot rendering and compatibility priorities.",
      bullets: [
        "Prioritize testing the browsers that carry the most traffic.",
        "Unknown browsers can be privacy tools, bots, or incomplete user-agent data.",
        "Compare browser mix with device mix before making design assumptions.",
      ],
    },
    timezones: {
      title: "Timezone detail",
      body: "Timezones estimate where visitors are browsing from based on the browser setting.",
      bullets: [
        "Africa/Lagos should be expected for local customers.",
        "Foreign timezones can be tourists, diaspora customers, bots, or remote admins.",
        "Use this to time posts and campaigns around the audience that is actually visiting.",
      ],
    },
  } satisfies Record<MetricInsightKind, Insight>;

  const insight = shared[kind];

  return {
    ...insight,
    title: insight.title,
  };
};

const metricExplanations = {
  totalViews: {
    title: "Page views",
    body: "Every page_view event is counted here, including repeat visits from the same person.",
    bullets: [
      "Use this to understand total traffic volume.",
      "Compare it with unique visitors to see whether people return or view multiple pages.",
    ],
  },
  uniqueVisitors: {
    title: "Unique visitors",
    body: "This estimates distinct visitors using the tracker visitor ID stored in the browser.",
    bullets: [
      "It is not a perfect people count because browsers, cleared storage, and privacy settings can change IDs.",
      "It is still useful for judging reach compared with total page views.",
    ],
  },
  sessions: {
    title: "Sessions",
    body: "A session groups visits from the same browser over a short browsing period.",
    bullets: [
      "A visitor can create more than one session over time.",
      "Sessions are useful for reading traffic bursts from campaigns or posts.",
    ],
  },
  avgEngagement: {
    title: "Average engagement",
    body: "Average engagement is the average tracked time visitors spend actively on the site before the engagement event is sent.",
    bullets: [
      "Very low values can mean visitors leave quickly or the tracker has not received enough engagement events yet.",
      "Read this beside average scroll depth. Good engagement with low scroll can mean the top screen answers the visitor's need.",
      "Good engagement on booking and contact pages is a stronger signal than engagement on low-intent pages.",
    ],
  },
  intentViews: {
    title: "Intent views",
    body: "Intent views are visits to booking and contact pages, which are stronger business signals than general browsing.",
    bullets: [
      "A rising count means more visitors are reaching action pages.",
      "Use this with campaigns and referrers to find which source sends people ready to book.",
    ],
  },
  intentRate: {
    title: "Intent rate",
    body: "Intent rate is booking/contact views divided by total page views.",
    bullets: [
      "A low rate means visitors may be reading but not moving toward booking or contact.",
      "Improve it by placing booking prompts earlier on high-traffic pages.",
    ],
  },
  avgScroll: {
    title: "Average scroll",
    body: "Average scroll is the average maximum page depth visitors reached before the tracker sent engagement data.",
    bullets: [
      "Low scroll can mean key content is too low, the first screen is enough, or visitors are leaving early.",
      "Pair it with average engagement before changing layout.",
      "If campaign traffic has low scroll and low engagement, the landing message may not match the ad or post.",
    ],
  },
  events: {
    title: "Events",
    body: "Events include page views and engagement events sent by the site tracker.",
    bullets: [
      "This can be higher than page views because one visit may send more than one event type.",
      "Use events to confirm the tracker is active and collecting more than simple page loads.",
    ],
  },
} satisfies Record<string, Insight>;

export default function AnalyticsDashboard() {
  const [token, setToken] = useState("");
  const [draftToken, setDraftToken] = useState("");
  const [rememberToken, setRememberToken] = useState(false);
  const [summary, setSummary] = useState<AnalyticsSummary>(emptySummary);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [trackerDebug, setTrackerDebug] = useState<TrackerDebug | null>(null);
  const [trafficFilters, setTrafficFilters] = useState<TrafficFilters>(
    initialTrafficFilters,
  );
  const [trafficPage, setTrafficPage] = useState(1);
  const [trafficPageSize, setTrafficPageSize] = useState(10);

  const filteredVisits = useMemo(() => {
    const normalizedQuery = trafficFilters.query.trim().toLowerCase();

    return summary.recentVisits.filter((visit) => {
      const campaign = getCampaignLabel(visit);
      const matchesSearch =
        !normalizedQuery ||
        [
          visit.id,
          visit.visitorId,
          visit.sessionId,
          visit.path,
          visit.title,
          visit.ipAddress,
          visit.browser,
          visit.operatingSystem,
          visit.deviceType,
          visit.referrer,
          visit.utmSource,
          visit.utmMedium,
          visit.utmCampaign,
          campaign,
          visit.timezone,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedQuery),
          );

      return (
        matchesSearch &&
        (trafficFilters.event === "all" ||
          visit.event === trafficFilters.event) &&
        (trafficFilters.device === "all" ||
          visit.deviceType === trafficFilters.device) &&
        (trafficFilters.campaign === "all" ||
          campaign === trafficFilters.campaign)
      );
    });
  }, [trafficFilters, summary.recentVisits]);

  const trafficFilterOptions = useMemo(
    () => ({
      devices: getUniqueOptions(
        summary.recentVisits.map((visit) => visit.deviceType),
      ),
      campaigns: getUniqueOptions(summary.recentVisits.map(getCampaignLabel)),
    }),
    [summary.recentVisits],
  );

  const totalTrafficPages = Math.max(
    1,
    Math.ceil(filteredVisits.length / trafficPageSize),
  );
  const currentTrafficPage = Math.min(trafficPage, totalTrafficPages);
  const paginatedVisits = filteredVisits.slice(
    (currentTrafficPage - 1) * trafficPageSize,
    currentTrafficPage * trafficPageSize,
  );
  const trafficStart =
    filteredVisits.length === 0
      ? 0
      : (currentTrafficPage - 1) * trafficPageSize + 1;
  const trafficEnd = Math.min(
    currentTrafficPage * trafficPageSize,
    filteredVisits.length,
  );

  useEffect(() => {
    setTrafficPage(1);
  }, [trafficFilters, trafficPageSize, summary.recentVisits]);

  useEffect(() => {
    if (trafficPage > totalTrafficPages) {
      setTrafficPage(totalTrafficPages);
    }
  }, [trafficPage, totalTrafficPages]);

  const updateTrafficFilter = <Key extends keyof TrafficFilters>(
    key: Key,
    value: TrafficFilters[Key],
  ) => {
    setTrafficFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetTrafficFilters = () => {
    setTrafficFilters(initialTrafficFilters);
    setTrafficPage(1);
  };

  const conversionSignals = useMemo(() => {
    const bookingViews = summary.topPages.find((page) =>
      page.label.startsWith("/booking"),
    )?.views;
    const contactViews = summary.topPages.find((page) =>
      page.label.startsWith("/contact"),
    )?.views;
    const usefulViews = (bookingViews ?? 0) + (contactViews ?? 0);
    const rate =
      summary.totalViews > 0
        ? Math.round((usefulViews / summary.totalViews) * 100)
        : 0;

    return { usefulViews, rate };
  }, [summary.topPages, summary.totalViews]);

  const recommendations = useMemo(() => {
    const notes: string[] = [];

    if (summary.totalViews === 0) {
      notes.push(
        "Deploy the updated frontend and visit the public site once to start collecting page views.",
      );
      notes.push(
        "Keep this page open after traffic arrives; the dashboard refreshes from the backend token only.",
      );
      return notes;
    }

    if (summary.avgScrollDepth > 0 && summary.avgScrollDepth < 45) {
      notes.push(
        "Average scroll depth is low. Move the booking call-to-action higher on high-traffic pages.",
      );
    }

    if (summary.avgDurationMs > 0 && summary.avgDurationMs < 15000) {
      notes.push(
        "Average engagement time is short. Tighten first-screen copy and make branch/contact details easier to scan.",
      );
    }

    if (conversionSignals.rate < 12) {
      notes.push(
        "Booking/contact intent is below target. Add stronger booking prompts from service and package pages.",
      );
    }

    if (summary.referrers[0]?.label === "Direct / unknown") {
      notes.push(
        "Most traffic is direct or unattributed. Use UTM links on Instagram, WhatsApp, and Google Business Profile.",
      );
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
      setError(
        err instanceof Error ? err.message : "Unable to load analytics.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const readTrackerDebug = () => {
      const rawDebug = window.sessionStorage.getItem(trackerDebugKey);
      if (!rawDebug) {
        setTrackerDebug(null);
        return;
      }

      try {
        setTrackerDebug(JSON.parse(rawDebug));
      } catch {
        setTrackerDebug(null);
      }
    };

    const savedToken = window.localStorage.getItem(tokenStorageKey);
    if (savedToken) {
      setToken(savedToken);
      setDraftToken(savedToken);
      setRememberToken(true);
      void fetchSummary(savedToken);
    }
    readTrackerDebug();

    window.addEventListener("focus", readTrackerDebug);
    window.addEventListener("annebeala:analytics", readTrackerDebug);

    return () => {
      window.removeEventListener("focus", readTrackerDebug);
      window.removeEventListener("annebeala:analytics", readTrackerDebug);
    };
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
      setError(
        err instanceof Error ? err.message : "Unable to send test event.",
      );
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

      <div className="mb-8 rounded-lg border border-brand-olive/25 bg-white p-4 text-sm shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-olive">
              Browser tracker diagnostic
            </p>
            <p className="mt-2 text-brand-olive">
              {trackerDebug
                ? `${trackerDebug.status} ${trackerDebug.event} for ${trackerDebug.path} at ${formatDateTime(trackerDebug.at)}`
                : "No automatic tracker attempt has been seen in this browser tab yet."}
            </p>
            {trackerDebug?.detail ? (
              <p className="mt-1 text-xs text-brand-olive">
                Detail: {trackerDebug.detail}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => {
              const rawDebug = window.sessionStorage.getItem(trackerDebugKey);
              try {
                setTrackerDebug(rawDebug ? JSON.parse(rawDebug) : null);
              } catch {
                setTrackerDebug(null);
              }
            }}
            className="inline-flex items-center justify-center rounded-full border border-brand-olive/35 bg-white px-4 py-2 text-sm font-semibold text-brand-charcoal transition hover:border-brand-forest"
          >
            Check tracker state
          </button>
        </div>
      </div>

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
        <StatCard
          icon={Eye}
          label="Page views"
          value={formatNumber(summary.totalViews)}
          insight={metricExplanations.totalViews}
        />
        <StatCard
          icon={Users}
          label="Unique visitors"
          value={formatNumber(summary.uniqueVisitors)}
          insight={metricExplanations.uniqueVisitors}
        />
        <StatCard
          icon={Activity}
          label="Sessions"
          value={formatNumber(summary.sessions)}
          insight={metricExplanations.sessions}
        />
        <StatCard
          icon={Clock3}
          label="Avg engagement"
          value={formatDuration(summary.avgDurationMs)}
          insight={metricExplanations.avgEngagement}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Last 30 Days" icon={BarChart3}>
          <DailyChart days={summary.last30Days} />
        </Panel>
        <Panel title="Operator Notes" icon={TrendingUp}>
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <MiniMetric
                label="Intent views"
                value={formatNumber(conversionSignals.usefulViews)}
                insight={metricExplanations.intentViews}
              />
              <MiniMetric
                label="Intent rate"
                value={`${conversionSignals.rate}%`}
                insight={metricExplanations.intentRate}
              />
              <MiniMetric
                label="Avg scroll"
                value={`${summary.avgScrollDepth || 0}%`}
                insight={metricExplanations.avgScroll}
              />
              <MiniMetric
                label="Events"
                value={formatNumber(summary.totalEvents)}
                insight={metricExplanations.events}
              />
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
          <MetricList items={summary.topPages} kind="pages" />
        </Panel>
        <Panel title="Referrers" icon={Globe2}>
          <MetricList items={summary.referrers} kind="referrers" />
        </Panel>
        <Panel title="Campaigns" icon={TrendingUp}>
          <MetricList items={summary.campaigns} kind="campaigns" />
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Devices" icon={Smartphone}>
          <MetricList items={summary.devices} kind="devices" />
        </Panel>
        <Panel title="Browsers" icon={Search}>
          <MetricList items={summary.browsers} kind="browsers" />
        </Panel>
        <Panel title="Timezones" icon={Globe2}>
          <MetricList items={summary.timezones} kind="timezones" />
        </Panel>
      </div>

      <Panel title="Recent Traffic" icon={Activity} className="mt-6">
        <form
          onSubmit={(event) => event.preventDefault()}
          className="mb-4 grid gap-3 rounded-md border border-brand-olive/20 bg-brand-ivory p-3 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))_auto] lg:items-end"
        >
          <label className="block">
            <span className="mb-1 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-olive">
              <Search className="h-3.5 w-3.5" />
              Search
            </span>
            <input
              value={trafficFilters.query}
              onChange={(event) =>
                updateTrafficFilter("query", event.target.value)
              }
              placeholder="Path, IP, browser, campaign"
              className="w-full rounded-md border border-brand-olive/25 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/15"
            />
          </label>

          <FilterSelect
            label="Event"
            value={trafficFilters.event}
            onChange={(value) =>
              updateTrafficFilter("event", value as TrafficFilters["event"])
            }
            options={[
              { value: "all", label: "All events" },
              { value: "page_view", label: "Page views" },
              { value: "engagement", label: "Engagement" },
            ]}
          />

          <FilterSelect
            label="Device"
            value={trafficFilters.device}
            onChange={(value) => updateTrafficFilter("device", value)}
            options={[
              { value: "all", label: "All devices" },
              ...trafficFilterOptions.devices.map((device) => ({
                value: device,
                label: device,
              })),
            ]}
          />

          <FilterSelect
            label="Campaign"
            value={trafficFilters.campaign}
            onChange={(value) => updateTrafficFilter("campaign", value)}
            options={[
              { value: "all", label: "All campaigns" },
              ...trafficFilterOptions.campaigns.map((campaign) => ({
                value: campaign,
                label: campaign,
              })),
            ]}
          />

          <FilterSelect
            label="Per page"
            value={String(trafficPageSize)}
            onChange={(value) => setTrafficPageSize(Number(value))}
            options={trafficPageSizes.map((size) => ({
              value: String(size),
              label: `${size} rows`,
            }))}
          />

          <button
            type="button"
            onClick={resetTrafficFilters}
            className="inline-flex items-center justify-center rounded-md border border-brand-olive/30 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brand-charcoal transition hover:border-brand-forest"
          >
            Reset
          </button>
        </form>

        <div className="mb-4 flex flex-col gap-2 text-sm text-brand-olive sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {trafficStart}-{trafficEnd} of{" "}
            {formatNumber(filteredVisits.length)} visits
          </p>
          <PaginationControls
            page={currentTrafficPage}
            totalPages={totalTrafficPages}
            onPageChange={setTrafficPage}
          />
        </div>

        <RecentVisitsTable visits={paginatedVisits} />

        <div className="mt-4 flex justify-end">
          <PaginationControls
            page={currentTrafficPage}
            totalPages={totalTrafficPages}
            onPageChange={setTrafficPage}
          />
        </div>
      </Panel>
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  insight,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  insight: Insight;
}) {
  return (
    <div className="relative rounded-lg border border-brand-olive/25 bg-white p-5 shadow-sm">
      <div className="flex w-full items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-olive">
          {label}
        </p>
        <span className="flex items-center gap-2 text-brand-forest">
          <InfoPopover insight={insight} />
          <Icon className="h-5 w-5" />
        </span>
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
    <section
      className={`rounded-lg border border-brand-olive/25 bg-white p-5 shadow-sm ${className}`}
    >
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

function MiniMetric({
  label,
  value,
  insight,
}: {
  label: string;
  value: string;
  insight: Insight;
}) {
  return (
    <div className="relative rounded-md border border-brand-olive/20 bg-white px-3 py-3">
      <div className="flex w-full items-start justify-between gap-2">
        <span>
          <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-olive">
            {label}
          </span>
          <span className="mt-1 block text-xl font-semibold tracking-normal">
            {value}
          </span>
        </span>
        <InfoPopover insight={insight} compact />
      </div>
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
        <div
          key={day.day}
          className="flex min-w-0 flex-1 flex-col items-center gap-2"
        >
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

function InsightBox({
  insight,
  className = "",
  compact = false,
}: {
  insight: Insight;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-md border border-brand-forest/15 bg-brand-ivory px-3 py-3 text-sm text-brand-olive ${className}`}
    >
      <p className="wrap-break-word font-semibold text-brand-charcoal">
        {insight.title}
      </p>
      <p
        className={`${compact ? "mt-1" : "mt-2"} break-words leading-6 [overflow-wrap:anywhere]`}
      >
        {insight.body}
      </p>
      <ul className="mt-2 space-y-1.5 leading-5">
        {insight.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-forest" />
            <span className="[overflow-wrap:anywhere]">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoPopover({
  insight,
  compact = false,
  label = "Show metric meaning",
}: {
  insight: Insight;
  compact?: boolean;
  label?: string;
}) {
  return (
    <span className="group/tooltip relative inline-flex">
      <button
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-brand-forest outline-none transition hover:bg-brand-ivory focus-visible:ring-2 focus-visible:ring-brand-forest/30"
        aria-label={label}
      >
        <Info className="h-4 w-4" />
      </button>
      <span className="invisible absolute right-0 top-8 z-40 block w-[min(22rem,calc(100vw-2rem))] opacity-0 transition group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100">
        <InsightBox
          insight={insight}
          compact={compact}
          className="max-h-80 overflow-auto shadow-lg"
        />
      </span>
    </span>
  );
}

function DetailPopover({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="group/tooltip relative inline-flex">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-brand-olive/25 bg-white px-3 py-1 text-xs font-semibold text-brand-charcoal outline-none transition hover:border-brand-forest focus-visible:ring-2 focus-visible:ring-brand-forest/30"
        aria-label={label}
      >
        Info
        <Info className="h-3.5 w-3.5 text-brand-forest" />
      </button>
      <span className="invisible absolute right-0 top-9 z-40 block w-[min(44rem,calc(100vw-2rem))] opacity-0 transition group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100">
        {children}
      </span>
    </span>
  );
}

function MetricPopover({
  kind,
  item,
}: {
  kind: MetricInsightKind;
  item: Metric;
}) {
  const insight = getMetricInsight(kind);

  return (
    <span className="group/tooltip relative inline-flex">
      <button
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-brand-forest outline-none transition hover:bg-brand-ivory focus-visible:ring-2 focus-visible:ring-brand-forest/30"
        aria-label={`Show details for ${item.label}`}
      >
        <Info className="h-4 w-4" />
      </button>
      <span className="invisible absolute right-0 top-8 z-40 block w-[min(24rem,calc(100vw-2rem))] opacity-0 transition group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100">
        <div className="max-h-96 overflow-auto rounded-md border border-brand-forest/15 bg-brand-ivory px-3 py-3 text-sm text-brand-olive shadow-lg">
          <div className="rounded-md bg-white px-3 py-2">
            <span className="block text-[0.65rem] font-semibold uppercase tracking-wide text-brand-olive">
              Tracked value
            </span>
            <span className="mt-1 block  text-brand-charcoal [overflow-wrap:anywhere]">
              {item.label}
            </span>
          </div>
          <InsightBox
            insight={insight}
            className="mt-3 border-0 bg-transparent p-0 shadow-none"
            compact
          />
        </div>
      </span>
    </span>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-olive">
        <Filter className="h-3.5 w-3.5" />
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-brand-olive/25 bg-white px-3 py-2 text-sm text-brand-charcoal outline-none transition focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <nav
      className="flex items-center gap-2"
      aria-label="Recent traffic pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={!canGoBack}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-olive/25 bg-white text-brand-charcoal transition hover:border-brand-forest disabled:cursor-not-allowed disabled:opacity-45"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="min-w-24 text-center text-xs font-semibold uppercase tracking-wide text-brand-olive">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={!canGoForward}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-olive/25 bg-white text-brand-charcoal transition hover:border-brand-forest disabled:cursor-not-allowed disabled:opacity-45"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

function MetricList({
  items,
  kind,
}: {
  items: Metric[];
  kind: MetricInsightKind;
}) {
  const highest = maxViews(items);

  if (items.length === 0) {
    return <EmptyState message="No records yet." />;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="relative">
          <div className="flex w-full items-center justify-between gap-3 text-sm">
            <span
              className="min-w-0 truncate text-brand-charcoal"
              title={item.label}
            >
              {item.label}
            </span>
            <span className="flex shrink-0 items-center gap-2 font-semibold">
              {formatNumber(item.views)}
              <MetricPopover kind={kind} item={item} />
            </span>
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
    <>
      <div className="space-y-3 md:hidden">
        {visits.map((visit) => (
          <article
            key={visit.id}
            className="relative rounded-md border border-brand-olive/20 bg-white p-4"
          >
            <div className="flex w-full items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="block text-xs text-brand-olive">
                  {formatDateTime(visit.createdAt)}
                </span>
                <span className="mt-2 block truncate font-semibold text-brand-charcoal">
                  {visit.path}
                </span>
                <span className="mt-1 block truncate text-xs text-brand-olive">
                  {visit.deviceType} / {visit.browser}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-brand-ivory px-3 py-1 text-xs font-semibold text-brand-charcoal">
                {visit.event}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-brand-olive">
              <DetailPill
                label="Visitor"
                value={visit.visitorId?.slice(0, 8) ?? "unknown"}
              />
              <DetailPill label="IP" value={visit.ipAddress ?? "-"} />
              <DetailPill label="Campaign" value={getCampaignLabel(visit)} />
              <DetailPill
                label="Engagement"
                value={
                  visit.durationMs ? formatDuration(visit.durationMs) : "-"
                }
              />
            </div>

            <div className="mt-3 flex justify-end">
              <DetailPopover label={`Show details for ${visit.path}`}>
                <VisitDetail visit={visit} />
              </DetailPopover>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
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
              <th className="py-3 pr-4 font-semibold">Details</th>
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
                  <p className="truncate text-xs text-brand-olive">
                    {visit.title}
                  </p>
                </td>
                <td className="py-4 pr-4 text-xs text-brand-olive">
                  {visit.visitorId?.slice(0, 8) ?? "unknown"}
                </td>
                <td className="py-4 pr-4 text-brand-olive">
                  {visit.ipAddress ?? "-"}
                </td>
                <td className="py-4 pr-4 text-brand-olive">
                  {visit.deviceType} / {visit.browser}
                  <span className="block text-xs">
                    {visit.viewport ?? visit.screen}
                  </span>
                </td>
                <td className="py-4 pr-4 text-brand-olive">
                  {visit.durationMs ? formatDuration(visit.durationMs) : "-"}
                  {typeof visit.maxScrollDepth === "number" ? (
                    <span className="block text-xs">
                      {visit.maxScrollDepth}% scroll
                    </span>
                  ) : null}
                </td>
                <td className="py-4 pr-4">
                  <DetailPopover label={`Show details for ${visit.path}`}>
                    <VisitDetail visit={visit} />
                  </DetailPopover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-brand-ivory px-3 py-2">
      <span className="block font-semibold uppercase tracking-wide text-brand-olive">
        {label}
      </span>
      <span className="mt-1 block truncate text-brand-charcoal">{value}</span>
    </div>
  );
}

function VisitDetail({ visit }: { visit: Visit }) {
  return (
    <div className="mt-4 rounded-md border border-brand-forest/15 bg-brand-ivory px-4 py-4 text-sm text-brand-olive md:mt-0">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DetailPill
          label="Referrer"
          value={visit.referrer || "Direct / unknown"}
        />
        <DetailPill label="Campaign" value={getCampaignLabel(visit)} />
        <DetailPill label="Source" value={visit.utmSource || "-"} />
        <DetailPill label="Medium" value={visit.utmMedium || "-"} />
        <DetailPill label="Timezone" value={visit.timezone || "-"} />
        <DetailPill label="Language" value={visit.language || "-"} />
        <DetailPill
          label="Session"
          value={visit.sessionId?.slice(0, 12) || "-"}
        />
        <DetailPill
          label="Viewport"
          value={visit.viewport || visit.screen || "-"}
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <InsightBox
          compact
          insight={{
            title: "How to read this visit",
            body: "This row combines the page event, source labels, browser details, and engagement data for one tracked visit.",
            bullets: [
              "Referrer explains where the visitor likely came from before reaching the site.",
              "Campaign, source, and medium are only useful when the shared link includes UTM tags.",
              "Engagement time and max scroll show whether the visitor stayed and how far they moved down the page.",
            ],
          }}
        />
        <InsightBox
          compact
          insight={{
            title: "Engagement detail",
            body: "Engagement is strongest when time on page and scroll depth are both meaningful for booking, contact, or package pages.",
            bullets: [
              `Time tracked: ${
                visit.durationMs
                  ? formatDuration(visit.durationMs)
                  : "not recorded"
              }.`,
              `Max scroll: ${
                typeof visit.maxScrollDepth === "number"
                  ? `${visit.maxScrollDepth}%`
                  : "not recorded"
              }.`,
              "Missing values usually mean the visitor left before the engagement event fired or the event was a simple page view.",
            ],
          }}
        />
      </div>
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
