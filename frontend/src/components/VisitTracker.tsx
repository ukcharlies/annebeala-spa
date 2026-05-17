"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

type VisitPayload = {
  event: "page_view";
  path: string;
  title: string;
  referrer?: string;
  screen?: string;
  language?: string;
  timezone?: string;
};

export default function VisitTracker() {
  const pathname = usePathname();
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!apiBaseUrl || typeof window === "undefined") {
      return;
    }

    const url = `${window.location.pathname}${window.location.search}`;
    if (lastTrackedUrl.current === url) {
      return;
    }
    lastTrackedUrl.current = url;

    const payload: VisitPayload = {
      event: "page_view",
      path: url,
      title: document.title,
      referrer: document.referrer || undefined,
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

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
  }, [pathname]);

  return null;
}
