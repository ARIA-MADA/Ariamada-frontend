const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
const GA_SCRIPT_ID = "aria-google-analytics";
const CONSENT_KEY = "aria-cookie-consent";
let sessionConsent: "accepted" | "rejected" | null = null;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function isAccepted() {
  if (sessionConsent !== null) return sessionConsent === "accepted";
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

function removeAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name === "_ga" || name === "_gid" || name === "_gat" || name.startsWith("_ga_"));
  const domains = [window.location.hostname, `.${window.location.hostname}`];

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
    }
  }
}

export function syncAnalyticsConsent(consent: "accepted" | "rejected" | null) {
  sessionConsent = consent;
  if (!MEASUREMENT_ID) return;

  const disabled = window as unknown as Record<string, boolean>;
  disabled[`ga-disable-${MEASUREMENT_ID}`] = consent !== "accepted";

  if (consent !== "accepted") {
    removeAnalyticsCookies();
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  }

  trackPageView();
}

export function trackPageView() {
  if (!MEASUREMENT_ID || !isAccepted() || !window.gtag) return;

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
  });
}
