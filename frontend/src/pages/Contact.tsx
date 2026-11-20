import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Loader2,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { PageTitle, PageShell } from "@/components/layout/PageShell";
import { Eyebrow, Reveal, Section } from "@/components/ui";
import { contactApi } from "@/lib/api";
import { ARIA_CONTACT } from "@/components/layout/Footer";

type FormState = {
  name: string;
  company: string;
  email: string;
  country: string;
  phone: string;
  message: string;
};

const INITIAL: FormState = {
  name: "",
  company: "",
  email: "",
  country: "",
  phone: "",
  message: "",
};

/* ============================================================
   Page CONTACT — réf. Only Cloz (grille 5 colonnes, cartes)
   ============================================================ */
export default function Contact() {
  const { t } = useI18n();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(false);
    setSending(true);
    try {
      await contactApi.send({
        name: form.name,
        email: form.email,
        message: form.message,
        company: form.company || null,
        country: form.country || null,
        phone: form.phone || null,
      });
      setSent(true);
      setForm(INITIAL);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  const INFO = [
    { icon: <Mail className="size-4" />, label: t("contact.email"), value: ARIA_CONTACT.email, href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ARIA_CONTACT.email)}`, external: true },
    { icon: <Phone className="size-4" />, label: t("contact.phone"), value: ARIA_CONTACT.phones[0], href: `tel:${ARIA_CONTACT.phones[0].replace(/\s/g, "")}`, external: false },
    { icon: <MapPin className="size-4" />, label: t("contact.address"), value: t("contact.addressValue"), href: undefined, external: false },
    { icon: <Clock className="size-4" />, label: t("contact.hours"), value: t("contact.hoursValue"), href: undefined, external: false },
  ];

  return (
    <PageShell>
      <PageTitle>{`${t("contact.title")} — ARIA`}</PageTitle>

      {/* Header */}
      <section className="section-wash-blue border-b border-line pb-14 pt-28 md:pb-16 md:pt-32">
        <div className="container-site">
          <div className="animate-rise max-w-3xl">
            <Eyebrow>{t("nav.contact")}</Eyebrow>
            <h1 className="title-page">{t("contact.title")}</h1>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("contact.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Coordonnées et formulaire */}
      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="lg:pt-4">
            <Reveal>
              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
                  {t("contact.details")}
                </h2>
                <ul className="mt-6">
                  {INFO.map((item) => {
                    const inner = (
                      <>
                        <span className="mt-0.5 shrink-0 text-blue">
                          {item.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            {item.label}
                          </span>
                          <span className="mt-1 block break-words text-sm text-foreground transition-colors">
                            {item.value}
                          </span>
                        </span>
                      </>
                    );
                    return (
                      <li key={item.label} className="border-t border-line py-4 last:border-b">
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noreferrer" : undefined}
                            className="group flex items-start gap-3 hover:text-blue"
                          >
                            {inner}
                          </a>
                        ) : (
                          <span className="flex items-start gap-3">{inner}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <a
                  href={ARIA_CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-[#25D366]/40 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-[#25D366]/10"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M20.52 3.48C18.14 1.1 15.01 0 11.7 0 5.16 0 .12 5.04.12 11.58c0 2.05.54 4.05 1.56 5.83L0 24l6.9-1.8c1.73 1 3.73 1.56 5.8 1.56 6.54 0 11.58-5.04 11.58-11.58 0-3.3-1.1-6.44-3.06-8.7z"
                      fill="#25D366"
                    />
                  </svg>
                  {t("contact.whatsapp")}
                </a>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal delay={120}>
              {sent ? (
                <div className="card-glass flex h-full flex-col items-center justify-center p-10 text-center sm:p-14">
                  <span className="grid size-20 place-items-center rounded-2xl border border-blue/30 bg-blue/15">
                    <CheckCircle2 className="size-10 text-blue" aria-hidden />
                  </span>
                  <h2 className="mt-6 font-heading text-2xl font-bold text-foreground">
                    {t("contact.form.success")}
                  </h2>
                  <p className="mt-3 max-w-md text-sm text-muted-foreground">
                    {t("quote.successText")}
                  </p>
                  <button type="button" onClick={() => setSent(false)} className="btn-outline mt-8">
                    {t("quote.successCta")}
                  </button>
                </div>
              ) : (
                <div className="card-glass p-6 sm:p-8 md:p-10">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    {t("contact.form.title")}
                  </h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {t("contact.description")}
                  </p>

                  <form onSubmit={submit} className="mt-8 space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="field-label">
                          {t("contact.form.name")} *
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
                          {t("contact.form.company")}
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
                          {t("contact.form.email")} *
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
                      </div>
                      <div>
                        <label htmlFor="country" className="field-label">
                          {t("contact.form.country")}
                        </label>
                        <input
                          id="country"
                          name="country"
                          type="text"
                          value={form.country}
                          onChange={set}
                          className="field"
                          placeholder="Madagascar"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="field-label">
                        {t("contact.form.phone")}
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={set}
                        className="field"
                        placeholder="+261 34 00 000 00"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="field-label">
                        {t("contact.form.message")} *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={set}
                        className="field resize-y"
                        placeholder={t("contact.form.messagePlaceholder")}
                      />
                    </div>

                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {t("contact.form.consent")}
                    </p>

                    {error && (
                      <p className="rounded-lg border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral">
                        {t("contact.form.error")}
                      </p>
                    )}

                    <button type="submit" disabled={sending} className="btn-primary w-full">
                      {sending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden />
                          {t("contact.form.sending")}
                        </>
                      ) : (
                        <>
                          {t("contact.form.submit")}
                          <Send className="size-4" aria-hidden />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </Reveal>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Eyebrow className="mb-0!">{t("section.eyebrow.cta")}</Eyebrow>
        </div>
      </Section>
    </PageShell>
  );
}
