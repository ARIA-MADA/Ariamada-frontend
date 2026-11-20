import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, ArrowLeft, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { PageTitle, PageShell } from "@/components/layout/PageShell";
import { Eyebrow, Reveal, Section } from "@/components/ui";
import type { TranslationKey } from "@/i18n/fr";
import { translateTexts } from "@/lib/api";

const SERVICES = [
  {
    id: "developpement",
    quoteService: "dev",
    tone: "orange" as const,
    titleKey: "service.dev.title" as const,
    descKey: "service.dev.description" as const,
    image: "/images/qualite.jpg",
    features: ["service.dev.1", "service.dev.2", "service.dev.3", "service.dev.4"] as TranslationKey[],
    details: {
      introduction: "Nous créons des solutions digitales performantes qui allient esthétique, fonctionnalité et expérience utilisateur. Chaque projet est conçu pour répondre spécifiquement à vos besoins métier tout en garantissant une performance optimale sur tous les appareils.",
      process: [["Analyse & Stratégie", "Compréhension approfondie de vos besoins et objectifs"], ["Design UX/UI", "Création d'interfaces intuitives et engageantes"], ["Développement", "Codage avec les technologies les plus récentes"], ["Tests & Optimisation", "Assurance qualité et performances"], ["Déploiement", "Mise en ligne et configuration"], ["Maintenance", "Support continu et évolutions"]].map(([title, description]) => ({ title, description })),
      technologies: ["React", "Next.js", "Node.js", "TypeScript", "React Native", "MongoDB", "AWS", "Docker"],
      benefits: ["Temps de chargement ultra-rapide", "Design responsive optimisé", "SEO intégré dès la conception", "Sécurité renforcée", "Évolutivité garantie", "Support technique 24/7"],
      examples: [["Portail entreprise", "Solution complète avec gestion des employés"], ["E-commerce premium", "Plateforme avec paiement sécurisé"], ["Application mobile", "App iOS et Android synchronisée"]].map(([title, description]) => ({ title, description })),
    },
  },
  {
    id: "branding",
    quoteService: "branding",
    tone: "blue" as const,
    titleKey: "service.branding.title" as const,
    descKey: "service.branding.description" as const,
    image: "/images/branding.webp",
    features: ["service.branding.1", "service.branding.2", "service.branding.3", "service.branding.4"] as TranslationKey[],
    details: {
      introduction: "Nous donnons vie à votre identité de marque à travers des designs distinctifs et cohérents. Notre approche créative associe stratégie marketing et design pour renforcer votre positionnement auprès de votre audience.",
      process: [["Audit de Marque", "Analyse de votre positionnement actuel"], ["Direction Artistique", "Définition de l'univers visuel"], ["Création Logo", "Design d'un symbole mémorable"], ["Charte Graphique", "Développement de l'identité complète"], ["Applications", "Adaptation sur tous supports"], ["Guide d'Utilisation", "Manuel pour une utilisation cohérente"]].map(([title, description]) => ({ title, description })),
      technologies: ["Adobe Creative Suite", "Figma", "Blender 3D", "After Effects", "Procreate", "Sketch"],
      benefits: ["Identité unique et mémorable", "Cohérence sur tous supports", "Adaptation à tous formats", "Évolution dans le temps", "Impact visuel immédiat", "Renforcement de la notoriété"],
      examples: [["Rebranding", "Rafraîchissement complet d'identité"], ["Identité Startup", "Création de A à Z pour lancement"], ["Packaging", "Design de produits physiques"]].map(([title, description]) => ({ title, description })),
    },
  },
  {
    id: "marketing",
    quoteService: "marketing",
    tone: "yellow" as const,
    titleKey: "service.marketing.title" as const,
    descKey: "service.marketing.description" as const,
    image: "/images/Media.jpg",
    features: ["service.marketing.1", "service.marketing.2", "service.marketing.3", "service.marketing.4"] as TranslationKey[],
    details: {
      introduction: "Nous développons et exécutons des stratégies digitales qui génèrent des résultats mesurables. De la création de contenu engageant à l'optimisation des campagnes publicitaires, nous maximisons votre ROI digital.",
      process: [["Audit Digital", "Analyse complète de votre présence en ligne"], ["Stratégie Contenu", "Planification éditoriale adaptée"], ["Création de Contenu", "Production de contenus engageants"], ["Gestion Réseaux", "Animation et communauté"], ["Campagnes Pub", "Publicités ciblées et optimisées"], ["Analyse & Reporting", "Suivi des performances et ajustements"]].map(([title, description]) => ({ title, description })),
      technologies: ["Google Ads", "Meta Business", "LinkedIn Ads", "SEMrush", "HubSpot", "Mailchimp", "Hootsuite"],
      benefits: ["Visibilité accrue", "Lead generation qualifiée", "ROI mesurable", "Communauté engagée", "Contenu viral optimisé", "Croissance organique"],
      examples: [["Campagne LinkedIn", "Génération de leads B2B qualifiés"], ["Stratégie Instagram", "Développement de communauté"], ["Email Marketing", "Automation et personnalisation"]].map(([title, description]) => ({ title, description })),
    },
  },
  {
    id: "ia",
    quoteService: "ia",
    tone: "orange" as const,
    titleKey: "service.ia.title" as const,
    descKey: "service.ia.description" as const,
    image: "/images/Automation.jpeg",
    features: ["service.ia.1", "service.ia.2", "service.ia.3"] as TranslationKey[],
    details: {
      introduction: "Nous concevons et implémentons des solutions d'intelligence artificielle et d'automatisation qui transforment vos processus métier. De la simple automatisation à l'IA générative avancée, nous optimisons votre productivité.",
      process: [["Diagnostic Processus", "Identification des points d'optimisation"], ["Conception Solution", "Architecture technique de la solution"], ["Développement IA", "Intégration des modèles d'IA"], ["Automatisation", "Création des workflows automatisés"], ["Formation Équipe", "Accompagnement à l'adoption"], ["Optimisation Continue", "Amélioration basée sur les données"]].map(([title, description]) => ({ title, description })),
      technologies: ["Python", "TensorFlow", "OpenAI API", "RPA", "Power Automate", "Zapier", "Azure AI", "API sur mesure"],
      benefits: ["Réduction des coûts opérationnels", "Élimination des erreurs humaines", "Gains de productivité 24/7", "Décisions data-driven", "Scalabilité automatique", "Innovation continue"],
      examples: [["Chatbot Support", "Assistance client automatisée 24/7"], ["Automatisation RH", "Gestion des processus recrutement"], ["Dashboard IA", "Tableaux de bord prédictifs"]].map(([title, description]) => ({ title, description })),
    },
  },
];

const SERVICE_DETAIL_TEXT = SERVICES.flatMap((service) => [
  service.details.introduction,
  ...service.details.process.flatMap((step) => [step.title, step.description]),
  ...service.details.technologies,
  ...service.details.benefits,
  ...service.details.examples.flatMap((example) => [example.title, example.description]),
]);

export default function Solutions() {
  const { t, locale } = useI18n();
  const [params] = useSearchParams();
  const [translatedDetails, setTranslatedDetails] = useState<string[] | null>(null);

  useEffect(() => {
    if (locale !== "en") {
      setTranslatedDetails(null);
      return;
    }
    let active = true;
    void translateTexts(SERVICE_DETAIL_TEXT, "en").then((texts) => {
      if (active) setTranslatedDetails(texts);
    }).catch(() => {
      if (active) setTranslatedDetails(null);
    });
    return () => { active = false; };
  }, [locale]);

  /* Scroll vers l'ancrage (#developpement etc.) */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [params]);

  return (
    <PageShell>
      <PageTitle>{`${t("solutions.title")} — ARIA`}</PageTitle>

      {/* Header de page */}
      <section className="section-wash-blue border-b border-line pb-14 pt-28 md:pb-16 md:pt-32">
        <div className="container-site">
          <div className="animate-rise max-w-3xl">
            <Eyebrow>{t("section.eyebrow.solutions")}</Eyebrow>
            <h1 className="title-page">{t("solutions.title")}</h1>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("solutions.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Liste des solutions */}
      <Section>
        <div className="space-y-6">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 70}>
              <article id={s.id} className="group scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-card transition-colors hover:border-blue/35">
                <div className="grid md:grid-cols-2">
                  <div className={`relative aspect-[16/9] overflow-hidden bg-navy md:aspect-auto md:min-h-80 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                    <img
                      src={s.image}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-blue">
                      {String(i + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
                    </span>
                    <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {t(s.titleKey)}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {t(s.descKey)}
                    </p>
                    <ul className="mt-6 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
                          <span className="mt-2 size-1 shrink-0 rounded-full bg-blue" aria-hidden />
                          {t(f)}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                      <Link to={`/devis?service=${s.quoteService}`} className="btn-primary">
                        {t("common.requestAInfo")}
                        <ArrowUpRight className="size-4" aria-hidden />
                      </Link>
                      <Link
                        to="/realisations"
                        className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {t("realisations.viewAll")}
                      </Link>
                    </div>
                  </div>
                </div>
                <details className="group border-t border-line/70 bg-background/80 px-6 py-4 md:px-8">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-sm font-semibold text-foreground marker:hidden">
                    {t("service.details.more")}
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  {(() => {
                    const detail = s.details;
                    const translate = (value: string) => {
                      const index = SERVICE_DETAIL_TEXT.indexOf(value);
                      return locale === "en" ? translatedDetails?.[index] ?? value : value;
                    };
                    return <div className="mt-5 grid gap-6 lg:grid-cols-2">
                      <div className="space-y-5">
                        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{translate(detail.introduction)}</p>
                        <div>
                          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-foreground">{t("service.details.process")}</h3>
                          <ol className="grid gap-3 sm:grid-cols-2">
                            {detail.process.map((step, index) => <li key={step.title} className="flex gap-3 text-sm">
                              <span className="font-mono text-xs text-blue">{String(index + 1).padStart(2, "0")}</span>
                              <span><strong className="block text-foreground">{translate(step.title)}</strong><span className="text-muted-foreground">{translate(step.description)}</span></span>
                            </li>)}
                          </ol>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <div><h3 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground">{t("service.details.tools")}</h3><div className="flex flex-wrap gap-2">{detail.technologies.map((item) => <span key={item} className="rounded-full border border-line bg-background/80 px-3 py-1 text-xs text-muted-foreground">{translate(item)}</span>)}</div></div>
                        <div><h3 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground">{t("service.details.benefits")}</h3><ul className="grid gap-2 sm:grid-cols-2">{detail.benefits.map((item) => <li key={item} className="flex gap-2 text-sm text-muted-foreground"><span className="text-blue">✓</span>{translate(item)}</li>)}</ul></div>
                        <div><h3 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground">{t("service.details.examples")}</h3><ul className="grid gap-2 sm:grid-cols-3">{detail.examples.map((item) => <li key={item.title} className="rounded-xl bg-muted/60 p-3 text-sm"><strong className="block text-foreground">{translate(item.title)}</strong><span className="text-muted-foreground">{translate(item.description)}</span></li>)}</ul></div>
                      </div>
                    </div>;
                  })()}
                </details>
              </article>
            </Reveal>
          ))}
        </div>

        {/* CTA bas de page */}
        <Reveal>
          <div className="on-dark mt-10 rounded-2xl border border-line bg-navy p-8 text-center sm:p-10">
            <h2 className="title-section text-![clamp(1.5rem,3vw,2rem)] text-white">
              {t("common.ctaTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/65">{t("common.ctaText")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/devis" className="btn-primary">
                {t("common.requestAInfo")}
              </Link>
              <Link to="/" className="btn-outline border-white/25! bg-white/[0.06]! text-white! hover:!border-white/50">
                <ArrowLeft className="size-4" aria-hidden />
                {t("common.backHome")}
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
