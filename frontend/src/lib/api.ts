/* ============================================================
   Client API typé — frontend → Express
   - Cookies httpOnly envoyés automatiquement (credentials: include)
   - Erreurs normalisées en ApiError
   ============================================================ */

import type {
  ApiError,
  ApiList,
  ContactMessage,
  ContactMessageInput,
  DashboardStats,
  Faq,
  Knowledge,
  KnowledgeInput,
  LoginResponse,
  Project,
  ProjectInput,
  QuoteRequest,
  QuoteRequestInput,
  User,
} from "@/types";
import { upload as uploadToBlob } from "@vercel/blob/client";

const BASE = "/api";

class ApiRequestError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!res.ok) {
    const err = (body ?? {}) as Partial<ApiError>;
    throw new ApiRequestError(
      res.status,
      err.message ?? `Erreur ${res.status}`,
      err.errors,
    );
  }

  return body as T;
}

const get = <T,>(path: string) => request<T>(path);
const post = <T,>(path: string, data?: unknown) =>
  request<T>(path, { method: "POST", body: data === undefined ? undefined : JSON.stringify(data) });
const put = <T,>(path: string, data: unknown) =>
  request<T>(path, { method: "PUT", body: JSON.stringify(data) });
const patch = <T,>(path: string, data: unknown) =>
  request<T>(path, { method: "PATCH", body: JSON.stringify(data) });
const del = <T,>(path: string) => request<T>(path, { method: "DELETE" });

const translationRequests = new Map<string, Promise<string>>();
let translationQueue: Promise<void> = Promise.resolve();

function translationCacheKey(locale: string, texts: string[]): string {
  const value = JSON.stringify([locale, texts]);
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let i = 0; i < value.length; i++) {
    first = Math.imul(first ^ value.charCodeAt(i), 0x01000193);
    second = Math.imul(second ^ value.charCodeAt(i), 0x85ebca6b);
  }
  return `aria-translations-v1-${locale}-${(first >>> 0).toString(36)}-${(second >>> 0).toString(36)}`;
}

/** Traduit automatiquement le contenu et garde le résultat en cache dans le navigateur. */
export async function translateTexts(texts: string[], locale: "fr" | "en"): Promise<string[]> {
  if (locale === "fr" || texts.length === 0) return texts;

  const batchKey = translationCacheKey(locale, texts);
  try {
    const cached = window.localStorage.getItem(batchKey);
    if (cached) {
      const parsed: unknown = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length === texts.length && parsed.every((x) => typeof x === "string")) {
        try {
          parsed.forEach((translation, index) => {
            window.localStorage.setItem(
              translationCacheKey(locale, [texts[index]]),
              JSON.stringify(translation),
            );
          });
        } catch {
          /* Le cache par lot reste exploitable si le navigateur n'accepte plus d'écriture. */
        }
        return parsed;
      }
    }
  } catch {
    /* Cache désactivé ou indisponible : consultation individuelle ou traduction réseau. */
  }

  const resolved = new Map<string, string>();
  const pending = new Map<string, Promise<string>>();
  const missing: { text: string; key: string }[] = [];

  for (const text of new Set(texts)) {
    const key = translationCacheKey(locale, [text]);
    try {
      const cached = window.localStorage.getItem(key);
      if (cached !== null) {
        const parsed: unknown = JSON.parse(cached);
        if (typeof parsed === "string") {
          resolved.set(text, parsed);
          continue;
        }
      }
    } catch {
      /* Cache désactivé ou entrée invalide : traduction réseau. */
    }

    const existing = translationRequests.get(key);
    if (existing) pending.set(text, existing);
    else missing.push({ text, key });
  }

  const batches: { text: string; key: string }[][] = [];
  let batch: { text: string; key: string }[] = [];
  let batchChars = 0;
  for (const item of missing) {
    if (batch.length > 0 && (batch.length >= 80 || batchChars + item.text.length > 8_000)) {
      batches.push(batch);
      batch = [];
      batchChars = 0;
    }
    batch.push(item);
    batchChars += item.text.length;
  }
  if (batch.length > 0) batches.push(batch);

  for (const items of batches) {
    const batchTexts = items.map(({ text }) => text);
    const requestPromise = translationQueue.then(async () => {
      const { translations } = await post<{ translations: string[] }>("/translations", {
        locale,
        texts: batchTexts,
      });
      if (!Array.isArray(translations) || translations.length !== batchTexts.length) {
        throw new Error("Réponse de traduction incomplète");
      }
      try {
        translations.forEach((translation, index) => {
          window.localStorage.setItem(
            items[index].key,
            JSON.stringify(translation),
          );
        });
      } catch {
        /* Les traductions restent utilisables sans cache. */
      }
      return translations;
    });
    translationQueue = requestPromise.then(() => undefined, () => undefined);

    items.forEach(({ text, key }, index) => {
      const textPromise = requestPromise
        .then((translations) => translations[index])
        .finally(() => {
          if (translationRequests.get(key) === textPromise) {
            translationRequests.delete(key);
          }
        });
      translationRequests.set(key, textPromise);
      pending.set(text, textPromise);
    });
  }

  const translatedMissing = await Promise.all(
    [...pending].map(async ([text, promise]) => [text, await promise] as const),
  );
  for (const [text, translation] of translatedMissing) resolved.set(text, translation);
  const result = texts.map((text) => {
    const translation = resolved.get(text);
    if (translation === undefined) throw new Error("Traduction manquante pour un texte");
    return translation;
  });
  try {
    window.localStorage.setItem(batchKey, JSON.stringify(result));
  } catch {
    /* Les traductions restent utilisables sans cache. */
  }
  return result;
}

const PROJECT_TEXT_FIELDS = [
  "title",
  "description",
  "fullDescription",
  "objective",
  "client",
  "duration",
  "technologies",
  "goals",
  "solutions",
  "caseStudyExcerpt",
  "caseStudyChallenge",
  "caseStudyApproach",
  "caseStudyResults",
  "caseStudyServices",
] as const;

export async function translateProjectsContent(projects: Project[], locale: "fr" | "en"): Promise<Project[]> {
  if (locale === "fr" || projects.length === 0) return projects;
  const values: string[] = [];
  const descriptors = projects.map((project) => {
    const fields: { key: (typeof PROJECT_TEXT_FIELDS)[number]; array: boolean; length: number }[] = [];
    for (const key of PROJECT_TEXT_FIELDS) {
      const value = project[key];
      if (typeof value === "string") {
        if (value) {
          fields.push({ key, array: false, length: 1 });
          values.push(value);
        }
      } else if (Array.isArray(value) && value.length > 0) {
        fields.push({ key, array: true, length: value.length });
        values.push(...value);
      }
    }
    return fields;
  });
  if (values.length === 0) return projects;

  try {
    const translated = await translateTexts(values, locale);
    let cursor = 0;
    return projects.map((project, index) => {
      const result: Project = { ...project };
      for (const field of descriptors[index]) {
        if (field.array) {
          (result[field.key] as string[]) = translated.slice(cursor, cursor + field.length);
          cursor += field.length;
        } else {
          (result[field.key] as string | null) = translated[cursor++];
        }
      }
      return result;
    });
  } catch {
    return projects;
  }
}

type ProjectPreviewContent = Pick<
  Project,
  "title" | "description" | "client" | "technologies" | "caseStudyServices"
>;

export async function translateProjectPreviewsContent<T extends ProjectPreviewContent>(
  projects: T[],
  locale: "fr" | "en",
): Promise<T[]> {
  if (locale === "fr" || projects.length === 0) return projects;

  const values = projects.flatMap((project) => [
    project.title,
    project.description,
    ...(project.client ? [project.client] : []),
    ...project.technologies,
    ...project.caseStudyServices,
  ]);
  if (values.length === 0) return projects;

  try {
    const translated = await translateTexts(values, locale);
    let cursor = 0;
    return projects.map((project) => {
      const result: T = { ...project };
      result.title = translated[cursor++];
      result.description = translated[cursor++];
      if (project.client) result.client = translated[cursor++];
      result.technologies = translated.slice(cursor, cursor + project.technologies.length);
      cursor += project.technologies.length;
      result.caseStudyServices = translated.slice(cursor, cursor + project.caseStudyServices.length);
      cursor += project.caseStudyServices.length;
      return result;
    });
  } catch {
    return projects;
  }
}

export async function translateProjectContent(project: Project, locale: "fr" | "en"): Promise<Project> {
  return (await translateProjectsContent([project], locale))[0];
}

export async function translateFaqContent(items: Faq[], locale: "fr" | "en"): Promise<Faq[]> {
  if (locale === "fr" || items.length === 0) return items;
  const texts = items.flatMap((item) => [item.question, item.answer, item.category ?? ""]);
  try {
    const translated = await translateTexts(texts, locale);
    return items.map((item, index) => ({
      ...item,
      question: translated[index * 3],
      answer: translated[index * 3 + 1],
      category: item.category ? translated[index * 3 + 2] : item.category,
    }));
  } catch {
    return items;
  }
}

function normalizeProject(project: Project): Project {
  return {
    ...project,
    caseStudyExcerpt: project.caseStudyExcerpt ?? null,
    caseStudyChallenge: project.caseStudyChallenge ?? null,
    caseStudyApproach: project.caseStudyApproach ?? null,
    caseStudyResults: Array.isArray(project.caseStudyResults) ? project.caseStudyResults : [],
    caseStudyServices: Array.isArray(project.caseStudyServices) ? project.caseStudyServices : [],
  };
}

function normalizeProjectList(result: ApiList<Project>): ApiList<Project> {
  return { ...result, items: result.items.map(normalizeProject) };
}

/* ------------------------------------------------------------
   Auth
   ------------------------------------------------------------ */
export const authApi = {
  login: (email: string, password: string) =>
    post<LoginResponse>("/auth/login", { email, password }),
  logout: () => post<void>("/auth/logout"),
  me: () => get<User | null>("/auth/me"),
};

/* ------------------------------------------------------------
   Projets (public + admin)
   ------------------------------------------------------------ */
export const projectsApi = {
  listPublished: async (locale: "fr" | "en" = "fr") => {
    const result = normalizeProjectList(await get<ApiList<Project>>("/projects"));
    return locale === "fr" ? result : { ...result, items: await translateProjectsContent(result.items, locale) };
  },
  bySlug: async (slug: string, locale: "fr" | "en" = "fr") =>
    translateProjectContent(normalizeProject(await get<Project>(`/projects/${encodeURIComponent(slug)}`)), locale),
  /** --- admin --- */
  listAll: async () => normalizeProjectList(await get<ApiList<Project>>("/projects?all=true")),
  byId: async (id: string) => {
    try {
      return normalizeProject(await get<Project>(`/projects/admin/${encodeURIComponent(id)}`));
    } catch (error) {
      if (!(error instanceof ApiRequestError) || error.status !== 404) throw error;
      const { items } = await projectsApi.listAll();
      const project = items.find((item) => item.id === id);
      if (!project) throw error;
      return project;
    }
  },
  create: async (data: ProjectInput) => normalizeProject(await post<Project>("/projects", data)),
  update: (id: string, data: Partial<ProjectInput>) =>
    put<Project>(`/projects/${id}`, data).then(normalizeProject),
  remove: (id: string) => del<void>(`/projects/${id}`),
};

/* ------------------------------------------------------------
   Upload d'images
   ------------------------------------------------------------ */
export const uploadApi = {
  upload: async (file: File) => {
    if (import.meta.env.PROD) {
      const extensions: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/avif": "avif",
        "image/gif": "gif",
        "image/svg+xml": "svg",
      };
      const extension = extensions[file.type];
      if (!extension) throw new ApiRequestError(400, "Format d'image non autorisé");

      const blob = await uploadToBlob(
        `projects/${crypto.randomUUID()}.${extension}`,
        file,
        {
          access: "public",
          handleUploadUrl: `${BASE}/upload/client-token`,
          contentType: file.type,
        },
      );
      return { url: blob.url };
    }

    const data = new FormData();
    data.append("file", file);
    return request<{ url: string }>("/upload", {
      method: "POST",
      body: data,
      headers: {},
    });
  },
};

/* ------------------------------------------------------------
   Messages de contact
   ------------------------------------------------------------ */
export const contactApi = {
  send: (data: ContactMessageInput) => post<{ ok: true }>("/contact", data),
  /** --- admin --- */
  list: () => get<ApiList<ContactMessage>>("/contact"),
  updateStatus: (id: string, status: ContactMessage["status"]) =>
    patch<ContactMessage>(`/contact/${id}`, { status }),
  remove: (id: string) => del<void>(`/contact/${id}`),
};

/* ------------------------------------------------------------
   Demandes de devis
   ------------------------------------------------------------ */
export const quotesApi = {
  create: (data: QuoteRequestInput) => post<{ ok: true }>("/quotes", data),
  /** --- admin --- */
  list: () => get<ApiList<QuoteRequest>>("/quotes"),
  byId: async (id: string) => {
    const { items } = await quotesApi.list();
    const quote = items.find((item) => item.id === id);
    if (!quote) throw new ApiRequestError(404, "Demande de devis introuvable");
    return quote;
  },
  updateStatus: (id: string, status: QuoteRequest["status"]) =>
    patch<QuoteRequest>(`/quotes/${id}`, { status }),
  remove: (id: string) => del<void>(`/quotes/${id}`),
};

/* ------------------------------------------------------------
   FAQ
   ------------------------------------------------------------ */
export const faqApi = {
  listPublished: async (locale: "fr" | "en" = "fr") => {
    const result = await get<ApiList<Faq>>("/faq");
    return locale === "fr" ? result : { ...result, items: await translateFaqContent(result.items, locale) };
  },
  /** --- admin --- */
  listAll: () => get<ApiList<Faq>>("/faq?all=true"),
  create: (data: { question: string; answer: string; category?: string | null }) =>
    post<Faq>("/faq", data),
  update: (id: string, data: Partial<{ question: string; answer: string; category: string | null; published: boolean; order: number }>) =>
    put<Faq>(`/faq/${id}`, data),
  remove: (id: string) => del<void>(`/faq/${id}`),
};

/* ------------------------------------------------------------
   Base de connaissances du chatbot
   ------------------------------------------------------------ */
export const knowledgeApi = {
  list: () => get<ApiList<Knowledge>>("/knowledge"),
  create: (data: KnowledgeInput) => post<Knowledge>("/knowledge", data),
  update: (id: string, data: Partial<KnowledgeInput>) =>
    put<Knowledge>(`/knowledge/${id}`, data),
  remove: (id: string) => del<void>(`/knowledge/${id}`),
};

/* ------------------------------------------------------------
   Chat — proxy Groq côté serveur
   ------------------------------------------------------------ */
export const chatApi = {
  send: (messages: { role: "user" | "assistant"; content: string }[], locale: "fr" | "en" = "fr") =>
    post<{ reply: string; fallback?: boolean }>("/chat", { messages, locale }),
};

/* ------------------------------------------------------------
   Dashboard
   ------------------------------------------------------------ */
export const dashboardApi = {
  stats: () => get<DashboardStats>("/dashboard/stats"),
};

export { ApiRequestError };
