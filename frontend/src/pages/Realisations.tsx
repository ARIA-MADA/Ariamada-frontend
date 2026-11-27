import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, RefreshCw, Inbox } from "lucide-react";
import { useI18n } from "@/i18n";
import { PageTitle, PageShell } from "@/components/layout/PageShell";
import { Eyebrow, ProjectImage, Reveal, Section } from "@/components/ui";
import { projectsApi } from "@/lib/api";
import type { Project } from "@/types";
import type { TranslationKey } from "@/i18n/fr";

const STATUS_LABEL: Record<Project["status"], TranslationKey> = {
  PENDING: "project.status.pending",
  IN_PROGRESS: "project.status.inProgress",
  STANDBY: "project.status.standby",
  COMPLETED: "project.status.completed",
};

const STATUS_STYLE: Record<Project["status"], string> = {
  PENDING: "border-line text-muted-foreground",
  IN_PROGRESS: "border-coral/40 text-coral",
  STANDBY: "border-amber-400/40 text-amber-600",
  COMPLETED: "border-blue/40 text-blue",
};

export default function Realisations() {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await projectsApi.listPublished(locale);
      setItems(res.items);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return (
    <PageShell>
      <PageTitle>{`${t("realisations.title")} — ARIA`}</PageTitle>

      <section className="section-wash-blue border-b border-line pb-14 pt-28 md:pb-16 md:pt-32">
        <div className="container-site">
          <div className="animate-rise max-w-3xl">
            <Eyebrow>{t("section.eyebrow.realisations")}</Eyebrow>
            <h1 className="title-page">{t("realisations.title")}</h1>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("realisations.description")}
            </p>
          </div>
        </div>
      </section>

      <Section>
        {loading && (
          <div className="grid min-h-[40vh] place-items-center">
            <div className="flex flex-col items-center gap-3">
              <span className="size-8 animate-spin rounded-full border-2 border-line border-t-blue" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {t("realisations.loading")}
              </span>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="grid min-h-[40vh] place-items-center text-center">
            <div>
              <Inbox className="mx-auto size-10 text-muted-foreground" aria-hidden />
              <p className="mt-4 text-sm text-muted-foreground">{t("realisations.error")}</p>
              <button type="button" onClick={() => void load()} className="btn-outline mt-5">
                <RefreshCw className="size-4" aria-hidden />
                {t("realisations.retry")}
              </button>
            </div>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="grid min-h-[40vh] place-items-center text-center">
            <div>
              <Inbox className="mx-auto size-10 text-muted-foreground" aria-hidden />
              <p className="mt-4 text-sm text-muted-foreground">{t("realisations.empty")}</p>
            </div>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 80}>
                <Link
                  to={`/realisations/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-blue/45 hover:shadow-elevate"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                    <ProjectImage
                      src={p.image}
                      alt={`${p.title} — aperçu du site`}
                      className="size-full object-contain"
                    />
                    <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/90 backdrop-blur-md">
                      {p.caseStudyServices[0] ?? p.technologies[0] ?? t("realisations.title")}
                    </span>
                    <span
                      className={`absolute right-3 top-3 rounded-full border bg-black/40 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider backdrop-blur-sm ${STATUS_STYLE[p.status]}`}
                    >
                      {t(STATUS_LABEL[p.status])}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {p.client ?? String(i + 1).padStart(2, "0")}
                    </p>
                    <h2 className="font-heading text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-blue">
                      {p.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    {p.technologies.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {p.technologies.slice(0, 4).map((tech) => (
                          <li
                            key={tech}
                            className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="mt-5 inline-flex items-center gap-1.5 border-t border-line pt-4 text-sm font-semibold text-blue">
                      {t("solutions.discover")}
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
