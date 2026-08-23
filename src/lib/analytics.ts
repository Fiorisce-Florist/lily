"use client";

import mixpanel from "mixpanel-browser";

type AnalyticsProperties = Record<string, unknown>;

const MIXPANEL_TOKEN =
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "edafba7c24db460ea89740489095eaea";

let isInitialized = false;

function cleanProperties(properties: AnalyticsProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined && value !== null)
  );
}

export function initAnalytics() {
  if (typeof window === "undefined" || isInitialized || !MIXPANEL_TOKEN) return;

  mixpanel.init(MIXPANEL_TOKEN, {
    api_host: "https://api-js.mixpanel.com",
    debug: process.env.NODE_ENV === "development",
    track_pageview: "full-url",
    autocapture: {
      click: true,
      input: false,
      pageview: "full-url",
      rage_click: true,
      dead_click: true,
      scroll: true,
      submit: true,
      capture_text_content: false,
    },
    batch_requests: false,
    persistence: "localStorage",
  });

  mixpanel.register({
    platform: "web",
    app_name: "fiorisce",
    app_environment: process.env.NODE_ENV,
  });

  isInitialized = true;
}

export function trackEvent(eventName: string, properties?: AnalyticsProperties) {
  if (typeof window === "undefined") return;
  initAnalytics();
  if (!isInitialized) return;

  mixpanel.track(eventName, cleanProperties(properties));
}

export function identifyUser(
  userId: string,
  profile?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    role?: string | null;
  }
) {
  if (typeof window === "undefined") return;
  initAnalytics();
  if (!isInitialized) return;

  mixpanel.identify(userId);
  mixpanel.people.set(
    cleanProperties({
      $name: profile?.name,
      $email: profile?.email,
      phone: profile?.phone,
      role: profile?.role,
    })
  );
  mixpanel.register(
    cleanProperties({
      user_role: profile?.role,
      is_logged_in: true,
    })
  );
}

export function registerAnalyticsProperties(properties: AnalyticsProperties) {
  if (typeof window === "undefined") return;
  initAnalytics();
  if (!isInitialized) return;

  mixpanel.register(cleanProperties(properties));
}

export function resetAnalytics() {
  if (typeof window === "undefined") return;
  initAnalytics();
  if (!isInitialized) return;

  mixpanel.reset();
}
