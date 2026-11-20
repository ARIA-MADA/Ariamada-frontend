import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useI18n } from "@/i18n";
import { PageTitle, PageShell } from "@/components/layout/PageShell";
import { Eyebrow, ProjectImage, Reveal, Section } from "@/components/ui";
import { projectsApi } from "@/lib/api";
import type { Project } from "@/types";

export default function RealisationDetail() {
  const { slug = "" } = useParams();
  const { t, locale } = useI18n();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    projectsApi
      .bySlug(slug, locale)
      .then((p) => {
        if (!cancelled) setProject(p);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, locale]);

  if (loading) {
    return (
      <PageShell>
        <div className="grid min-h-screen place-items-center">
          <span className="size-8 animate-spin rounded-full border-2 border-line border-t-blue" />
        </div>
      </PageShell>
    );
  }

  if (error || !project) {
    return (
      <PageShell>
        <div className="grid min-h-screen place-items-center px-6 text-center">
          <div>
            <p className="font-heading text-6xl font-extrabold text-blue">404</p>
            <p className="mt-4 text-muted-foreground">{t("common.error404Text")}</p>
            <Link to="/realisations" className="btn-primary mt-6">
              <ArrowLeft className="size-4" aria-hidden />
              {t("realisations.back")}
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageTitle>{`${project.title} — ARIA`}</PageTitle>

      {/* Bandeau projet */}
      <section className="on-dark border-b border-line bg-navy pb-14 pt-28 md:pb-16 md:pt-32">
        <div className="container-site">
          <Link
            to="/realisations"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-blue"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("realisations.back")}
          </Link>

          <div className="animate-rise max-w-3xl">
            <Eyebrow className="text-![#fb923c]">{t("realisations.title")}</Eyebrow>
            <h1 className="title-page text-white">{project.title}</h1>
            <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-white/70">
              {project.description}
            </p>
          </div>

          {/* Méta */}
          <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {project.client && (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                  {t("realisations.client")}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-white">{project.client}</dd>
              </div>
            )}
            {project.duration && (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                  {t("realisations.duration")}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-white">{project.duration}</dd>
              </div>
            )}
            {project.objective && (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                  {t("realisations.objective")}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-white">{project.objective}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* Photo du projet */}
      <div className="container-site pt-8">
        <Reveal>
          <ProjectImage
            src={project.image}
            alt={project.title}
            loading="eager"
            className="max-h-[min(70vh,42rem)] min-h-64 w-full rounded-2xl border border-line bg-card object-cover shadow-elevate sm:min-h-80"
          />
        </Reveal>
      </div>

      {/* Contenu */}
      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {project.fullDescription && (
              <div className="mb-10">
                <h2 className="title-section text-![clamp(1.4rem,2.5vw,1.9rem)]">
                  {t("about.history")}
                </h2>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                  {project.fullDescription}
                </p>
              </div>
            )}

            {project.caseStudyExcerpt && (
              <p className="mb-10 text-base leading-relaxed text-muted-foreground">
                {project.caseStudyExcerpt}
              </p>
            )}

            {project.caseStudyChallenge && (
              <div className="mb-10">
                <h2 className="title-section text-![clamp(1.4rem,2.5vw,1.9rem)]">
                  {t("work.challenge")}
                </h2>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                  {project.caseStudyChallenge}
                </p>
              </div>
            )}

            {project.caseStudyApproach && (
              <div className="mb-10">
                <h2 className="title-section text-![clamp(1.4rem,2.5vw,1.9rem)]">
                  {t("work.approach")}
                </h2>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                  {project.caseStudyApproach}
                </p>
              </div>
            )}

            {project.caseStudyResults.length > 0 && (
              <div className="mb-10">
                <h2 className="title-section text-![clamp(1.4rem,2.5vw,1.9rem)]">
                  {t("work.results")}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {project.caseStudyResults.map((result) => (
                    <li key={result} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-0.5 font-mono text-[11px] text-blue" aria-hidden>↗</span>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.solutions.length > 0 && (
              <div className="mb-10">
                <h2 className="title-section text-![clamp(1.4rem,2.5vw,1.9rem)]">
                  {t("process.title")}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {project.solutions.map((s, i) => (
                    <li key={s} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-0.5 font-mono text-[11px] text-blue">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            {project.technologies.length > 0 && (
              <div className="card-glass p-6">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue">
                  {t("realisations.technologies")}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-line px-3 py-1.5 text-[12px] text-muted-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.caseStudyServices.length > 0 && (
              <div className="card-glass p-6">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue">
                  {t("work.services")}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.caseStudyServices.map((service) => (
                    <li
                      key={service}
                      className="rounded-full border border-line px-3 py-1.5 text-[12px] text-muted-foreground"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.url && (
              <a href={project.url} target="_blank" rel="noreferrer" className="btn-primary w-full">
                {t("realisations.viewSite")}
                <ExternalLink className="size-4" aria-hidden />
              </a>
            )}

            <Link to="/devis" className="btn-outline w-full">
              {t("common.requestAInfo")}
            </Link>
          </aside>
        </div>
      </Section>
    </PageShell>
  );
}
