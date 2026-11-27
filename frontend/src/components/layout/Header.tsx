import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n";
import ThemeToggle from "@/components/layout/ThemeToggle";

interface NavItem {
  to: string;
  labelKey: "nav.home" | "nav.solutions" | "nav.realisations" | "nav.about" | "nav.faq" | "nav.contact";
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", labelKey: "nav.home" },
  { to: "/solutions", labelKey: "nav.solutions" },
  { to: "/realisations", labelKey: "nav.realisations" },
  { to: "/a-propos", labelKey: "nav.about" },
  { to: "/faq", labelKey: "nav.faq" },
  { to: "/contact", labelKey: "nav.contact" },
];

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  /* Séparation plus marquée du header dès que la page défile */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Ferme le menu mobile à chaque navigation */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* Bloque le scroll du body quand le menu est ouvert */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileMenuRef.current) mobileMenuRef.current.inert = !mobileOpen;
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
    <header
      className={`on-dark sticky inset-x-0 top-0 z-50 border-b border-line bg-background transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_16px_40px_-20px_rgba(0,0,0,0.95)]"
          : "shadow-[0_8px_30px_-24px_rgba(0,0,0,0.9)]"
      }`}
    >
      {/* Ligne d'accent : repère visuel fort entre le header et le contenu */}
      <span
        className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue via-coral to-mint"
        aria-hidden
      />
      <div className="container-site grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:h-[5.5rem] xl:grid-cols-[auto_minmax(0,1fr)_auto]">
        {/* Logo */}
        <Link
          to="/"
          aria-label={t("aria.homeLabel")}
          className="group flex min-w-0 items-center gap-2.5"
        >
          <span className="relative size-14 shrink-0 sm:size-20">
            <img
              src="/images/aria-logo.png"
              alt=""
              aria-hidden="true"
              className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden min-w-0 items-center justify-center gap-3 xl:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-5 py-2 text-[15px] font-medium transition-all duration-200 hover:bg-surface-2 ${
                  isActive
                    ? "bg-surface-2 text-blue ring-1 ring-line"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex min-w-0 items-center justify-end gap-2">
          {/* Bascule mode clair / sombre */}
          <ThemeToggle />

          {/* Sélecteur de langue FR / EN */}
          <button
            type="button"
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            aria-label={locale === "fr" ? t("header.switchToEnglish") : t("header.switchToFrench")}
            title={locale === "fr" ? "English" : "Français"}
            aria-pressed={locale === "en"}
            className="group relative inline-flex h-9 w-14 shrink-0 items-center rounded-full border border-line bg-surface-2 p-1 shadow-inner transition-all duration-300 hover:border-blue/50 hover:bg-blue/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="absolute left-[6px] text-[11px] leading-none" aria-hidden="true">
              🇫🇷
            </span>
            <span className="absolute right-[6px] text-[11px] leading-none" aria-hidden="true">
              🇬🇧
            </span>
            <span
              className={`relative z-10 grid size-6 place-items-center rounded-full bg-background text-sm shadow-md ring-1 ring-foreground/10 transition-transform duration-300 ease-out ${
                locale === "fr" ? "translate-x-0" : "translate-x-6"
              }`}
              aria-hidden="true"
            >
              <span key={locale} className="language-flag leading-none">
                {locale === "fr" ? "🇫🇷" : "🇬🇧"}
              </span>
            </span>
          </button>

          <Link to="/devis" className="btn-primary hidden min-h-10! w-48 justify-center px-4 py-2 text-[15px] shadow-elevate transition-all hover:-translate-y-0.5 hover:bg-blue-hover hover:shadow-[0_8px_24px_rgba(249,115,22,0.28)] sm:inline-flex">
            <span className="truncate">{t("nav.cta")}</span>
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>

          {/* Burger mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? t("nav.close") : t("nav.menu")}
            aria-expanded={mobileOpen}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface-1 text-foreground transition-all duration-200 hover:border-blue/50 hover:bg-blue/10 hover:text-blue hover:shadow-[0_0_16px_rgba(249,115,22,0.12)] xl:hidden"
          >
            <span className="relative size-5" aria-hidden="true">
              <Menu
                className={`absolute inset-0 size-5 transition-all duration-300 ease-out motion-reduce:transition-none ${
                  mobileOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <X
                className={`absolute inset-0 size-5 transition-all duration-300 ease-out motion-reduce:transition-none ${
                  mobileOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </header>

      {/* Hors du header : son backdrop-filter crée un contenant pour les éléments fixed. */}
      <div
        ref={mobileMenuRef}
        aria-hidden={!mobileOpen}
        className={`on-dark fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-background/98 backdrop-blur-xl transition-[opacity,transform,visibility] duration-300 ease-out motion-reduce:transition-none sm:top-[5.5rem] xl:hidden ${
          mobileOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0 delay-300"
        }`}
      >
        <nav className="container-site flex flex-col gap-1 py-6">
          {NAV_ITEMS.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              style={{
                transitionDelay: mobileOpen ? `${i * 35}ms` : "0ms",
              }}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-4 font-heading text-lg font-bold transition-all duration-300 ease-out motion-reduce:transition-none ${
                  mobileOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                } ${
                  isActive ? "bg-blue/10 text-blue" : "text-foreground hover:bg-surface-2 hover:text-blue"
                }`
              }
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(item.labelKey)}
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground" aria-hidden />
            </NavLink>
          ))}
          <Link
            to="/devis"
            style={{
              transitionDelay: mobileOpen ? `${NAV_ITEMS.length * 35}ms` : "0ms",
            }}
            className={`btn-primary mt-4 w-full transition-all duration-300 ease-out motion-reduce:transition-none ${
              mobileOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {t("nav.cta")}
          </Link>
        </nav>
      </div>
    </>
  );
}
