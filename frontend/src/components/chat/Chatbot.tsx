import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useI18n } from "@/i18n";
import { chatApi } from "@/lib/api";
import type { ChatMessage } from "@/types";

const QUICK_QUESTIONS = ["chat.q1", "chat.q2", "chat.q3", "chat.q4"] as const;

/* ============================================================
   Chatbot IA — proxy Express /api/chat
   La clé Groq ne touche JAMAIS le navigateur.
   ============================================================ */
export default function Chatbot() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "" }, // rempli au montage (t dépend de la langue)
  ]);
  const [fallback, setFallback] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { pathname } = useLocation();

  /* Sur mobile, le bouton passe au-dessus des CTA du hero. Ailleurs, il reste
     en bas à droite. Sur desktop, il reste toujours en bas de l'écran. */
  const [heroVisible, setHeroVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      setHeroVisible(false);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => setHeroVisible(Boolean(entries[0]?.isIntersecting)),
      { threshold: 0.2 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) {
      setFooterVisible(false);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => setFooterVisible(Boolean(entries[0]?.isIntersecting)),
      { threshold: 0.05 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  /* Message d'accueil sync avec la langue */
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].role === "assistant"
        ? [{ role: "assistant", content: t("chat.welcome") }]
        : prev,
    );
  }, [t]);

  /* Auto-scroll en bas */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, open]);

  /* Fermeture au clic extérieur + Échap */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || sending) return;

    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setSending(true);
    setFallback(false);

    try {
      const res = await chatApi.send(next, locale);
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
      setFallback(Boolean(res.fallback));
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.error") },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <>
      {/* ---------- Bouton flottant ---------- */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("nav.close") : t("chat.open")}
        aria-expanded={open}
        className={`fixed bottom-5 right-5 z-50 flex h-14 items-center gap-2.5 rounded-full bg-blue px-5 font-semibold text-blue-foreground shadow-elevate transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-hover sm:bottom-6 sm:right-6 ${
          heroVisible ? "max-md:bottom-24" : ""
        } ${footerVisible && !open ? "pointer-events-none translate-y-4 opacity-0" : ""}`}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
        <span className="hidden text-sm sm:inline">{open ? t("nav.close") : t("chat.open")}</span>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 size-3 animate-pulse-dot rounded-full border-2 border-background bg-[#10B981]" />
        )}
      </button>

      {/* ---------- Fenêtre de chat ---------- */}
      {open && (
        <div
          role="dialog"
          aria-label={t("chat.title")}
          className={`fixed right-3 z-50 flex h-[min(560px,75vh)] w-[min(400px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-elevate animate-rise sm:right-6 ${
            heroVisible
              ? "bottom-40 max-md:top-20 max-md:bottom-24 max-md:h-auto"
              : "bottom-24"
          }`}
        >
          {/* En-tête */}
          <div className="on-dark relative border-b border-line bg-navy px-5 py-4">
            <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue via-coral to-mint" aria-hidden />
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-blue font-heading text-sm font-extrabold text-blue-foreground">
                A
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-sm font-bold text-foreground">
                  {t("chat.title")}
                </p>
                <p className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
                  <span className="size-1.5 animate-pulse-dot rounded-full bg-[#10B981]" aria-hidden />
                  {t("chat.subtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("nav.close")}
                className="ml-auto grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-blue text-blue-foreground"
                      : "rounded-bl-md border border-line bg-surface-1 text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-line bg-surface-1 px-4 py-3 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin text-blue" aria-hidden />
                  {t("chat.thinking")}
                </div>
              </div>
            )}

            {/* Questions rapides (seulement au début) */}
            {messages.length <= 1 && !sending && (
              <div className="pt-2">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t("section.eyebrow.faq")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void send(t(q))}
                      className="rounded-full border border-line bg-surface-1 px-3 py-1.5 text-xs text-foreground transition-colors hover:border-blue/50 hover:text-blue"
                    >
                      {t(q)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Avertissements */}
          {fallback && (
            <p className="border-t border-line bg-coral/[0.07] px-4 py-2.5 text-[11px] leading-relaxed text-coral">
              {t("chat.fallback")}
            </p>
          )}

          {/* Pied : saisie */}
          <form onSubmit={onSubmit} className="border-t border-line p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder")}
                maxLength={600}
                className="field rounded-full! py-2!.5"
                aria-label={t("chat.placeholder")}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label={t("chat.send")}
                className="grid size-10 shrink-0 place-items-center rounded-full bg-blue text-blue-foreground transition-colors hover:bg-blue-hover disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </div>
            <p className="mt-2 px-1 text-[10px] text-muted-foreground">
              {t("chat.disclaimer")}
            </p>
          </form>
        </div>
      )}
    </>
  );
}
