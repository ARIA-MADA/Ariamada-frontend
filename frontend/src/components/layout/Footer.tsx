import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import { openCookieSettings } from "@/components/layout/CookieConsent";
import { useTheme } from "@/lib/theme";

/** Coordonnées ARIA (à synchroniser avec backend/.env si besoin) */
export const ARIA_CONTACT = {
  email: "aria.madacom@gmail.com",
  phones: ["+261 32 03 682 18", "+261 34 07 042 09"],
  address: "Madagascar",
  whatsapp: "https://wa.me/+261320368218",
};

const emailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ARIA_CONTACT.email)}`;

const NAVIGATION = [
  { to: "/", labelKey: "nav.home" as const },
  { to: "/solutions", labelKey: "nav.solutions" as const },
  { to: "/realisations", labelKey: "nav.realisations" as const },
  { to: "/a-propos", labelKey: "nav.about" as const },
  { to: "/contact", labelKey: "nav.contact" as const },
];

const SOLUTIONS = [
  { to: "/solutions#developpement", labelKey: "service.dev.title" as const },
  { to: "/solutions#branding", labelKey: "service.branding.title" as const },
  { to: "/solutions#marketing", labelKey: "service.marketing.title" as const },
  { to: "/solutions#ia", labelKey: "service.ia.title" as const },
];

const LEGAL_LINKS = [
  { to: "/mentions-legales", labelKey: "footer.mentions" as const },
  { to: "/confidentialite", labelKey: "footer.privacy" as const },
  { to: "/cgu", labelKey: "footer.terms" as const },
];

export default function Footer() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer
      className="on-dark relative overflow-hidden bg-navy"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 12% 100%, rgba(249,115,22,0.2), transparent 34%), radial-gradient(ellipse at 82% 50%, rgba(249,115,22,0.12), transparent 38%)",
      }}
    >
      <div className="container-site relative border-t border-line pb-6 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.65fr_0.8fr_0.95fr_1fr] lg:gap-x-12">
          <div className="min-w-0">
            <Link to="/" className="group mb-4 flex w-fit items-center gap-4">
              <span className={`relative size-24 shrink-0 ${theme === "light" ? "rounded-2xl bg-[#102b37] p-1.5 shadow-[0_4px_14px_rgba(16,43,55,0.2)]" : ""}`}>
                <img
                  src="/images/aria-logo.png"
                  alt=""
                  aria-hidden="true"
                  className="size-full object-contain transition-transform group-hover:scale-105"
                />
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-2xl font-extrabold leading-tight tracking-tight text-foreground">
                  ARIA
                </span>
                <span className="mt-0.5 block max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-orange-300">
                  {t("footer.brandDescriptor")}
                </span>
              </span>
            </Link>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>

          <nav className="min-w-0" aria-label={t("footer.navigation")}>
            <h2 className="mb-3 font-heading text-base font-semibold text-orange-400">
              {t("footer.navigation")}
            </h2>
            <ul className="space-y-1.5">
              {NAVIGATION.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="text-orange-400" aria-hidden="true">•</span>
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="min-w-0" aria-label={t("footer.services")}>
            <h2 className="mb-3 font-heading text-base font-semibold text-orange-400">
              {t("footer.services")}
            </h2>
            <ul className="space-y-1.5">
              {SOLUTIONS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="text-orange-400" aria-hidden="true">•</span>
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="min-w-0" aria-labelledby="footer-contact-heading">
            <h2
              id="footer-contact-heading"
              className="mb-3 font-heading text-base font-semibold text-orange-400"
            >
              {t("footer.contacts")}
            </h2>
            <dl className="space-y-2.5 text-sm">
              <div>
                <dt className="font-medium text-foreground">{t("contact.email")}</dt>
                <dd>
                  <a
                    href={emailComposeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {ARIA_CONTACT.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">{t("contact.phone")}</dt>
                <dd className="space-y-0.5">
                  {ARIA_CONTACT.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="block whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {phone}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">{t("contact.address")}</dt>
                <dd className="text-muted-foreground">{ARIA_CONTACT.address}</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-line pt-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {year} ARIA — {t("brand.nameDescriptor")}. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a
              href={ARIA_CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-orange-400"
            >
              WhatsApp
            </a>
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-xs text-muted-foreground transition-colors hover:text-orange-400"
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <button
              type="button"
              onClick={openCookieSettings}
              className="text-xs text-muted-foreground transition-colors hover:text-orange-400"
            >
              {t("footer.cookieSettings")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
