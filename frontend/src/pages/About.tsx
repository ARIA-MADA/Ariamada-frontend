import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n";
import { PageTitle, PageShell } from "@/components/layout/PageShell";
import { Eyebrow, Reveal, Section, SectionHeading } from "@/components/ui";

const VALUES = [
  "about.value1",
  "about.value2",
  "about.value3",
  "about.value4",
  "about.value5",
  "about.value6",
] as const;

export default function About() {
  const { t } = useI18n();

  return (
    <PageShell>
      <PageTitle>{`${t("about.title")} — ARIA`}</PageTitle>

      {/* Header */}
      <section className="section-wash-blue border-b border-line pb-14 pt-28 md:pb-16 md:pt-32">
        <div className="container-site">
          <div className="animate-rise max-w-3xl">
            <Eyebrow>{t("nav.about")}</Eyebrow>
            <h1 className="title-page">{t("about.title")}</h1>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <Section>
        <div className="grid overflow-hidden rounded-2xl border border-line bg-card md:grid-cols-2">
          {[
            { key: "about.mission" as const, text: "about.missionText" as const, tone: "orange" as const },
            { key: "about.vision" as const, text: "about.visionText" as const, tone: "blue" as const },
          ].map((b, i) => (
            <Reveal key={b.key} delay={i * 90}>
              <article className={`h-full p-6 sm:p-8 lg:p-10 ${i === 0 ? "border-b border-line md:border-b-0 md:border-r" : ""}`}>
                <p className={`font-mono text-xs uppercase tracking-[0.18em] ${b.tone === "orange" ? "text-blue" : "text-mint"}`}>
                  0{i + 1}
                </p>
                <h2 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {t(b.key)}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t(b.text)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Équipe */}
      <Section wash="mint">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={t("nav.about")}
              title={t("about.team")}
              intro={t("about.teamText")}
            />
            <Link to="/contact" className="btn-primary">
              {t("common.talkToUs")}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>

          <Reveal>
            {/* Photo de l'équipe */}
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line"
            >
              <img
                src="/images/equipe2.png"
                alt={t("hero.imageAlt")}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col p-7 sm:p-9">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">{t("about.teamLocation")}</p>
                <p className="mt-3 max-w-sm font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">{t("about.teamStatement")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Valeurs */}
      <Section>
        <SectionHeading
          eyebrow={t("nav.about")}
          title={t("about.values")}
        />
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v} delay={i * 60}>
              <div className="group flex items-baseline gap-5 border-t border-line py-5">
                <span className="font-mono text-xs tracking-[0.16em] text-muted-foreground/65">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-blue sm:text-xl">
                  {t(v)}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section wash="blue">
        <Reveal>
          <div className="on-dark relative overflow-hidden rounded-2xl bg-navy px-6 py-14 text-center shadow-elevate sm:px-12">
            <span className="absolute inset-x-0 top-0 h-1 bg-blue" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="title-section text-white">{t("common.ctaTitle")}</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-white/65">{t("common.ctaText")}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/devis" className="btn-primary">
                  {t("common.requestAInfo")}
                </Link>
                <Link to="/contact" className="btn-outline border-white/25! bg-white/[0.06]! text-white!">
                  {t("common.talkToUs")}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  );
}
