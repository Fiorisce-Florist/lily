"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { identifyUser, initAnalytics, registerAnalyticsProperties, trackEvent } from "@/lib/analytics";
import { useSession } from "@/lib/auth-client";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const identifiedUserId = React.useRef<string | null>(null);

  React.useEffect(() => {
    initAnalytics();
  }, []);

  React.useEffect(() => {
    if (isPending) return;

    if (session?.user?.id && identifiedUserId.current !== session.user.id) {
      identifiedUserId.current = session.user.id;
      identifyUser(session.user.id, {
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone,
        role: session.user.role,
      });
      return;
    }

    if (!session?.user?.id) {
      identifiedUserId.current = null;
      registerAnalyticsProperties({ is_logged_in: false });
    }
  }, [isPending, session?.user]);

  React.useEffect(() => {
    const queryString = searchParams.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    trackEvent("page_viewed", {
      path: pathname,
      url,
      referrer: document.referrer || undefined,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
