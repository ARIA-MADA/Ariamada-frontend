import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Lock, Mail, ShieldAlert } from "lucide-react";
import { useI18n } from "@/i18n";
import { PageTitle, PageShell } from "@/components/layout/PageShell";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { authApi } from "@/lib/api";

export default function AdminLogin() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      await authApi.login(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell className="admin-space bg-[#f5f6f8]">
      <PageTitle>{`${t("admin.login.title")} — ARIA`}</PageTitle>
      <div className="relative grid min-h-screen place-items-center px-4 py-20">
        <div className="absolute right-4 top-5 sm:right-8 sm:top-8"><ThemeToggle /></div>
        <div className="w-full max-w-md animate-rise">
          <div className="card-glass relative overflow-hidden rounded-2xl border-[#e1e5e9] bg-white p-8 shadow-[0_18px_50px_rgba(22,31,40,.09)] sm:p-10">
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f97316] via-[#fbbf24] to-[#4387d8]" aria-hidden />
            <div className="mb-6 text-center">
              <span className="relative mx-auto block size-[76px] overflow-hidden rounded-2xl border border-[#e5e8eb] bg-[#001b28] shadow-sm">
                <img src="/icone-aria.jpg" alt="Logo ARIA" className="absolute left-1/2 top-1/2 h-[195%] w-[195%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover" />
              </span>
              <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#9aa1aa]">Accompagnement digital</p>
              <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-foreground">
                {t("admin.login.title")}
              </h1>
              <p className="mt-1 text-sm text-[#626c77]">{t("admin.login.subtitle")}</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="email" className="field-label">
                  {t("admin.login.email")}
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field pl-10!"
                    placeholder="admin@aria-mg.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="field-label">
                  {t("admin.login.password")}
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="field pl-10!"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <p className="flex items-center gap-2 rounded-lg border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral">
                  <ShieldAlert className="size-4 shrink-0" aria-hidden />
                  {t("admin.login.error")}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    {t("admin.login.submitting")}
                  </>
                ) : (
                  t("admin.login.submit")
                )}
              </button>
              <Link to="/" className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#dfe3e7] bg-white px-4 text-sm font-semibold text-[#525d68] transition hover:border-[#f97316]/60 hover:bg-[#fff8f2] hover:text-[#c6530c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d85d10]">
                <ArrowLeft className="size-4" aria-hidden /> Retour à la page d’accueil
              </Link>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
