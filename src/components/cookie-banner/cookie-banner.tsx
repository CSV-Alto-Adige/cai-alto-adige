// app/banner.js
"use client";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

export function cookieConsentGiven() {
  if (!localStorage.getItem("cookie_consent")) {
    return "undecided";
  }
  return localStorage.getItem("cookie_consent") || "undecided";
}

export default function CookieBanner() {
  const [consentGiven, setConsentGiven] = useState("");
  const posthog = usePostHog();

  useEffect(() => {
    // We want this to only run once the client loads
    // or else it causes a hydration error
    setConsentGiven(cookieConsentGiven());
  }, []);

  useEffect(() => {
    if (consentGiven !== "") {
      posthog.set_config({
        persistence: consentGiven === "yes" ? "localStorage+cookie" : "memory",
      });
    }
  }, [consentGiven]);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookie_consent", "yes");
    setConsentGiven("yes");
  };

  const handleDeclineCookies = () => {
    localStorage.setItem("cookie_consent", "no");
    setConsentGiven("no");
  };

  return (
    <div>
      {consentGiven === "undecided" && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6">
          <div className="pointer-events-auto mx-auto max-w-xl rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/10">
            <p className="text-sm/6 text-gray-900">
              Questo sito utilizza i cookie per garantire la migliore esperienza
              di navigazione.{" "}
              <Link
                href="https://www.cai.it/privacy-policy/"
                className="font-semibold text-[#0e4d71]"
              >
                Consulta la nostra cookie policy
              </Link>
              .
            </p>
            <div className="mt-4 flex items-center gap-x-5">
              <button
                type="button"
                className="rounded-md bg-[#0e4d71] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                onClick={handleAcceptCookies}
              >
                Accetta tutto
              </button>
              <button
                type="button"
                className="text-sm/6 font-semibold text-gray-900"
                onClick={handleDeclineCookies}
              >
                Rifuta tutto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
