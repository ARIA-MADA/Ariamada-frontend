import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Minus } from "lucide-react";
import { useI18n } from "@/i18n";
import { PageTitle, PageShell } from "@/components/layout/PageShell";
import { Eyebrow, Reveal, Section } from "@/components/ui";
import { faqApi, translateFaqContent } from "@/lib/api";
import type { Faq } from "@/types";

/* Repli si le backend ne répond pas encore */
const FALLBACK_FAQ: Faq[] = [
  {
    id: "f1",
    question: "Quels services propose ARIA ?",
    answer:
      "ARIA accompagne les entreprises sur quatre expertises : le développement web & mobile, le branding & design graphique, le marketing digital & réseaux sociaux, et les solutions entreprises (IA & automatisation).",
    category: "Services",
    order: 1,
    published: true,
  },
  {
    id: "f2",
    question: "Comment obtenir un devis ?",
    answer:
      "Remplissez le formulaire de devis en 3 étapes : votre besoin, puis les langues et les précisions complémentaires, enfin vos coordonnées. Nous vous revenons avec une proposition détaillée sous 24 h ouvrées.",
    category: "Devis",
    order: 2,
    published: true,
  },
  {
    id: "f3",
    question: "Combien coûte un site web ?",
    answer:
      "Le tarif dépend du périmètre (pages, fonctionnalités, contenu). Un site vitrine démarre généralement à un budget modéré, un e-commerce ou une application sur-mesure est chiffré après analyse. Contactez-nous pour un devis précis et gratuit.",
    category: "Tarifs",
    order: 3,
    published: true,
  },
  {
    id: "f4",
    question: "Quel est votre processus de travail ?",
    answer:
      "Cinq étapes : analyse & stratégie, conception & maquette, développement, lancement, puis suivi & optimisation. Vous avez un interlocuteur unique du début à la fin.",
    category: "Méthode",
    order: 4,
    published: true,
  },
  {
    id: "f5",
    question: "Quels sont les délais de livraison ?",
    answer:
      "Un site vitrine se réalise en général en 3 à 6 semaines, selon le contenu et les validations. Un planning clair est fixé dès le démarrage du projet.",
    category: "Méthode",
    order: 5,
    published: true,
  },
  {
    id: "f6",
    question: "Travaillez-vous avec des clients hors de Madagascar ?",
    answer:
      "Oui. Nous accompagnons des clients à Madagascar et à l'international, en français et en anglais, avec des points réguliers à distance.",
    category: "Services",
    order: 6,
    published: true,
  },
];

export default function Faq() {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<Faq[]>(FALLBACK_FAQ);
  const [open, setOpen] = useState<string | null>(FALLBACK_FAQ[0]?.id ?? null);

  useEffect(() => {
    let cancelled = false;
    let hasPublishedFaqs = false;
    void translateFaqContent(FALLBACK_FAQ, locale).then((translated) => {
      if (!cancelled && !hasPublishedFaqs) setItems(translated);
    });
    faqApi
      .listPublished(locale)
      .then((res) => {
        if (!cancelled && res.items.length > 0) {
          hasPublishedFaqs = true;
          setItems(res.items);
          setOpen(res.items[0]?.id ?? null);
        }
      })
      .catch(() => {
        /* on garde le repli statique */
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <PageShell>
      <PageTitle>{`${t("faq.title")} — ARIA`}</PageTitle>

      <section className="section-wash-blue border-b border-line pb-14 pt-28 md:pb-16 md:pt-32">
        <div className="container-site">
          <div className="animate-rise max-w-3xl">
            <Eyebrow>{t("section.eyebrow.faq")}</Eyebrow>
            <h1 className="title-page">{t("faq.title")}</h1>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("faq.description")}
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
          <ul className="order-1 space-y-3 lg:order-2">
            {items.map((f, i) => {
              const isOpen = open === f.id;
              const questionId = `faq-question-${f.id}`;
              const answerId = `faq-answer-${f.id}`;
              return (
                <Reveal key={f.id} delay={i * 50}>
                  <li className="overflow-hidden rounded-xl border border-line bg-card transition-colors hover:border-blue/30">
                    <button
                      id={questionId}
                      type="button"
                      onClick={() => setOpen(isOpen ? null : f.id)}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="flex min-w-0 items-baseline gap-3">
                        <span className="shrink-0 font-mono text-[11px] text-blue">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-heading text-[15px] font-bold text-foreground">
                          {f.question}
                        </span>
                      </span>
                      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted-foreground transition-colors group-hover:border-blue/40 group-hover:text-blue">
                        {isOpen ? <Minus className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                      </span>
                    </button>
                    <div
                      id={answerId}
                      role="region"
                      aria-labelledby={questionId}
                      aria-hidden={!isOpen}
                      className="grid transition-all duration-300 ease-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 pl-[3.1rem] text-sm leading-relaxed text-muted-foreground">
                          {f.answer}
                        </p>
                      </div>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ul>

          <aside className="order-2 self-start lg:order-1 lg:sticky lg:top-28">
            <Reveal>
              <div className="on-dark rounded-2xl border border-line bg-navy p-7 sm:p-8">
                <h2 className="font-heading text-xl font-bold tracking-tight text-white">
                  {t("faq.ctaTitle")}
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                  {t("faq.ctaText")}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/contact" className="btn-primary">
                  {t("faq.contact")}
                </Link>
                <Link to="/devis" className="btn-outline border-white/25! bg-white/[0.06]! text-white!">
                  {t("common.requestAInfo")}
                </Link>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>
    </PageShell>
  );
}
