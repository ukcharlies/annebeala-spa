"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
const visitorKey = "annebeala.analytics.visitor";
const sessionKey = "annebeala.analytics.session";
const sessionStartedKey = "annebeala.analytics.sessionStarted";
const debugKey = "annebeala.analytics.lastAttempt";
const sessionWindowMs = 30 * 60 * 1000;

type AnalyticsEvent = "page_view" | "engagement";

type VisitPayload = {
  event: AnalyticsEvent;
  visitorId: string;
  sessionId: string;
  path: string;
  url: string;
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
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    effectiveType?: string;
    type?: string;
  };
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

const getOrCreateVisitorId = () => {
  const existing = window.localStorage.getItem(visitorKey);

  if (existing) {
    return existing;
  }

  const id = createId();
  window.localStorage.setItem(visitorKey, id);
  return id;
};

const getOrCreateSessionId = () => {
  const now = Date.now();
  const existing = window.sessionStorage.getItem(sessionKey);
  const startedAt = Number(window.sessionStorage.getItem(sessionStartedKey));

  if (existing && Number.isFinite(startedAt) && now - startedAt < sessionWindowMs) {
    return existing;
  }

  const id = createId();
  window.sessionStorage.setItem(sessionKey, id);
  window.sessionStorage.setItem(sessionStartedKey, String(now));
  return id;
};

const getConnectionType = () => {
  const connection = (navigator as NavigatorWithConnection).connection;
  return connection?.effectiveType ?? connection?.type;
};

const getScrollDepth = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const viewportHeight = window.innerHeight;
  const pageHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );

  if (pageHeight <= viewportHeight) {
    return 100;
  }

  return Math.min(
    100,
    Math.max(0, Math.round(((scrollTop + viewportHeight) / pageHeight) * 100)),
  );
};

const writeDebugState = (
  payload: VisitPayload,
  status: "queued" | "sent" | "failed" | "beacon-fallback",
  detail?: string,
) => {
  try {
    window.sessionStorage.setItem(
      debugKey,
      JSON.stringify({
        status,
        detail,
        event: payload.event,
        path: payload.path,
        endpoint: `${apiBaseUrl}/traffic/collect`,
        at: new Date().toISOString(),
      }),
    );
  } catch {
    // Debug state is best-effort only.
  }
};

const sendWithBeacon = (endpoint: string, body: string, payload: VisitPayload) => {
  if (!navigator.sendBeacon) {
    return false;
  }

  const blob = new Blob([body], { type: "application/json" });
  const queued = navigator.sendBeacon(endpoint, blob);

  if (queued) {
    writeDebugState(payload, "beacon-fallback");
  }

  return queued;
};

const sendPayload = (payload: VisitPayload) => {
  if (!apiBaseUrl) {
    return;
  }

  const body = JSON.stringify(payload);
  const endpoint = `${apiBaseUrl}/traffic/collect`;
  writeDebugState(payload, "queued");

  void fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  })
    .then((response) => {
      if (response.ok) {
        writeDebugState(payload, "sent", String(response.status));
        return;
      }

      writeDebugState(payload, "failed", String(response.status));
      sendWithBeacon(endpoint, body, payload);
    })
    .catch((error: unknown) => {
      writeDebugState(
        payload,
        "failed",
        error instanceof Error ? error.message : "network error",
      );
      sendWithBeacon(endpoint, body, payload);
    });
};

const sendPayloadOnExit = (payload: VisitPayload) => {
  if (!apiBaseUrl) {
    return;
  }

  const body = JSON.stringify(payload);
  const endpoint = `${apiBaseUrl}/traffic/collect`;

  if (sendWithBeacon(endpoint, body, payload)) {
    return;
  }

  sendPayload(payload);
};

const getCurrentPath = (pathname: string | null) => {
  if (typeof window === "undefined") {
    return pathname ?? "/";
  }

  return `${window.location.pathname}${window.location.search}`;
};

const isOperatorPath = (path: string) => {
  return path === "/ops" || path.startsWith("/ops/");
};

const dispatchTrackerEvent = (payload: VisitPayload) => {
  window.dispatchEvent(
    new CustomEvent("annebeala:analytics", {
      detail: payload,
    }),
  );
};

const dispatchTrackerMounted = () => {
  window.dispatchEvent(
    new CustomEvent("annebeala:analytics-mounted", {
      detail: {
        at: new Date().toISOString(),
        endpoint: `${apiBaseUrl}/traffic/collect`,
      },
    }),
  );
};

const makeBasePayload = ({
  visitorId,
  sessionId,
  path,
}: {
  visitorId: string;
  sessionId: string;
  path: string;
}) => {
  const searchParams = new URLSearchParams(window.location.search);

  return {
    visitorId,
    sessionId,
    path,
    url: window.location.href,
    title: document.title,
    referrer: document.referrer || undefined,
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio,
    connectionType: getConnectionType(),
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    utmSource: searchParams.get("utm_source") ?? undefined,
    utmMedium: searchParams.get("utm_medium") ?? undefined,
    utmCampaign: searchParams.get("utm_campaign") ?? undefined,
  };
};

const trackPageView = ({
  path,
  lastTrackedUrl,
}: {
  path: string;
  lastTrackedUrl: {
    current: string | null;
  };
}) => {
  if (isOperatorPath(path) || lastTrackedUrl.current === path) {
    return null;
  }

  lastTrackedUrl.current = path;

  const visitorId = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();
  const startedAt = Date.now();
  let maxScrollDepth = getScrollDepth();
  let engagementSent = false;
  const basePayload = makeBasePayload({ visitorId, sessionId, path });
  const pageViewPayload: VisitPayload = {
    event: "page_view",
    ...basePayload,
  };

  dispatchTrackerEvent(pageViewPayload);
  sendPayload(pageViewPayload);

  const updateScrollDepth = () => {
    maxScrollDepth = Math.max(maxScrollDepth, getScrollDepth());
  };

  const sendEngagement = () => {
    if (engagementSent) {
      return;
    }

    engagementSent = true;
    updateScrollDepth();

    const engagementPayload: VisitPayload = {
      event: "engagement",
      ...basePayload,
      durationMs: Math.max(0, Date.now() - startedAt),
      maxScrollDepth,
    };

    dispatchTrackerEvent(engagementPayload);
    sendPayloadOnExit(engagementPayload);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      sendEngagement();
    }
  };

  window.addEventListener("scroll", updateScrollDepth, { passive: true });
  window.addEventListener("pagehide", sendEngagement);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    sendEngagement();
    window.removeEventListener("scroll", updateScrollDepth);
    window.removeEventListener("pagehide", sendEngagement);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
};

export default function VisitTracker() {
  const pathname = usePathname();
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!apiBaseUrl || typeof window === "undefined") {
      return;
    }

    dispatchTrackerMounted();
    const cleanupCurrentPage = trackPageView({
      path: getCurrentPath(pathname),
      lastTrackedUrl,
    });

    return () => {
      cleanupCurrentPage?.();
    };
  }, [pathname]);

  return null;
}
