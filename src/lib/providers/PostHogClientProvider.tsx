// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

import { cookieConsentGiven } from "@/components/cookie-banner/cookie-banner";
export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      persistence:
        cookieConsentGiven() === "yes" ? "localStorage+cookie" : "memory",
    });
  }, []);
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
