import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ExternalLink,
  Quote,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { useTheme } from "@/lib/theme";
import { PageTitle } from "@/components/layout/PageShell";
import { projectsApi, translateProjectPreviewsContent } from "@/lib/api";
import { SHOWCASE_PROJECTS, type ProjectPreview } from "@/data/showcaseProjects";
import Hero from "@/components/home/Hero";
import {
  Card,
  Counter,
  Eyebrow,
  ProjectImage,
  Marquee,
  Reveal,
  Section,
  SectionHeading,
} from "@/components/ui";

/* ------------------------------------------------------------
   Données statiques de la home
   ------------------------------------------------------------ */
const WHY_ITEMS = [
  { n: 1 },
  { n: 2 },
  { n: 3 },
  { n: 4 },
  { n: 5 },
  { n: 6 },
] as const;

const SERVICES = [
  { id: "developpement", tone: "orange" as const, titleKey: "service.dev.title" as const, descKey: "service.dev.description" as const, features: ["service.dev.1", "service.dev.2", "service.dev.3", "service.dev.4"] as const },
  { id: "branding", tone: "blue" as const, titleKey: "service.branding.title" as const, descKey: "service.branding.description" as const, features: ["service.branding.1", "service.branding.2", "service.branding.3", "service.branding.4"] as const },
  { id: "marketing", tone: "yellow" as const, titleKey: "service.marketing.title" as const, descKey: "service.marketing.description" as const, features: ["service.marketing.1", "service.marketing.2", "service.marketing.3", "service.marketing.4"] as const },
  { id: "ia", tone: "orange" as const, titleKey: "service.ia.title" as const, descKey: "service.ia.description" as const, features: ["service.ia.1", "service.ia.2", "service.ia.3"] as const },
];

const PROCESS = [
  { step: "01", titleKey: "process.step1.title" as const, textKey: "process.step1.text" as const },
  { step: "02", titleKey: "process.step2.title" as const, textKey: "process.step2.text" as const },
  { step: "03", titleKey: "process.step3.title" as const, textKey: "process.step3.text" as const },
  { step: "04", titleKey: "process.step4.title" as const, textKey: "process.step4.text" as const },
  { step: "05", titleKey: "process.step5.title" as const, textKey: "process.step5.text" as const },
];

const STATS = [
  { value: 50, prefix: "+", suffix: "", labelKey: "stats.projects" as const },
  { value: 25, prefix: "", suffix: "", labelKey: "stats.talents" as const },
  { value: 70, prefix: "+", suffix: "", labelKey: "stats.clients" as const },
  { value: 24, prefix: "", suffix: "/7", labelKey: "stats.support" as const },
];

const TESTIMONIALS = [
  { quoteKey: "testimonials.quote1" as const, roleKey: "testimonials.role1" as const, tone: "orange" as const },
  { quoteKey: "testimonials.quote2" as const, roleKey: "testimonials.role2" as const, tone: "blue" as const },
  { quoteKey: "testimonials.quote3" as const, roleKey: "testimonials.role3" as const, tone: "yellow" as const },
];

const PARTNERS = [
  {
    name: "Hôtel Royal Palace",
    logo: "/partners/royal-palace.jpg",
  },
  {
    name: "STAR Madagascar",
    logo: "/partners/star.svg",
  },
  {
    name: "Vision Laser",
    logo: "/partners/vision-laser.jpeg",
  },
  {
    name: "HDA Hôtel",
    logo: "/partners/hda-hotel.png",
    invertInLight: true,
  },
  {
    name: "KOLO TV",
    logo: "/partners/kolo-tv.jpg",
  },
  {
    name: "Soatrans Plus",
    logo: "/partners/soatrans-plus.png",
    recolorInLight: true,
  },
  {
    name: "Les Casaniers",
    logo: "/partners/les-casaniers.jpg",
    invertInLight: true,
  },
  {
    name: "Only Cloz",
    logo: "/partners/cloz.jpeg",
  },
  {
    name: "Coloc'KOO",
    logo: "/partners/coloc.jpeg",
  },
  {
    name: "La Colongette",
    logo: "/partners/colongete.jpeg",
    lightLogo: "/partners/colongete-light.png",
    darkLogo: "/partners/colongete-dark.png",
    largeLogo: true,
  },
  {
    name: "FAUNE Project",
    logo: "/partners/faune.jpeg",
  },
  {
    name: "Hénault Escaliers",
    logo: "/partners/heanault.jpeg",
  },
  {
    name: "Marina Beach",
    logo: "/partners/marina.jpeg",
  },
  {
    name: "Le Vezo Beach",
    logo: "/partners/vezo.jpeg",
  },
] as const;

function shufflePartners<T extends { name: string }>(partners: readonly T[]) {
  const shuffled = [...partners];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickRandomProjects(
  projects: ProjectPreview[],
  previous: ProjectPreview[] = [],
) {
  const shuffled = [...projects];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, 3);
  if (
    projects.length > 3 &&
    selected.length === previous.length &&
    selected.every((project) => previous.some((item) => item.id === project.id))
  ) {
    const selectedIds = new Set(selected.map((project) => project.id));
    const alternatives = projects.filter((project) => !selectedIds.has(project.id));
    const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];
    const index = Math.floor(Math.random() * selected.length);
    selected[index] = replacement;
  }

  return selected;
}

/* ============================================================
   PAGE D'ACCUEIL
   ============================================================ */
export default function Home() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const [viewportWidth, setViewportWidth] = useState(
    () => (typeof window === "undefined" ? 1280 : window.innerWidth),
  );

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", updateViewportWidth, { passive: true });
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  const shuffledPartners = useMemo(() => {
    return shufflePartners(PARTNERS);
  }, []);
  const partnersInMarquee = useMemo(() => {
    const itemSpacing = viewportWidth < 640 ? 168 : 188;
    const logosPerScreen = Math.ceil((viewportWidth + 240) / itemSpacing);
    const row = [...shuffledPartners];

    while (row.length < logosPerScreen) {
      const previous = row[row.length - 1];
      const first = row[0];
      const candidates = PARTNERS.filter(
        (partner) =>
          partner.name !== previous?.name &&
          (row.length < logosPerScreen - 1 || partner.name !== first?.name),
      );
      const next = candidates[Math.floor(Math.random() * candidates.length)];
      if (next) row.push(next);
    }

    return row;
  }, [shuffledPartners, viewportWidth]);

  return (
    <>
      <PageTitle>
        ARIA — Agence digitale à Madagascar | Développement, Design, Marketing & IA
      </PageTitle>

      {/* (a) HERO — réf. Optiline Mada */}
      <Hero />

      {/* (b) RÉALISATIONS */}
      <Section id="realisations" wash="blue">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t("section.eyebrow.realisations")}
            title={t("realisations.title")}
            intro={t("realisations.description")}
            className="mb-0"
          />
          <Link to="/realisations" className="btn-outline shrink-0">
            {t("realisations.viewAll")}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <RealisationsPreview />
      </Section>

      {/* (c) POURQUOI ARIA */}
      <Section id="pourquoi">
        <SectionHeading
          eyebrow={t("section.eyebrow.why")}
          title={t("why.title")}
          intro={t("why.description")}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_ITEMS.map((item, i) => (
            <Reveal key={item.n} delay={i * 70}>
              <Card tone={i % 3 === 1 ? "blue" : i % 3 === 2 ? "yellow" : "orange"} className="h-full">
                <span className="font-mono text-xs tracking-[0.18em] text-blue">0{item.n}</span>
                <h3 className="title-card mt-4">
                  {t(`why.${item.n}.title` as "why.1.title")}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {t(`why.${item.n}.text` as "why.1.text")}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* (c) SOLUTIONS */}
      <Section id="solutions" wash="blue">
        <Eyebrow>{t("section.eyebrow.solutions")}</Eyebrow>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            title={t("solutions.title")}
            intro={t("solutions.description")}
            className="mb-0"
          />
          <Link to="/solutions" className="btn-outline shrink-0">
            {t("solutions.discover")}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 80}>
              <Card tone={s.tone} className="group flex h-full flex-col">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  0{String(i + 1)}
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-foreground">
                  {t(s.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(s.descKey)}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-blue" aria-hidden />
                      {t(f)}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/solutions#${s.id}`}
                  className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-blue transition-colors hover:text-[#fb923c]"
                >
                  {t("solutions.discover")}
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* (d) PROCESS */}
      <Section id="process">
        <SectionHeading
          eyebrow={t("section.eyebrow.process")}
          title={t("process.title")}
          intro={t("process.description")}
        />
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={i * 80}>
              <li className="h-full rounded-xl border border-line bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue/40 hover:shadow-elevate">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-blue">
                  {p.step}
                </span>
                <h3 className="title-card mt-3">{t(p.titleKey)}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {t(p.textKey)}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* (e) STATS */}
      <Section wash="mint">
        <SectionHeading eyebrow={t("section.eyebrow.stats")} title={t("stats.title")} align="center" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.labelKey} delay={i * 90}>
              <div className="rounded-xl border border-line bg-card px-4 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue/40 hover:shadow-elevate">
                <p className="font-heading text-4xl font-extrabold tracking-tight text-blue sm:text-5xl">
                  <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {t(s.labelKey)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* (f) PARTENAIRES */}
      <Section className="!py-8 md:!py-10">
        <SectionHeading title={t("partners.title")} align="center" className="mb-4" />
        <Marquee speed="medium">
          {partnersInMarquee.map((partner, partnerIndex) => {
            return (
              <div
                key={`${partner.name}-${partnerIndex}`}
                className="group/partner flex h-[68px] w-40 shrink-0 items-center justify-center rounded-xl border border-line bg-card px-4 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-blue/40 hover:shadow-elevate sm:h-20 sm:w-44 sm:px-5"
              >
                <img
                  src={
                    theme === "light" && "lightLogo" in partner
                      ? partner.lightLogo
                      : theme === "dark" && "darkLogo" in partner
                        ? partner.darkLogo
                      : partner.logo
                  }
                  alt={partner.name}
                  loading="lazy"
                  decoding="async"
                  className={`${"largeLogo" in partner && partner.largeLogo ? "max-h-12 sm:max-h-14" : "max-h-10 sm:max-h-12"} max-w-full object-contain transition-transform duration-300 group-hover/partner:scale-105 ${
                    "invertInLight" in partner && partner.invertInLight
                      ? "partner-logo-invert-light"
                      : ""
                  } ${
                    "recolorInLight" in partner && partner.recolorInLight
                      ? "partner-logo-recolor-light"
                      : ""
                  }`}
                />
              </div>
            );
          })}
        </Marquee>
      </Section>

      {/* (g) TÉMOIGNAGES */}
      <Section wash="warm">
        <SectionHeading
          eyebrow={t("section.eyebrow.testimonials")}
          title={t("testimonials.title")}
          intro={t("testimonials.description")}
          align="center"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((tm, i) => (
            <Reveal key={i} delay={i * 90}>
              <figure className="card-glass relative flex h-full flex-col overflow-hidden p-6 sm:p-7">
                <Quote className="size-8 text-blue" aria-hidden />
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-foreground/85">
                  « {t(tm.quoteKey)} »
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-full border text-sm font-bold ${
                    tm.tone === "blue"
                      ? "border-mint/30 bg-mint/10 text-mint"
                      : tm.tone === "yellow"
                        ? "border-coral/30 bg-coral/10 text-coral"
                        : "border-blue/30 bg-blue/10 text-blue"
                  }`} aria-hidden>
                    {t(tm.roleKey).charAt(0)}
                  </span>
                  <span>
                    <span className="block font-heading text-sm font-bold text-foreground">{t("testimonials.author")}</span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t(tm.roleKey)}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* (h) FAQ + CTA final */}
      <Section id="faq" wash="blue">
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <Reveal className="flex flex-col justify-center py-4 lg:py-8">
            <Eyebrow>{t("section.eyebrow.faq")}</Eyebrow>
            <h2 className="title-section">{t("faq.title")}</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("faq.description")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/faq" className="btn-outline">
                {t("faq.viewAll")}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link to="/contact" className="btn-primary">
                {t("faq.contact")}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100} className="h-full">
            <div className="on-dark relative flex h-full min-h-72 flex-col justify-center overflow-hidden rounded-2xl bg-navy px-6 py-10 shadow-elevate sm:px-9">
              {/* Filets colorés en haut (signature Optiline) */}
              <span className="absolute inset-x-0 top-0 h-1 bg-blue" aria-hidden />
              <span
                className="absolute right-0 top-0 h-1 w-1/4 bg-mint"
                aria-hidden
              />
              <span
                className="absolute right-1/3 top-0 h-1 w-1/6 bg-coral"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full blur-[100px]"
                style={{ background: "rgba(249,115,22,0.25)" }}
                aria-hidden
              />

              <div className="relative">
                <Eyebrow className="text-![#fb923c]">{t("section.eyebrow.cta")}</Eyebrow>
                <h2 className="font-heading text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                  {t("common.ctaTitle")}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                  {t("common.ctaText")}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to="/devis" className="btn-primary">
                    {t("common.requestAInfo")}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                  <Link to="/contact" className="btn-outline border-white/25! bg-white/[0.06]! text-white! hover:!border-white/50 hover:!bg-white/[0.12]">
                    {t("common.talkToUs")}
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------
   Aperçu aléatoire des réalisations publiées
   ------------------------------------------------------------ */
function RealisationsPreview() {
  const { t, locale } = useI18n();
  const [projects, setProjects] = useState<ProjectPreview[]>(SHOWCASE_PROJECTS);
  const [selectedProjects, setSelectedProjects] = useState<ProjectPreview[]>(() =>
    pickRandomProjects(SHOWCASE_PROJECTS),
  );
  const [visible, setVisible] = useState<ProjectPreview[]>(selectedProjects);

  useEffect(() => {
    let cancelled = false;

    projectsApi
      .listPublished("fr")
      .then((res) => {
        if (cancelled) return;
        const availableProjects = res.items.length > 0 ? res.items : SHOWCASE_PROJECTS;
        setProjects(availableProjects);
        setSelectedProjects(pickRandomProjects(availableProjects));
      })
      .catch((cause: unknown) => {
        console.error("Erreur lors du chargement des réalisations de la page d'accueil :", cause);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void translateProjectPreviewsContent(selectedProjects, locale).then((translated) => {
      if (!cancelled) setVisible(translated);
    });
    return () => {
      cancelled = true;
    };
  }, [locale, selectedProjects]);

  useEffect(() => {
    if (projects.length <= 3) return;
    const intervalId = window.setInterval(() => {
      setSelectedProjects((current) => pickRandomProjects(projects, current));
    }, 40_000);
    return () => window.clearInterval(intervalId);
  }, [projects]);

  return (
    <>
      {visible.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-blue/45 hover:shadow-elevate">
                <Link to={`/realisations/${p.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-navy">
                  <ProjectImage
                    src={p.image}
                    alt={`${p.title} — aperçu du site`}
                    className="size-full object-contain"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {p.caseStudyServices[0] ?? p.technologies[0] ?? t("realisations.title")}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {p.client ?? String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold leading-snug tracking-tight text-foreground">
                    <Link to={`/realisations/${p.slug}`} className="transition-colors hover:text-blue">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                    <Link
                      to={`/realisations/${p.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-blue"
                    >
                      {t("solutions.discover")}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </Link>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${t("realisations.viewSite")} — ${p.title}`}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {t("realisations.viewSite")}
                        <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
