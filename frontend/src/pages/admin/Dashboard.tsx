import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BarChart3,
  FolderKanban,
  Mail,
  FileText,
  HelpCircle,
  BookOpen,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Settings2,
  Activity,
  ChevronRight,
  SunMoon,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { PageTitle, PageShell } from "@/components/layout/PageShell";
import {
  authApi,
  contactApi,
  dashboardApi,
  faqApi,
  knowledgeApi,
  projectsApi,
  quotesApi,
  uploadApi,
} from "@/lib/api";
import type {
  ContactMessage,
  DashboardStats,
  Faq,
  Knowledge,
  Project,
  QuoteRequest,
} from "@/types";
import DetailModal, { type AdminDetailKind } from "@/pages/admin/DetailModal";
import { useTheme } from "@/lib/theme";
import { ProjectImage } from "@/components/ui";

type Tab = "overview" | "projects" | "messages" | "quotes" | "faq" | "knowledge";

const TABS: { id: Tab; labelKey: "admin.tab.overview" | "admin.tab.projects" | "admin.tab.messages" | "admin.tab.quotes" | "admin.tab.faq" | "admin.tab.knowledge"; icon: typeof BarChart3 }[] = [
  { id: "overview", labelKey: "admin.tab.overview", icon: BarChart3 },
  { id: "projects", labelKey: "admin.tab.projects", icon: FolderKanban },
  { id: "messages", labelKey: "admin.tab.messages", icon: Mail },
  { id: "quotes", labelKey: "admin.tab.quotes", icon: FileText },
  { id: "faq", labelKey: "admin.tab.faq", icon: HelpCircle },
  { id: "knowledge", labelKey: "admin.tab.knowledge", icon: BookOpen },
];

export default function AdminDashboard() {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => {
    const requested = searchParams.get("section") as Tab | null;
    return TABS.some((item) => item.id === requested) ? requested! : "overview";
  });
  const [detail, setDetail] = useState<{ kind: AdminDetailKind; id: string } | null>(null);
  const [checking, setChecking] = useState(true);

  /* Vérification de session au chargement */
  useEffect(() => {
    authApi
      .me()
      .then((user) => {
        if (!user) navigate("/admin/login", { replace: true });
      })
      .catch(() => navigate("/admin/login", { replace: true }))
      .finally(() => setChecking(false));
  }, [navigate]);

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  const editFromDetail = (kind: AdminDetailKind, id: string) => {
    const section: Tab = kind === "project" ? "projects" : kind === "faq" ? "faq" : "knowledge";
    setDetail(null);
    setTab(section);
    setSearchParams({ section, edit: id });
  };

  if (checking) {
    return (
      <PageShell>
        <div className="grid min-h-screen place-items-center">
          <span className="size-8 animate-spin rounded-full border-2 border-line border-t-blue" />
        </div>
      </PageShell>
    );
  }

  const activeTab = TABS.find((item) => item.id === tab)!;
  return (
    <PageShell className="admin-space bg-[#f5f6f8] text-[#20252b]">
      <PageTitle>{`${t("admin.dashboard")} — ARIA`}</PageTitle>
      <div className="min-h-screen md:grid md:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="flex flex-col border-b border-[#e6e8eb] bg-white px-4 py-5 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r md:px-5 md:py-7">
          <Link to="/" className="mb-6 flex items-center gap-3 px-2 md:mb-12">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-[#dfe3e7] bg-[#001b28] shadow-sm"><img src="/icone-aria.jpg" alt="Logo ARIA" className="absolute left-1/2 top-1/2 h-[195%] w-[195%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover" /></span>
            <span><span className="block font-heading text-lg font-extrabold tracking-tight">ARIA</span><span className="block text-[11px] text-[#89919b]">Espace de gestion</span></span>
          </Link>
          <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[.16em] text-[#9aa1aa]">Menu principal</p>
          <nav aria-label="Navigation administration" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {TABS.map((tb) => {
            const Icon = tb.icon;
            return (
              <button
                key={tb.id}
                type="button"
                onClick={() => setTab(tb.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-3 text-left text-[13px] font-semibold transition-colors ${
                  tab === tb.id
                    ? "bg-[#fff1e8] text-[#d85d10]"
                    : "text-[#737c87] hover:bg-[#f4f5f6] hover:text-[#20252b]"
                }`}
              >
                <Icon className="size-4" aria-hidden />
                <span className="hidden md:inline">{t(tb.labelKey)}</span>
                <span className="md:hidden">{t(tb.labelKey)}</span>
                {tab === tb.id && <ChevronRight className="ml-auto hidden size-4 md:block" />}
              </button>
            );
          })}
          </nav>
          <div className="mt-auto hidden rounded-2xl bg-[#f7f8f9] p-4 md:block"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#4d5660]"><Activity className="size-4 text-[#f97316]" /> Site opérationnel</div><p className="text-[11px] leading-relaxed text-[#8b939d]">Gérez le contenu et les demandes reçues sur aria-mg.com.</p></div>
          <button type="button" onClick={toggleTheme} role="switch" aria-label="Thème sombre" aria-checked={theme === "dark"} className="mt-3 flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-medium text-[#737c87] transition hover:bg-[#f4f5f6] hover:text-[#20252b] md:mt-4"><SunMoon className="size-4"/><span>Apparence</span><span className={`ml-auto flex h-6 w-11 items-center rounded-full p-1 transition-colors ${theme === "dark" ? "bg-[#f97316]" : "bg-[#cbd1d7]"}`}><span className={`size-4 rounded-full bg-white shadow transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`}/></span></button>
          <button type="button" onClick={() => void logout()} className="mt-3 flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-medium text-[#737c87] transition hover:bg-[#f4f5f6] hover:text-[#20252b] md:mt-4">
            <LogOut className="size-4" aria-hidden /> {t("admin.logout")}
          </button>
        </aside>
        <section className="min-w-0 px-4 py-6 sm:px-7 md:px-10 md:py-9">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div><p className="mb-2 font-mono text-[10px] uppercase tracking-[.18em] text-[#9aa1aa]">ARIA / Administration</p><h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#20252b]">{tab === "overview" ? "Bonjour, bienvenue" : t(activeTab.labelKey)}</h1><p className="mt-1 text-sm text-[#89919b]">{tab === "overview" ? "Voici ce qui se passe sur votre espace aujourd’hui." : "Consultez et gérez facilement les informations de cette rubrique."}</p></div>
              <div className="flex items-center gap-3"><span className="hidden items-center gap-2 rounded-full border border-[#e6e8eb] bg-white px-3 py-2 text-xs font-medium text-[#66707b] sm:inline-flex"><span className="size-2 rounded-full bg-emerald-500"/>Connecté</span><Link to="/" className="grid size-10 place-items-center rounded-xl border border-[#e6e8eb] bg-white text-[#737c87] hover:text-[#20252b]" aria-label="Voir le site"><Settings2 className="size-4"/></Link></div>
            </div>
            {tab === "overview" && <Overview onNavigate={setTab} />}
            {tab === "projects" && <ProjectsPanel onOpenDetail={(id) => setDetail({ kind: "project", id })} />}
            {tab === "messages" && <MessagesPanel onOpenDetail={(id) => setDetail({ kind: "message", id })} />}
            {tab === "quotes" && <QuotesPanel onOpenDetail={(id) => setDetail({ kind: "quote", id })} />}
            {tab === "faq" && <FaqPanel onOpenDetail={(id) => setDetail({ kind: "faq", id })} />}
            {tab === "knowledge" && <KnowledgePanel onOpenDetail={(id) => setDetail({ kind: "knowledge", id })} />}
          </div>
        </section>
      </div>
      {detail && <DetailModal kind={detail.kind} id={detail.id} onClose={() => setDetail(null)} onEdit={editFromDetail} />}
    </PageShell>
  );
}

/* ============================================================
   Vue d'ensemble — statistiques
   ============================================================ */
function Overview({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const { t } = useI18n();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    dashboardApi
      .stats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  if (loading) return <Panel>Chargement des indicateurs…</Panel>;
  if (!stats) return <Panel>{t("realisations.error")}</Panel>;

  const cards = [
    { label: t("admin.stats.projectsTotal"), value: stats.projectsTotal, tone: "orange" },
    { label: t("admin.stats.projectsCompleted"), value: stats.projectsCompleted, tone: "blue" },
    { label: t("admin.stats.projectsInProgress"), value: stats.projectsInProgress, tone: "yellow" },
    { label: t("admin.stats.messages"), value: stats.messagesTotal, tone: "orange" },
    { label: t("admin.stats.messagesNew"), value: stats.messagesNew, tone: "blue" },
    { label: t("admin.stats.quotes"), value: stats.quotesTotal, tone: "yellow" },
    { label: t("admin.stats.quotesNew"), value: stats.quotesNew, tone: "orange" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((c, index) => (
          <div key={c.label} className="rounded-2xl border border-[#e8eaed] bg-white p-4 shadow-[0_2px_12px_rgba(25,35,45,.025)] sm:p-5">
            <div className="flex items-start justify-between gap-2"><p className="text-xs font-medium leading-relaxed text-[#818a95]">{c.label}</p><span className={`size-2 rounded-full ${index % 3 === 0 ? "bg-[#f97316]" : index % 3 === 1 ? "bg-[#4387d8]" : "bg-[#26a981]"}`} /></div>
            <p className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-[#242a31]">{c.value}</p>
            <p className="mt-1 text-[11px] text-[#a0a7af]">Depuis la création du site</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-2xl border border-[#e8eaed] bg-white p-5 sm:p-6">
          <div className="mb-6 flex items-start justify-between"><div><h2 className="font-heading text-base font-bold text-[#252b32]">Avancement des réalisations</h2><p className="mt-1 text-xs text-[#8a929c]">Répartition actuelle par statut</p></div><FolderKanban className="size-5 text-[#f97316]"/></div>
          <div className="space-y-5">
            {[{ label: "Terminées", value: stats.projectsCompleted, color: "bg-[#26a981]" }, { label: "En cours", value: stats.projectsInProgress, color: "bg-[#4387d8]" }, { label: "En attente", value: Math.max(0, stats.projectsTotal - stats.projectsCompleted - stats.projectsInProgress), color: "bg-[#f6b84b]" }].map((item) => {
              const percent = stats.projectsTotal ? Math.round((item.value / stats.projectsTotal) * 100) : 0;
              return <div key={item.label}><div className="mb-2 flex justify-between text-xs"><span className="font-medium text-[#68717b]">{item.label}</span><span className="tabular-nums text-[#89919b]">{item.value} <span className="ml-1 text-[#aab0b7]">{percent}%</span></span></div><div className="h-2 overflow-hidden rounded-full bg-[#f0f2f4]"><div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${percent}%` }} /></div></div>;
            })}
          </div>
          {stats.projectsTotal === 0 && <p className="mt-4 text-xs text-[#9aa1aa]">Ajoutez une réalisation pour commencer à suivre l’avancement.</p>}
        </section>
        <section className="rounded-2xl border border-[#e8eaed] bg-white p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between"><div><h2 className="font-heading text-base font-bold text-[#252b32]">Demandes reçues</h2><p className="mt-1 text-xs text-[#8a929c]">Nouveaux éléments à traiter</p></div><Mail className="size-5 text-[#4387d8]"/></div>
          <div className="flex items-center justify-center gap-8 py-2">
            <DonutChart total={stats.messagesTotal} active={stats.messagesNew} label="Messages" color="#4387d8" />
            <DonutChart total={stats.quotesTotal} active={stats.quotesNew} label="Devis" color="#f97316" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#eef0f2] pt-4">
            <button type="button" onClick={() => onNavigate("messages")} className="rounded-xl bg-[#f6f8fa] p-3 text-left hover:bg-[#f0f3f6]"><span className="block text-[11px] text-[#8a929c]">Messages non lus</span><span className="mt-1 block text-xl font-bold text-[#303740]">{stats.messagesNew}</span></button>
            <button type="button" onClick={() => onNavigate("quotes")} className="rounded-xl bg-[#f6f8fa] p-3 text-left hover:bg-[#f0f3f6]"><span className="block text-[11px] text-[#8a929c]">Nouvelles demandes de devis</span><span className="mt-1 block text-xl font-bold text-[#303740]">{stats.quotesNew}</span></button>
          </div>
        </section>
      </div>
      <p className="text-[11px] text-[#a0a7af]">Les graphiques reflètent les données actuellement enregistrées.</p>
    </div>
  );
}

function DonutChart({ total, active, label, color }: { total: number; active: number; label: string; color: string }) {
  const safeTotal = Math.max(total, 1);
  const circumference = 2 * Math.PI * 30;
  const dash = (Math.min(active, total) / safeTotal) * circumference;
  return <div className="flex items-center gap-3"><div className="relative grid size-[76px] place-items-center"><svg viewBox="0 0 76 76" className="size-[76px] -rotate-90" aria-label={`${active} nouveaux ${label.toLowerCase()} sur ${total}`}><circle cx="38" cy="38" r="30" fill="none" stroke="#eef0f2" strokeWidth="8"/><circle cx="38" cy="38" r="30" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`} /></svg><span className="absolute text-sm font-bold text-[#303740]">{total}</span></div><div><p className="text-xs font-semibold text-[#59626d]">{label}</p><p className="mt-1 text-[11px] text-[#929aa3]">{active} nouveau{active > 1 ? "x" : ""}</p></div></div>;
}

/* ============================================================
   Projets / Réalisations
   ============================================================ */
function ProjectsPanel({ onOpenDetail }: { onOpenDetail: (id: string) => void }) {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    fullDescription: "",
    objective: "",
    client: "",
    duration: "",
    url: "",
    technologies: "",
    goals: "",
    solutions: "",
    caseStudyExcerpt: "",
    caseStudyChallenge: "",
    caseStudyApproach: "",
    caseStudyResults: "",
    caseStudyServices: "",
    status: "PENDING" as Project["status"],
    published: false,
    order: "0",
    image: "",
  });

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    projectsApi
      .listAll()
      .then((r) => setItems(r.items))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Impossible de charger les projets."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      description: "",
      fullDescription: "",
      objective: "",
      client: "",
      duration: "",
      url: "",
      technologies: "",
      goals: "",
      solutions: "",
      caseStudyExcerpt: "",
      caseStudyChallenge: "",
      caseStudyApproach: "",
      caseStudyResults: "",
      caseStudyServices: "",
      status: "PENDING",
      published: false,
      order: String(items.length),
      image: "",
    });
    setImageFile(null);
    setEditing(null);
    setCreating(false);
    if (searchParams.has("edit")) setSearchParams({ section: "projects" }, { replace: true });
  };

  const edit = (project: Project) => {
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      fullDescription: project.fullDescription ?? "",
      objective: project.objective ?? "",
      client: project.client ?? "",
      duration: project.duration ?? "",
      url: project.url ?? "",
      technologies: project.technologies.join("\n"),
      goals: project.goals.join("\n"),
      solutions: project.solutions.join("\n"),
      caseStudyExcerpt: project.caseStudyExcerpt ?? "",
      caseStudyChallenge: project.caseStudyChallenge ?? "",
      caseStudyApproach: project.caseStudyApproach ?? "",
      caseStudyResults: project.caseStudyResults.join("\n"),
      caseStudyServices: project.caseStudyServices.join("\n"),
      status: project.status,
      published: project.published,
      order: String(project.order),
      image: project.image ?? "",
    });
    setImageFile(null);
    setEditing(project);
    setCreating(false);
    setError("");
  };

  useEffect(() => {
    const editId = searchParams.get("edit");
    const project = items.find((item) => item.id === editId);
    if (!project || creating || editing?.id === project.id) return;
    setForm({
      title: project.title, slug: project.slug, description: project.description,
      fullDescription: project.fullDescription ?? "", objective: project.objective ?? "",
      client: project.client ?? "", duration: project.duration ?? "", url: project.url ?? "",
      technologies: project.technologies.join("\n"), goals: project.goals.join("\n"),
      solutions: project.solutions.join("\n"), caseStudyExcerpt: project.caseStudyExcerpt ?? "",
      caseStudyChallenge: project.caseStudyChallenge ?? "", caseStudyApproach: project.caseStudyApproach ?? "",
      caseStudyResults: project.caseStudyResults.join("\n"), caseStudyServices: project.caseStudyServices.join("\n"),
      status: project.status, published: project.published, order: String(project.order), image: project.image ?? "",
    });
    setImageFile(null); setEditing(project); setCreating(false); setError("");
  }, [items, searchParams, creating, editing?.id]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setSaving(true);
    setError("");
    try {
      const image = imageFile ? (await uploadApi.upload(imageFile)).url : form.image || null;
      const data = {
        title: form.title.trim(),
        slug: form.slug.trim() || form.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
        description: form.description.trim(),
        fullDescription: form.fullDescription || null,
        objective: form.objective || null,
        client: form.client || null,
        duration: form.duration || null,
        url: form.url || null,
        technologies: form.technologies.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
        goals: form.goals.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
        solutions: form.solutions.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
        caseStudyExcerpt: form.caseStudyExcerpt || null,
        caseStudyChallenge: form.caseStudyChallenge || null,
        caseStudyApproach: form.caseStudyApproach || null,
        caseStudyResults: form.caseStudyResults.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
        caseStudyServices: form.caseStudyServices.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
        status: form.status,
        published: form.published,
        order: Number(form.order) || 0,
        image,
      };
      if (editing) {
        await projectsApi.update(editing.id, data);
      } else {
        await projectsApi.create(data);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer le projet.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (p: Project) => {
    try {
      await projectsApi.update(p.id, { published: !p.published });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de modifier la publication.");
    }
  };

  const setStatus = async (p: Project, status: Project["status"]) => {
    try {
      await projectsApi.update(p.id, { status });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de modifier le statut.");
    }
  };

  const remove = async (p: Project) => {
    try {
      await projectsApi.remove(p.id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer le projet.");
      throw err;
    }
  };

  return (
    <div>
      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral">
          {error}
        </p>
      )}
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (creating) resetForm();
            else {
              resetForm();
              setCreating(true);
            }
          }}
          className="btn-primary"
        >
          <Plus className="size-4" aria-hidden />
          {creating ? t("quote.back") : "Nouvelle réalisation"}
        </button>
        <button type="button" onClick={load} className="btn-ghost">
          <RefreshCw className="size-4" aria-hidden />
          Actualiser
        </button>
      </div>

      {(creating || editing) && (
        <AdminModal title={editing ? "Modifier la réalisation" : "Nouvelle réalisation"} onClose={resetForm}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              aria-label="Titre du projet"
              placeholder="Titre du projet"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="field"
            />
            <input
              aria-label="Slug"
              placeholder="Slug (URL)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="field"
            />
            <input
              aria-label="Client"
              placeholder="Client"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              className="field"
            />
            <input
              aria-label="Durée"
              placeholder="Durée (ex: 3 mois)"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="field"
            />
          </div>
          <textarea
            required
            rows={3}
            aria-label="Description"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="field resize-y"
          />
          <textarea
            rows={4}
            aria-label="Description complète"
            placeholder="Description complète (optionnel)"
            value={form.fullDescription}
            onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
            className="field resize-y"
          />
          <div className="rounded-xl border border-line bg-surface-1 p-4 sm:p-5">
            <h2 className="font-heading text-base font-bold text-foreground">Étude du projet</h2>
            <p className="mt-1 mb-4 text-xs leading-relaxed text-muted-foreground">
              Ajoutez le contexte, la démarche et les résultats directement à cette réalisation.
            </p>
            <div className="space-y-3">
              <textarea
                rows={2}
                aria-label="Résumé de l’étude"
                placeholder="Résumé du projet (optionnel)"
                value={form.caseStudyExcerpt}
                onChange={(e) => setForm({ ...form, caseStudyExcerpt: e.target.value })}
                className="field resize-y"
              />
              <textarea
                rows={3}
                aria-label="Contexte et défi"
                placeholder="Contexte et défi à relever"
                value={form.caseStudyChallenge}
                onChange={(e) => setForm({ ...form, caseStudyChallenge: e.target.value })}
                className="field resize-y"
              />
              <textarea
                rows={3}
                aria-label="Approche"
                placeholder="Approche et démarche"
                value={form.caseStudyApproach}
                onChange={(e) => setForm({ ...form, caseStudyApproach: e.target.value })}
                className="field resize-y"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <textarea
                  rows={3}
                  aria-label="Résultats"
                  placeholder="Résultats (un par ligne)"
                  value={form.caseStudyResults}
                  onChange={(e) => setForm({ ...form, caseStudyResults: e.target.value })}
                  className="field resize-y"
                />
                <textarea
                  rows={3}
                  aria-label="Services réalisés"
                  placeholder="Services réalisés (un par ligne)"
                  value={form.caseStudyServices}
                  onChange={(e) => setForm({ ...form, caseStudyServices: e.target.value })}
                  className="field resize-y"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              aria-label="Objectif"
              placeholder="Objectif"
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              className="field"
            />
            <input
              aria-label="URL du site"
              placeholder="URL du site (optionnel)"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="field"
            />
          </div>
          <textarea
            rows={2}
            aria-label="Technologies"
            placeholder={"Technologies (une par ligne)"}
            value={form.technologies}
            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
            className="field resize-y"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <textarea
              rows={3}
              aria-label="Objectifs"
              placeholder="Objectifs (un par ligne)"
              value={form.goals}
              onChange={(e) => setForm({ ...form, goals: e.target.value })}
              className="field resize-y"
            />
            <textarea
              rows={3}
              aria-label="Solutions"
              placeholder="Solutions (une par ligne)"
              value={form.solutions}
              onChange={(e) => setForm({ ...form, solutions: e.target.value })}
              className="field resize-y"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              Image du projet
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="field file:mr-3 file:rounded-md file:border-0 file:bg-blue/10 file:px-3 file:py-1 file:text-sm file:text-blue"
              />
              <span className="text-xs">JPG, PNG, WebP, AVIF, GIF ou SVG — 4 Mo max.</span>
            </label>
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              Statut
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}
                className="field"
              >
                <option value="PENDING">En attente</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="COMPLETED">Terminé</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              Ordre d'affichage
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                className="field"
              />
            </label>
          </div>
          {(imagePreview || form.image) && (
            <div className="flex items-center gap-3">
              <img src={imagePreview || form.image} alt="Aperçu de l’image du projet" className="size-20 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setForm({ ...form, image: "" });
                }}
                className="btn-ghost"
              >
                Retirer l’image
              </button>
            </div>
          )}
          {imageFile && <p className="text-xs text-muted-foreground">{imageFile.name}</p>}
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="accent-blue"
            />
            Publier cette réalisation
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? "Enregistrement…" : editing ? "Enregistrer les modifications" : "Créer"}
            </button>
            <button type="button" onClick={resetForm} className="btn-ghost">
              Annuler
            </button>
          </div>
        </form>
        </AdminModal>
      )}

      {loading ? (
        <Panel>Chargement…</Panel>
      ) : items.length === 0 ? (
        <Panel>Aucun projet pour le moment.</Panel>
      ) : (
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.id} role="button" tabIndex={0} aria-label={`Ouvrir le détail de ${p.title}`} onClick={(event) => activateCard(event, () => onOpenDetail(p.id))} onKeyDown={(event) => activateCardKey(event, () => onOpenDetail(p.id))} className="card-glass flex cursor-pointer flex-col items-stretch gap-3 rounded-2xl p-3 transition hover:border-[#f97316]/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
              <div className="flex min-w-0 items-center gap-3 sm:flex-1 sm:gap-4">
                {p.image ? <ProjectImage src={p.image} alt="" className="size-[72px] shrink-0 rounded-xl border border-line bg-surface-2 object-cover sm:size-16" /> : <div className="grid size-[72px] shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-blue sm:size-16"><FolderKanban className="size-6" aria-hidden /></div>}
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2"><p className="truncate font-heading text-sm font-bold text-foreground sm:text-[15px]">{p.title}</p><span className={`hidden shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold sm:inline-flex ${p.published ? "bg-blue/10 text-blue" : "bg-surface-2 text-muted-foreground"}`}>{p.published ? "Publié" : "Brouillon"}</span></div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:truncate">{p.description}</p>
                  <p className="mt-1 truncate text-[10px] text-muted-foreground/80">{p.client || "Projet ARIA"} · {p.status === "COMPLETED" ? "Terminé" : p.status === "IN_PROGRESS" ? "En cours" : "En attente"}</p>
                </div>
              </div>
              <div className="grid w-full grid-cols-2 gap-2 border-t border-line pt-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-end sm:gap-2 sm:border-0 sm:pt-0">
                <button
                  type="button"
                  onClick={() => onOpenDetail(p.id)}
                  aria-label={`Voir ${p.title}`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground sm:size-9 sm:min-h-0 sm:px-0"
                >
                  <Eye className="size-4 sm:size-3.5" /><span className="sm:hidden">Détails</span>
                </button>
                <button
                  type="button"
                  onClick={() => edit(p)}
                  aria-label={`Modifier ${p.title}`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground sm:size-9 sm:min-h-0 sm:px-0"
                >
                  <Pencil className="size-4 sm:size-3.5" /><span className="sm:hidden">Modifier</span>
                </button>
                <select
                  value={p.status}
                  onChange={(e) => setStatus(p, e.target.value as Project["status"])}
                  aria-label={`Statut de ${p.title}`}
                  className="min-h-10 min-w-0 rounded-lg border border-line bg-surface-1 px-2.5 py-1.5 text-xs text-foreground sm:min-h-9"
                >
                  <option value="PENDING">En attente</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="COMPLETED">Terminé</option>
                </select>
                <button
                  type="button"
                  onClick={() => togglePublish(p)}
                  aria-label={p.published ? `Dépublier ${p.title}` : `Publier ${p.title}`}
                  className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors sm:min-h-9 ${
                    p.published
                      ? "border-blue/40 bg-blue/10 text-blue"
                      : "border-line text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  {p.published ? "Publié" : "Brouillon"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(p)}
                  aria-label="Supprimer"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line text-muted-foreground transition-colors hover:border-coral/50 hover:text-coral sm:size-9 sm:min-h-0"
                >
                  <Trash2 className="size-4 sm:size-3.5" /><span className="sm:hidden text-xs font-semibold">Supprimer</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {deleteTarget && <ConfirmDeleteModal label={deleteTarget.title} onCancel={() => setDeleteTarget(null)} onConfirm={async () => { await remove(deleteTarget); setDeleteTarget(null); }} />}
    </div>
  );
}

/* ============================================================
   Messages de contact
   ============================================================ */
function MessagesPanel({ onOpenDetail }: { onOpenDetail: (id: string) => void }) {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    contactApi
      .list()
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const setStatus = async (m: ContactMessage, status: ContactMessage["status"]) => {
    try {
      await contactApi.updateStatus(m.id, status);
      load();
    } catch {
      throw new Error("Impossible de supprimer ce message. Réessayez.");
    }
  };

  const remove = async (m: ContactMessage) => {
    try {
      await contactApi.remove(m.id);
      load();
    } catch {
      throw new Error("Impossible de supprimer ce message. Réessayez.");
    }
  };

  if (loading) return <Panel>Chargement…</Panel>;
  if (items.length === 0) return <Panel>Aucun message pour le moment.</Panel>;

  return (
    <div>
    <ul className="space-y-3">
      {items.map((m) => (
        <li key={m.id} role="button" tabIndex={0} aria-label={`Ouvrir le détail du message de ${m.name}`} onClick={(event) => activateCard(event, () => onOpenDetail(m.id))} onKeyDown={(event) => activateCardKey(event, () => onOpenDetail(m.id))} className="card-glass cursor-pointer rounded-2xl p-5 transition hover:border-[#f97316]/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-heading text-sm font-bold text-foreground">
                {m.name}
                {m.company && <span className="ml-2 text-xs font-normal text-muted-foreground">· {m.company}</span>}
                {m.status === "NEW" && (
                  <span className="ml-2 rounded-full border border-blue/40 bg-blue/10 px-2 py-0.5 font-mono text-[10px] uppercase text-blue">
                    Nouveau
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <a href={`mailto:${m.email}`} className="hover:text-blue">
                  {m.email}
                </a>
                {m.phone && <> · {m.phone}</>}
                {m.country && <> · {m.country}</>}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {m.message}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <button type="button" onClick={() => onOpenDetail(m.id)} className="btn-ghost min-h-8! px-3! py-1!.5 text-xs!"><Eye className="size-3.5"/>Détails</button>
              {m.status !== "READ" && (
                <button type="button" onClick={() => setStatus(m, "READ")} className="btn-ghost min-h-8! px-3! py-1!.5 text-xs!">
                  <CheckCircle2 className="size-3.5" /> Lu
                </button>
              )}
              {m.status !== "HANDLED" && (
                <button type="button" onClick={() => setStatus(m, "HANDLED")} className="btn-ghost min-h-8! px-3! py-1!.5 text-xs!">
                  <Circle className="size-3.5" /> Traité
                </button>
              )}
              <button
                type="button"
                onClick={() => setDeleteTarget(m)}
                className="btn-ghost min-h-8! px-3! py-1!.5 text-xs! hover:!text-coral"
              >
                <Trash2 className="size-3.5" /> Suppr.
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
    {deleteTarget && <ConfirmDeleteModal label={`le message de ${deleteTarget.name}`} onCancel={() => setDeleteTarget(null)} onConfirm={async () => { await remove(deleteTarget); setDeleteTarget(null); }} />}
    </div>
  );
}

/* ============================================================
   Demandes de devis
   ============================================================ */
function QuotesPanel({ onOpenDetail }: { onOpenDetail: (id: string) => void }) {
  const [items, setItems] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<QuoteRequest | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    quotesApi
      .list()
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const setStatus = async (q: QuoteRequest, status: QuoteRequest["status"]) => {
    try {
      await quotesApi.updateStatus(q.id, status);
      load();
    } catch {
      throw new Error("Impossible de supprimer cette question. Réessayez.");
    }
  };

  const remove = async (q: QuoteRequest) => {
    try {
      await quotesApi.remove(q.id);
      load();
    } catch {
      throw new Error("Impossible de supprimer cette demande de devis. Réessayez.");
    }
  };

  if (loading) return <Panel>Chargement…</Panel>;
  if (items.length === 0) return <Panel>Aucune demande de devis.</Panel>;

  const STATUS_LABEL: Record<QuoteRequest["status"], string> = {
    NEW: "Nouveau",
    CONTACTED: "Contacté",
    PROPOSAL_SENT: "Proposition envoyée",
    CLOSED: "Clos",
  };

  return (
    <div>
    <ul className="space-y-3">
      {items.map((q) => (
        <li key={q.id} role="button" tabIndex={0} aria-label={`Ouvrir le détail du devis de ${q.name}`} onClick={(event) => activateCard(event, () => onOpenDetail(q.id))} onKeyDown={(event) => activateCardKey(event, () => onOpenDetail(q.id))} className="card-glass cursor-pointer rounded-2xl p-5 transition hover:border-[#f97316]/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <button type="button" onClick={() => onOpenDetail(q.id)} className="text-left font-heading text-sm font-bold text-foreground hover:text-blue">
                {q.name}
                <span className="ml-2 rounded-full border border-blue/40 bg-blue/10 px-2 py-0.5 font-mono text-[10px] uppercase text-blue">
                  {q.service}
                </span>
              </button>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {q.status !== "NEW" && (
                  <span className="font-mono uppercase">
                    {STATUS_LABEL[q.status]}
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <a href={`mailto:${q.email}`} className="hover:text-blue">
                  {q.email}
                </a>
                {q.company && <> · {q.company}</>}
                {q.phone && <> · {q.phone}</>}
              </p>
              {(q.projectDescription || q.message) && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {q.projectDescription || q.message}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <select
                value={q.status}
                onChange={(e) => setStatus(q, e.target.value as QuoteRequest["status"])}
                className="rounded-lg border border-line bg-surface-1 px-2.5 py-1.5 text-xs text-foreground"
              >
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setDeleteTarget(q)}
                className="btn-ghost min-h-8! px-3! py-1!.5 text-xs! hover:!text-coral"
              >
                <Trash2 className="size-3.5" /> Supprimer
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
    {deleteTarget && <ConfirmDeleteModal label={`la demande de devis de ${deleteTarget.name}`} onCancel={() => setDeleteTarget(null)} onConfirm={async () => { await remove(deleteTarget); setDeleteTarget(null); }} />}
    </div>
  );
}

/* ============================================================
   FAQ
   ============================================================ */
function FaqPanel({ onOpenDetail }: { onOpenDetail: (id: string) => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    faqApi
      .listAll()
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  useEffect(() => {
    const editId = searchParams.get("edit");
    const item = items.find((faq) => faq.id === editId);
    if (item) { setEditing(item.id); setForm({ question: item.question, answer: item.answer }); setModalOpen(true); }
  }, [items, searchParams]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    try {
      if (editing) await faqApi.update(editing, form);
      else await faqApi.create(form);
      setForm({ question: "", answer: "" });
      setEditing(null);
      setModalOpen(false);
      if (searchParams.has("edit")) setSearchParams({ section: "faq" }, { replace: true });
      load();
    } catch {
      /* silencieux */
    } finally { setSaving(false); }
  };

  const toggle = async (f: Faq) => {
    try {
      await faqApi.update(f.id, { published: !f.published });
      load();
    } catch {
      /* silencieux */
    }
  };

  const remove = async (f: Faq) => {
    try {
      await faqApi.remove(f.id);
      load();
    } catch {
      throw new Error("Impossible de supprimer cette question. Réessayez.");
    }
  };

  return (
    <div>
      <div className="mb-5 flex justify-end"><button type="button" onClick={() => { setEditing(null); setForm({ question: "", answer: "" }); setModalOpen(true); }} className="btn-primary"><Plus className="size-4"/>Ajouter une question</button></div>
      {modalOpen && <AdminModal title={editing ? "Modifier la question" : "Ajouter une question"} onClose={() => { setModalOpen(false); setEditing(null); setForm({ question: "", answer: "" }); if (searchParams.has("edit")) setSearchParams({ section: "faq" }, { replace: true }); }}>
      <form onSubmit={save} className="space-y-3">
        <h2 className="font-heading text-base font-bold text-[#252b32]">{editing ? "Modifier la question" : "Ajouter une question"}</h2>
        <input
          required
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          className="field"
        />
        <textarea
          required
          rows={3}
          placeholder="Réponse"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          className="field resize-y"
        />
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {editing ? <Pencil className="size-4" /> : <Plus className="size-4" />} {saving ? "Enregistrement…" : editing ? "Enregistrer" : "Ajouter"}
        </button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ question: "", answer: "" }); }} className="btn-ghost ml-2">Annuler</button>}
      </form>
      </AdminModal>}

      {loading ? (
        <Panel>Chargement…</Panel>
      ) : items.length === 0 ? (
        <Panel>Aucune question.</Panel>
      ) : (
        <ul className="space-y-3">
          {items.map((f) => (
            <li key={f.id} role="button" tabIndex={0} aria-label={`Ouvrir le détail de la question : ${f.question}`} onClick={(event) => activateCard(event, () => onOpenDetail(f.id))} onKeyDown={(event) => activateCardKey(event, () => onOpenDetail(f.id))} className="cursor-pointer rounded-2xl border border-[#e8eaed] bg-white p-4 transition hover:border-[#f97316]/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading text-sm font-bold text-foreground">{f.question}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{f.answer}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link to={`/admin/dashboard?section=faq&edit=${f.id}`} aria-label={`Modifier ${f.question}`} className="grid size-9 place-items-center rounded-lg border border-[#e6e8eb] text-[#737c87] hover:text-[#d85d10]"><Pencil className="size-3.5" /></Link>
                  <button type="button" onClick={() => onOpenDetail(f.id)} aria-label={`Détails ${f.question}`} className="grid size-9 place-items-center rounded-lg border border-[#e6e8eb] text-[#737c87] hover:text-[#303740]"><Eye className="size-3.5" /></button>
                  <button
                    type="button"
                    onClick={() => toggle(f)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs ${
                      f.published ? "border-blue/40 bg-blue/10 text-blue" : "border-line text-muted-foreground"
                    }`}
                  >
                    {f.published ? "Publié" : "Masqué"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(f)}
                    aria-label="Supprimer"
                    className="grid size-8 place-items-center rounded-lg border border-line text-muted-foreground hover:border-coral/50 hover:text-coral"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {deleteTarget && <ConfirmDeleteModal label={`la question « ${deleteTarget.question} »`} onCancel={() => setDeleteTarget(null)} onConfirm={async () => { await remove(deleteTarget); setDeleteTarget(null); }} />}
    </div>
  );
}

/* ============================================================
   Base de connaissances du chatbot
   ============================================================ */
function KnowledgePanel({ onOpenDetail }: { onOpenDetail: (id: string) => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: "services", question: "", answer: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Knowledge | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    knowledgeApi
      .list()
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  useEffect(() => {
    const editId = searchParams.get("edit");
    const item = items.find((entry) => entry.id === editId);
    if (item) { setEditing(item.id); setForm({ category: item.category, question: item.question, answer: item.answer }); setModalOpen(true); }
  }, [items, searchParams]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    try {
      if (editing) await knowledgeApi.update(editing, form);
      else await knowledgeApi.create({ ...form, active: true });
      setForm({ category: "services", question: "", answer: "" });
      setEditing(null);
      setModalOpen(false);
      if (searchParams.has("edit")) setSearchParams({ section: "knowledge" }, { replace: true });
      load();
    } catch {
      /* silencieux */
    } finally { setSaving(false); }
  };

  const toggle = async (k: Knowledge) => {
    try {
      await knowledgeApi.update(k.id, { active: !k.active });
      load();
    } catch {
      /* silencieux */
    }
  };

  const remove = async (k: Knowledge) => {
    try {
      await knowledgeApi.remove(k.id);
      load();
    } catch {
      throw new Error("Impossible de supprimer cette entrée. Réessayez.");
    }
  };

  const CATEGORIES = ["services", "tarifs", "process", "equipe", "contacts", "faq"];

  return (
    <div>
      <div className="mb-4 rounded-xl border border-line bg-blue/[0.06] p-4 text-xs leading-relaxed text-muted-foreground">
        Cette base alimente le chatbot IA. Ajoutez des questions/réponses sur ARIA — elles seront
        injectées dans le prompt système de l'assistant, sans redéploiement.
      </div>

      <div className="mb-5 flex justify-end"><button type="button" onClick={() => { setEditing(null); setForm({ category: "services", question: "", answer: "" }); setModalOpen(true); }} className="btn-primary"><Plus className="size-4"/>Ajouter une entrée</button></div>
      {modalOpen && <AdminModal title={editing ? "Modifier l’entrée" : "Ajouter une entrée"} onClose={() => { setModalOpen(false); setEditing(null); setForm({ category: "services", question: "", answer: "" }); if (searchParams.has("edit")) setSearchParams({ section: "knowledge" }, { replace: true }); }}>
      <form onSubmit={save} className="space-y-3">
        <h2 className="font-heading text-base font-bold text-[#252b32]">{editing ? "Modifier l’entrée" : "Ajouter une entrée"}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="field"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            required
            placeholder="Question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="field sm:col-span-2"
          />
        </div>
        <textarea
          required
          rows={3}
          placeholder="Réponse"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          className="field resize-y"
        />
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {editing ? <Pencil className="size-4" /> : <Plus className="size-4" />} {saving ? "Enregistrement…" : editing ? "Enregistrer" : "Ajouter"}
        </button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ category: "services", question: "", answer: "" }); }} className="btn-ghost ml-2">Annuler</button>}
      </form>
      </AdminModal>}

      {loading ? (
        <Panel>Chargement…</Panel>
      ) : items.length === 0 ? (
        <Panel>Aucune entrée dans la base de connaissances.</Panel>
      ) : (
        <ul className="space-y-3">
          {items.map((k) => (
            <li key={k.id} role="button" tabIndex={0} aria-label={`Ouvrir le détail de l’entrée : ${k.question}`} onClick={(event) => activateCard(event, () => onOpenDetail(k.id))} onKeyDown={(event) => activateCardKey(event, () => onOpenDetail(k.id))} className="cursor-pointer rounded-2xl border border-[#e8eaed] bg-white p-4 transition hover:border-[#f97316]/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-blue">
                    {k.category}
                  </p>
                  <p className="mt-1 font-heading text-sm font-bold text-foreground">
                    {k.question}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{k.answer}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link to={`/admin/dashboard?section=knowledge&edit=${k.id}`} aria-label={`Modifier ${k.question}`} className="grid size-9 place-items-center rounded-lg border border-[#e6e8eb] text-[#737c87] hover:text-[#d85d10]"><Pencil className="size-3.5" /></Link>
                  <button type="button" onClick={() => onOpenDetail(k.id)} aria-label={`Détails ${k.question}`} className="grid size-9 place-items-center rounded-lg border border-[#e6e8eb] text-[#737c87] hover:text-[#303740]"><Eye className="size-3.5" /></button>
                  <button
                    type="button"
                    onClick={() => toggle(k)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs ${
                      k.active ? "border-blue/40 bg-blue/10 text-blue" : "border-line text-muted-foreground"
                    }`}
                  >
                    {k.active ? "Actif" : "Inactif"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(k)}
                    aria-label="Supprimer"
                    className="grid size-8 place-items-center rounded-lg border border-line text-muted-foreground hover:border-coral/50 hover:text-coral"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {deleteTarget && <ConfirmDeleteModal label={`l’entrée « ${deleteTarget.question} »`} onCancel={() => setDeleteTarget(null)} onConfirm={async () => { await remove(deleteTarget); setDeleteTarget(null); }} />}
    </div>
  );
}

/* ============================================================
   Utilitaire
   ============================================================ */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[30vh] place-items-center rounded-xl border border-line bg-card p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function activateCard(event: React.MouseEvent<HTMLElement>, open: () => void) {
  if ((event.target as HTMLElement).closest("button, a, input, select, textarea")) return;
  open();
}

function activateCardKey(event: React.KeyboardEvent<HTMLElement>, open: () => void) {
  if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  open();
}

function AdminModal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#18212b]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-label={title} className="flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-[#e5e8eb] bg-white shadow-[0_24px_80px_rgba(20,30,40,.22)] sm:max-h-[90dvh] sm:rounded-2xl">
        <header className="flex shrink-0 items-center justify-between border-b border-[#eceef0] px-5 py-4 sm:px-7"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#9aa1aa]">ARIA · Administration</p><h2 className="mt-1 font-heading text-lg font-bold text-[#252b32]">{title}</h2></div><button type="button" autoFocus onClick={onClose} aria-label="Fermer la fenêtre" className="grid size-10 place-items-center rounded-xl text-xl text-[#7d8690] hover:bg-[#f3f4f6]">×</button></header>
        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">{children}</div>
      </section>
    </div>
  );
}

function ConfirmDeleteModal({ label, onCancel, onConfirm }: { label: string; onCancel: () => void; onConfirm: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape" && !busy) onCancel(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [busy, onCancel]);

  const confirm = async () => {
    setBusy(true);
    setError("");
    try { await onConfirm(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "La suppression a échoué. Réessayez."); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-[#18212b]/55 p-4 backdrop-blur-[3px]" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description" className="w-full max-w-md rounded-2xl border border-[#e3e6e9] bg-white p-6 shadow-[0_24px_80px_rgba(20,30,40,.28)] sm:p-7">
        <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"><Trash2 className="size-5" aria-hidden/></div>
        <h2 id="delete-dialog-title" className="font-heading text-xl font-extrabold text-[#20252b]">Confirmer la suppression</h2>
        <p id="delete-dialog-description" className="mt-2 text-sm leading-6 text-[#626c77]">Voulez-vous vraiment supprimer {label} ? Cette action est définitive.</p>
        {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" disabled={busy} onClick={onCancel} className="min-h-11 rounded-xl border border-[#dfe3e7] px-4 text-sm font-semibold text-[#626c77] hover:bg-[#f5f6f8] disabled:opacity-50">Annuler</button><button type="button" disabled={busy} onClick={() => void confirm()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#dc3e3e] px-4 text-sm font-bold text-white transition hover:bg-[#c93434] disabled:opacity-60">{busy ? "Suppression…" : <><Trash2 className="size-4"/>Supprimer</>}</button></div>
      </section>
    </div>
  );
}
