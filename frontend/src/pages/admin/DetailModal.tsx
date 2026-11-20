import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Pencil, X } from "lucide-react";
import { contactApi, faqApi, knowledgeApi, projectsApi, quotesApi } from "@/lib/api";
import type { ContactMessage, Faq, Knowledge, Project, QuoteRequest } from "@/types";

export type AdminDetailKind = "project" | "message" | "quote" | "faq" | "knowledge";

type RecordType = Project | ContactMessage | QuoteRequest | Faq | Knowledge;

export default function DetailModal({ kind, id, onClose, onEdit }: {
  kind: AdminDetailKind;
  id: string;
  onClose: () => void;
  onEdit: (kind: AdminDetailKind, id: string) => void;
}) {
  const [record, setRecord] = useState<RecordType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(""); setRecord(null);
    const load = async (): Promise<RecordType> => {
      if (kind === "project") return projectsApi.byId(id);
      if (kind === "quote") return quotesApi.byId(id);
      if (kind === "message") return (await contactApi.list()).items.find((item) => item.id === id) ?? Promise.reject(new Error("Message introuvable."));
      if (kind === "faq") return (await faqApi.listAll()).items.find((item) => item.id === id) ?? Promise.reject(new Error("Question fréquente introuvable."));
      return (await knowledgeApi.list()).items.find((item) => item.id === id) ?? Promise.reject(new Error("Entrée chatbot introuvable."));
    };
    void load().then((item) => { if (!cancelled) setRecord(item); }).catch((reason: unknown) => {
      if (!cancelled) setError(reason instanceof Error ? reason.message : "Impossible de charger ce détail.");
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [kind, id]);

  const setStatus = async (status: string) => {
    if (!record) return;
    setSaving(true); setError("");
    try {
      if (kind === "message") setRecord(await contactApi.updateStatus(id, status as ContactMessage["status"]));
      if (kind === "quote") setRecord(await quotesApi.updateStatus(id, status as QuoteRequest["status"]));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Impossible de modifier le statut."); }
    finally { setSaving(false); }
  };

  const title = kind === "project" ? "Détail de la réalisation" : kind === "message" ? "Détail du message" : kind === "quote" ? "Détail de la demande de devis" : kind === "faq" ? "Détail de la question" : "Détail de l’entrée chatbot";

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-[#18212b]/50 p-0 backdrop-blur-[3px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-label={title} className="flex max-h-[96dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-[#e5e8eb] bg-[#f7f8fa] shadow-[0_24px_80px_rgba(20,30,40,.24)] sm:max-h-[92dvh] sm:rounded-2xl">
        <header className="flex shrink-0 items-center justify-between border-b border-[#e8eaed] bg-white px-5 py-4 sm:px-7"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#9aa1aa]">ARIA · Administration</p><h2 className="mt-1 font-heading text-lg font-bold text-[#252b32]">{title}</h2></div><button type="button" autoFocus onClick={onClose} aria-label="Fermer les détails" className="grid size-10 place-items-center rounded-xl text-[#737c87] hover:bg-[#f2f4f6]"><X className="size-5"/></button></header>
        <div className="overflow-y-auto p-4 sm:p-7">
          {loading ? <div className="grid min-h-48 place-items-center text-sm text-[#737c87]"><span className="inline-flex items-center gap-2"><Loader2 className="size-4 animate-spin"/>Chargement du détail…</span></div> : error && !record ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : record && <>
            {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <DetailContent kind={kind} record={record} saving={saving} onStatus={(value) => void setStatus(value)} onEdit={() => onEdit(kind, id)}/>
          </>}
        </div>
      </section>
    </div>
  );
}

function DetailContent({ kind, record, saving, onStatus, onEdit }: {
  kind: AdminDetailKind; record: RecordType; saving: boolean; onStatus: (status: string) => void; onEdit: () => void;
}) {
  if (kind === "project") {
    const p = record as Project;
    return <div className="space-y-4"><Top title={p.title} subtitle={`/${p.slug}`} status={`${p.status === "COMPLETED" ? "Terminé" : p.status === "IN_PROGRESS" ? "En cours" : "En attente"} · ${p.published ? "Publié" : "Brouillon"}`} onEdit={onEdit}/>{p.image && <img src={p.image} alt={p.title} className="max-h-72 w-full rounded-2xl bg-white object-cover"/>}<div className="grid gap-4 md:grid-cols-[1.5fr_1fr]"><Card title="Description"><p className="whitespace-pre-wrap text-sm leading-6 text-[#59626d]">{p.description}</p>{p.fullDescription && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#59626d]">{p.fullDescription}</p>}</Card><Card title="Informations"><Pairs rows={[["Client", p.client], ["Durée", p.duration], ["Objectif", p.objective], ["Technologies", p.technologies.join(", ")], ["Site", p.url]]}/></Card></div>{p.goals.length > 0 && <ListCard title="Objectifs" items={p.goals}/ >}{p.solutions.length > 0 && <ListCard title="Solutions" items={p.solutions}/ >}{Boolean(p.caseStudyExcerpt || p.caseStudyChallenge || p.caseStudyApproach || p.caseStudyResults.length || p.caseStudyServices.length) && <Card title="Étude de cas"><Pairs rows={[["Résumé", p.caseStudyExcerpt], ["Défi", p.caseStudyChallenge], ["Approche", p.caseStudyApproach], ["Résultats", p.caseStudyResults.join(" · ")], ["Services", p.caseStudyServices.join(" · ")]]}/></Card>}{p.url && <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#e4e7ea] bg-white px-4 text-sm font-semibold text-[#57616b]">Visiter le site<ExternalLink className="size-4"/></a>}</div>;
  }
  if (kind === "message") {
    const m = record as ContactMessage;
    return <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]"><Card title={m.name}><p className="whitespace-pre-wrap text-sm leading-7 text-[#59626d]">{m.message}</p><p className="mt-5 text-xs text-[#939ba4]">Reçu le {date(m.createdAt)}</p></Card><Card title="Coordonnées"><Pairs rows={[["Email", m.email], ["Téléphone", m.phone], ["Entreprise", m.company], ["Pays", m.country]]}/><label className="mt-5 block text-xs font-semibold text-[#79828c]" htmlFor="detail-message-status">État du suivi</label><select id="detail-message-status" disabled={saving} value={m.status} onChange={(event) => onStatus(event.target.value)} className="field mt-2"><option value="NEW">Nouveau</option><option value="READ">Lu</option><option value="HANDLED">Traité</option></select></Card></div>;
  }
  if (kind === "quote") {
    const q = record as QuoteRequest;
    return <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]"><Card title={q.name}><Pairs rows={[["Service", q.service], ["Description du projet", q.projectDescription], ["Précisions", q.message], ["Langues", q.languages], ["Volume", q.teamSize]]}/></Card><Card title="Coordonnées"><Pairs rows={[["Email", q.email], ["Téléphone", q.phone], ["Entreprise", q.company], ["Pays", q.country], ["Reçue le", date(q.createdAt)]]}/><label className="mt-5 block text-xs font-semibold text-[#79828c]" htmlFor="detail-quote-status">État du suivi</label><select id="detail-quote-status" disabled={saving} value={q.status} onChange={(event) => onStatus(event.target.value)} className="field mt-2"><option value="NEW">Nouveau</option><option value="CONTACTED">Contacté</option><option value="PROPOSAL_SENT">Proposition envoyée</option><option value="CLOSED">Clos</option></select></Card></div>;
  }
  if (kind === "faq") {
    const f = record as Faq;
    return <div className="space-y-4"><Top title={f.question} status={`${f.published ? "Publiée" : "Masquée"} · ${f.category || "Générale"}`} onEdit={onEdit}/><Card title="Réponse"><p className="whitespace-pre-wrap text-sm leading-7 text-[#59626d]">{f.answer}</p><p className="mt-5 text-xs text-[#8e97a1]">Ordre d’affichage : {f.order}</p></Card></div>;
  }
  const k = record as Knowledge;
  return <div className="space-y-4"><Top title={k.question} status={`${k.active ? "Active" : "Inactive"} · ${k.category}`} onEdit={onEdit}/><Card title="Réponse du chatbot"><p className="whitespace-pre-wrap text-sm leading-7 text-[#59626d]">{k.answer}</p><p className="mt-5 text-xs text-[#8e97a1]">Modifiée le {date(k.updatedAt)}</p></Card></div>;
}

function Top({ title, subtitle, status, onEdit }: { title: string; subtitle?: string; status: string; onEdit: () => void }) {
  return <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-[#e7e9ec] bg-white p-5 sm:p-6"><div className="min-w-0"><h3 className="break-words font-heading text-xl font-extrabold text-[#252b32]">{title}</h3>{subtitle && <p className="mt-1 text-sm text-[#8a929c]">{subtitle}</p>}<span className="mt-3 inline-flex rounded-full bg-[#f3f5f7] px-3 py-1 text-xs font-medium text-[#68717b]">{status}</span></div><button type="button" onClick={onEdit} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-[#f97316] px-3 text-sm font-bold text-white hover:bg-[#e7660d]"><Pencil className="size-4"/>Modifier</button></div>;
}
function Card({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-[#e7e9ec] bg-white p-5"><h3 className="mb-3 font-heading text-sm font-bold text-[#303740]">{title}</h3>{children}</section>; }
function Pairs({ rows }: { rows: [string, string | null | undefined][] }) { return <dl className="space-y-3">{rows.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt className="text-[11px] font-semibold uppercase tracking-wide text-[#929aa3]">{label}</dt><dd className="mt-1 break-words whitespace-pre-wrap text-sm leading-6 text-[#59626d]">{value}</dd></div>)}</dl>; }
function ListCard({ title, items }: { title: string; items: string[] }) { return <Card title={title}><ul className="list-inside list-disc space-y-1 text-sm leading-6 text-[#59626d]">{items.map((item) => <li key={item}>{item}</li>)}</ul></Card>; }
function date(value: string) { return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short" }).format(new Date(value)); }
