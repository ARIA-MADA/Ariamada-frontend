import { useEffect, useState } from "react";
import { syncAnalyticsConsent } from "@/lib/analytics";
import { useI18n } from "@/i18n";

const CONSENT_KEY = "aria-cookie-consent";
const OPEN_SETTINGS_EVENT = "aria:open-cookie-settings";

type Consent = "accepted" | "rejected";

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export default function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      const initialConsent = stored === "accepted" || stored === "rejected" ? stored : null;
      setConsent(initialConsent);
      setVisible(initialConsent === null);
    } catch {
      setVisible(true);
    }

    const open = () => setVisible(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    syncAnalyticsConsent(consent);
  }, [consent]);

  function choose(consent: Consent) {
    try {
      window.localStorage.setItem(CONSENT_KEY, consent);
    } catch {
      // The choice still applies for this page view when storage is unavailable.
    }
    setConsent(consent);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label={t("cookieConsent.label")}
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-5xl rounded-2xl border border-line bg-card p-4 shadow-2xl sm:inset-x-6 sm:bottom-4"
      role="dialog"
      aria-modal="false"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="font-heading text-sm font-bold text-foreground">{t("cookieConsent.title")}</h2>
          <p id="cookie-consent-description" className="text-sm leading-snug text-muted-foreground">
            {t("cookieConsent.description")}
          </p>
        </div>
        <div className="flex shrink-0 justify-end gap-2">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            {t("cookieConsent.reject")}
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-lg bg-blue px-3 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            {t("cookieConsent.accept")}
          </button>
        </div>
      </div>
    </aside>
  );
}
