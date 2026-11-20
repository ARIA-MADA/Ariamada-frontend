import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n";
import { PageTitle, PageShell } from "@/components/layout/PageShell";
import { Eyebrow, Reveal, Section } from "@/components/ui";
import { quotesApi } from "@/lib/api";
import type { TranslationKey } from "@/i18n/fr";

const STEPS = ["quote.step1", "quote.step2", "quote.step3"] as const;

const SERVICE_OPTIONS: { value: string; labelKey: TranslationKey }[] = [
  { value: "dev", labelKey: "quote.service.dev" },
  { value: "branding", labelKey: "quote.service.branding" },
  { value: "marketing", labelKey: "quote.service.marketing" },
  { value: "ia", labelKey: "quote.service.ia" },
  { value: "other", labelKey: "quote.service.other" },
];

type FormState = {
  service: string;
  projectDescription: string;
  languages: string;
  name: string;
  company: string;
  email: string;
  country: string;
  phone: string;
  message: string;
};

const INITIAL: FormState = {
  service: "",
  projectDescription: "",
  languages: "",
  name: "",
  company: "",
  email: "",
  country: "",
  phone: "",
  message: "",
};

/* ============================================================
   Formulaire de devis — 3 étapes (réf. Optiline / Only Cloz)
   ============================================================ */
export default function Devis() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(() => {
    const s = params.get("service");
    return { ...INITIAL, service: s && SERVICE_OPTIONS.some((o) => o.value === s) ? s : "" };
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const next = (e: FormEvent) => {
    e.preventDefault();
    setError(false);
    if (step === 0 && (!form.service || !form.projectDescription.trim())) {
      setError(true);
      return;
    }
    if (step === 1 && !form.languages.trim()) {
      setError(true);
      return;
    }
    if (step === 2 && (
      !form.name.trim() ||
      !form.company.trim() ||
      !form.email.trim() ||
      !emailOk ||
      !form.phone.trim() ||
      !form.country.trim()
    )) {
      setError(true);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setError(false);
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !form.service ||
      !form.projectDescription.trim() ||
      !form.languages.trim() ||
      !form.name.trim() ||
      !form.company.trim() ||
      !form.email.trim() ||
      !emailOk ||
      !form.phone.trim() ||
      !form.country.trim()
    ) {
      setError(true);
      return;
    }
    setSending(true);
    setError(false);
    try {
      await quotesApi.create({
        service: form.service,
        name: form.name,
        email: form.email,
        projectDescription: form.projectDescription || null,
        languages: form.languages || null,
        company: form.company || null,
        country: form.country || null,
        phone: form.phone || null,
        message: form.message || null,
      });
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageShell>
      <PageTitle>{`${t("quote.title")} — ARIA`}</PageTitle>

      <section className="section-wash-blue border-b border-line pb-14 pt-28 md:pb-16 md:pt-32">
        <div className="container-site">
          <div className="animate-rise max-w-3xl">
            <Eyebrow>{t("section.eyebrow.cta")}</Eyebrow>
            <h1 className="title-page">{t("quote.title")}</h1>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("quote.description")}
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-2xl">
          {sent ? (
            <Reveal>
              <div className="card-glass p-10 text-center sm:p-14">
                <span className="mx-auto grid size-20 place-items-center rounded-2xl border border-blue/30 bg-blue/15">
                  <CheckCircle2 className="size-10 text-blue" aria-hidden />
                </span>
                <h2 className="mt-6 font-heading text-2xl font-bold text-foreground">
                  {t("quote.success")}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {t("quote.successText")}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link to="/" className="btn-primary">
                    {t("common.backHome")}
                  </Link>
                  <Link to="/contact" className="btn-outline">
                    {t("common.talkToUs")}
                  </Link>
                </div>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <div className="card-glass overflow-hidden p-6 sm:p-8 md:p-10">
                {/* Indicateur d'étapes */}
                <ol className="mb-8 flex items-center gap-2">
                  {STEPS.map((s, i) => (
                    <li key={s} className="flex flex-1 items-center gap-2">
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] transition-colors ${
                          i < step
                            ? "border-blue bg-blue text-blue-foreground"
                            : i === step
                              ? "border-blue text-blue"
                              : "border-line text-muted-foreground"
                        }`}
                      >
                        {i < step ? <Check className="size-3.5" /> : i + 1}
                      </span>
                      <span
                        className={`hidden text-xs font-medium sm:block ${
                          i <= step ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {t(s)}
                      </span>
                      {i < STEPS.length - 1 && (
                        <span className="h-px flex-1 bg-line" aria-hidden />
                      )}
                    </li>
                  ))}
                </ol>

                <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-blue">
                  {t("quote.stepOf")} {step + 1} {t("quote.of")} {STEPS.length} — {t(STEPS[step])}
                </p>

                <form onSubmit={step === STEPS.length - 1 ? submit : next} className="space-y-5">
                  {/* ---- Étape 1 : besoin ---- */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="service" className="field-label">
                          {t("quote.service")}
                        </label>
                        <select
                          id="service"
                          name="service"
                          required
                          value={form.service}
                          onChange={set}
                          className="field"
                        >
                          <option value="">{t("quote.servicePlaceholder")}</option>
                          {SERVICE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {t(o.labelKey)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="projectDescription" className="field-label">
                          {t("quote.projectDescription")}
                        </label>
                        <textarea
                          id="projectDescription"
                          name="projectDescription"
                          required
                          rows={5}
                          value={form.projectDescription}
                          onChange={set}
                          className="field resize-y"
                          placeholder={t("quote.projectDescriptionPlaceholder")}
                        />
                      </div>
                    </div>
                  )}

                  {/* ---- Étape 2 : langues & précisions ---- */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="languages" className="field-label">
                          {t("quote.languages")}
                        </label>
                        <input
                          id="languages"
                          name="languages"
                          type="text"
                          required
                          value={form.languages}
                          onChange={set}
                          className="field"
                          placeholder={t("quote.languagesPlaceholder")}
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="field-label">
                          {t("quote.message")}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={form.message}
                          onChange={set}
                          className="field resize-y"
                          placeholder={t("quote.projectDescriptionPlaceholder")}
                        />
                      </div>
                    </div>
                  )}

                  {/* ---- Étape 3 : coordonnées ---- */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="field-label">
                            {t("quote.name")}
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={set}
                            className="field"
                            placeholder={t("contact.namePlaceholder")}
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="field-label">
                            {t("quote.company")}
                          </label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            value={form.company}
                            onChange={set}
                            className="field"
                placeholder={t("contact.companyPlaceholder")}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="email" className="field-label">
                            {t("quote.email")}
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={set}
                            className="field"
                            placeholder="jean@entreprise.mg"
                          />
                          {form.email && !emailOk && (
                            <p className="mt-1.5 text-xs text-coral">{t("quote.invalidEmail")}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="phone" className="field-label">
                            {t("quote.phone")}
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={form.phone}
                            onChange={set}
                            className="field"
                            placeholder="+261 34 00 000 00"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="country" className="field-label">
                          {t("quote.country")}
                        </label>
                        <input
                          id="country"
                          name="country"
                          type="text"
                          required
                          value={form.country}
                          onChange={set}
                          className="field"
                          placeholder="Madagascar"
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="rounded-lg border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral">
                      {step === 0 && !form.service
                        ? t("quote.required")
                        : step === 2 && !emailOk
                          ? t("quote.invalidEmail")
                          : t("quote.error")}
                    </p>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    {step > 0 ? (
                      <button type="button" onClick={back} className="btn-ghost">
                        <ArrowLeft className="size-4" aria-hidden />
                        {t("quote.back")}
                      </button>
                    ) : (
                      <Link to="/" className="btn-ghost">
                        <ArrowLeft className="size-4" aria-hidden />
                        {t("common.backHome")}
                      </Link>
                    )}

                    {step < STEPS.length - 1 ? (
                      <button type="submit" className="btn-primary">
                        {t("quote.continue")}
                        <ArrowRight className="size-4" aria-hidden />
                      </button>
                    ) : (
                      <button type="submit" disabled={sending} className="btn-primary">
                        {sending ? (
                          <>
                            <Loader2 className="size-4 animate-spin" aria-hidden />
                            {t("quote.submitting")}
                          </>
                        ) : (
                          <>
                            {t("quote.submit")}
                            <ArrowRight className="size-4" aria-hidden />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </Reveal>
          )}
        </div>
      </Section>
    </PageShell>
  );
}
