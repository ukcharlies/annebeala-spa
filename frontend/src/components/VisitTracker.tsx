"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
const visitorKey = "annebeala.analytics.visitor";
const sessionKey = "annebeala.analytics.session";
const sessionStartedKey = "annebeala.analytics.sessionStarted";
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

const sendPayload = (payload: VisitPayload) => {
  if (!apiBaseUrl) {
    return;
  }

  const body = JSON.stringify(payload);
  const endpoint = `${apiBaseUrl}/analytics/visit`;

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(endpoint, blob)) {
      return;
    }
  }

  void fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics must never interrupt the user experience.
  });
};

export default function VisitTracker() {
  const pathname = usePathname();
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!apiBaseUrl || typeof window === "undefined" || pathname.startsWith("/ops")) {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const url = `${window.location.pathname}${window.location.search}`;
    if (lastTrackedUrl.current === url) {
      return;
    }
    lastTrackedUrl.current = url;

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const startedAt = Date.now();
    let maxScrollDepth = getScrollDepth();
    let engagementSent = false;

    const basePayload = {
      visitorId,
      sessionId,
      path: url,
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

    sendPayload({
      event: "page_view",
      ...basePayload,
    });

    const updateScrollDepth = () => {
      maxScrollDepth = Math.max(maxScrollDepth, getScrollDepth());
    };

    const sendEngagement = () => {
      if (engagementSent) {
        return;
      }

      engagementSent = true;
      updateScrollDepth();
      sendPayload({
        event: "engagement",
        ...basePayload,
        durationMs: Math.max(0, Date.now() - startedAt),
        maxScrollDepth,
      });
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
  }, [pathname]);

  return null;
}
