/* ============================================================
   Types partagés — miroir du schéma Prisma (backend)
   ============================================================ */

/** Statut d'un projet / réalisation */
export type ProjectStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

/** Rôle d'utilisateur admin */
export type UserRole = "ADMIN" | "EDITOR";

/** Statut d'un message entrant */
export type MessageStatus = "NEW" | "READ" | "HANDLED";

/** Statut d'une demande de devis */
export type QuoteStatus = "NEW" | "CONTACTED" | "PROPOSAL_SENT" | "CLOSED";

/* ------------------------------------------------------------
   Auth
   ------------------------------------------------------------ */
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
}

/* ------------------------------------------------------------
   Projets / Réalisations
   ------------------------------------------------------------ */
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Description complète affichée sur la page détail */
  fullDescription: string | null;
  objective: string | null;
  client: string | null;
  duration: string | null;
  status: ProjectStatus;
  /** URL du site client, le cas échéant */
  url: string | null;
  /** Technologies, format JSON côté Prisma */
  technologies: string[];
  /** Objectifs clés (liste) */
  goals: string[];
  /** Solutions apportées (liste) */
  solutions: string[];
  /** Contexte et résultats du projet, intégrés à sa réalisation */
  caseStudyExcerpt: string | null;
  caseStudyChallenge: string | null;
  caseStudyApproach: string | null;
  caseStudyResults: string[];
  caseStudyServices: string[];
  /** URL de l'image (storage) */
  image: string | null;
  /** Publier sur le site public */
  published: boolean;
  /** Ordre d'affichage */
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Création / mise à jour : tout est optionnel sauf le titre */
export type ProjectInput = Partial<
  Omit<Project, "id" | "createdAt" | "updatedAt">
> & { title: string };

/* ------------------------------------------------------------
   Messages de contact
   ------------------------------------------------------------ */
export interface ContactMessage {
  id: string;
  name: string;
  company: string | null;
  email: string;
  country: string | null;
  phone: string | null;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

export type ContactMessageInput = Pick<
  ContactMessage,
  "name" | "email" | "message"
> &
  Partial<Pick<ContactMessage, "company" | "country" | "phone">>;

/* ------------------------------------------------------------
   Demandes de devis (formulaire multi-étapes)
   ------------------------------------------------------------ */
export interface QuoteRequest {
  id: string;
  /** Étape 1 — votre besoin */
  service: string;
  projectDescription: string | null;
  /** Ancien champ conservé pour les demandes historiques */
  teamSize: string | null;
  languages: string | null;
  /** Étape 3 — vos coordonnées */
  name: string;
  company: string | null;
  email: string;
  country: string | null;
  phone: string | null;
  message: string | null;
  status: QuoteStatus;
  createdAt: string;
}

export type QuoteRequestInput = Pick<QuoteRequest, "service" | "name" | "email"> &
  Partial<
    Pick<
      QuoteRequest,
      | "projectDescription"
      | "languages"
      | "company"
      | "country"
      | "phone"
      | "message"
    >
  >;

/* ------------------------------------------------------------
   FAQ
   ------------------------------------------------------------ */
export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  published: boolean;
}

/* ------------------------------------------------------------
   Base de connaissances du chatbot
   ------------------------------------------------------------ */
export interface Knowledge {
  id: string;
  category: string;
  question: string;
  answer: string;
  active: boolean;
  updatedAt: string;
}

export type KnowledgeInput = Pick<
  Knowledge,
  "category" | "question" | "answer"
> & { active?: boolean };

/* ------------------------------------------------------------
   Chat
   ------------------------------------------------------------ */
export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatResponse {
  reply: string;
  /** true si la réponse vient des règles de secours (IA indisponible) */
  fallback?: boolean;
}

/* ------------------------------------------------------------
   Statistiques du dashboard
   ------------------------------------------------------------ */
export interface DashboardStats {
  projectsTotal: number;
  projectsCompleted: number;
  projectsInProgress: number;
  messagesTotal: number;
  messagesNew: number;
  quotesTotal: number;
  quotesNew: number;
}

/* ------------------------------------------------------------
   Réponses API standardisées
   ------------------------------------------------------------ */
export interface ApiList<T> {
  items: T[];
  total: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
