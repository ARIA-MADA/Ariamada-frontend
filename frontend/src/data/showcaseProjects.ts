import type { Project } from "@/types";

export type ProjectPreview = Pick<
  Project,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "client"
  | "url"
  | "image"
  | "technologies"
  | "caseStudyServices"
>;

export const SHOWCASE_PROJECTS: ProjectPreview[] = [
  {
    id: "local-onlyclik",
    slug: "onlyclik",
    title: "OnlyClik",
    description:
      "Site vitrine pour une agence d'acquisition digitale spécialisée dans la génération de prospects et de rendez-vous qualifiés.",
    client: "OnlyClik",
    url: "https://www.onlyclik.com/",
    image: "/images/realisations/onlyclik.png",
    technologies: [],
    caseStudyServices: ["Site vitrine", "Présence digitale"],
  },
  {
    id: "local-only-cloz",
    slug: "only-cloz",
    title: "Only Cloz",
    description:
      "Site vitrine pour une agence de prospection B2C proposant des leads qualifiés et conformes au RGPD.",
    client: "Only Cloz",
    url: "https://www.onlycloz.com/",
    image: "/images/realisations/only-cloz.png",
    technologies: [],
    caseStudyServices: ["Site vitrine", "Présence digitale"],
  },
  {
    id: "local-le-miroir-et-la-plume",
    slug: "le-miroir-et-la-plume",
    title: "Le Miroir et la Plume",
    description:
      "Site web pour une activité d'accompagnement, d'orientation professionnelle et de biographies sur mesure.",
    client: "Le Miroir et la Plume",
    url: "https://www.lemiroiretlaplume.fr/",
    image: "/images/realisations/le-miroir-et-la-plume.png",
    technologies: [],
    caseStudyServices: ["Site vitrine", "Présence digitale"],
  },
  {
    id: "local-vezo-beach-morondava",
    slug: "vezo-beach-morondava",
    title: "Le Vezo Beach Morondava",
    description:
      "Site web d'un hôtel de charme à Morondava présentant ses chambres, son restaurant, sa piscine et ses massages.",
    client: "Le Vezo Beach",
    url: "https://www.hotel-vezobeach.com//",
    image: "/images/realisations/vezo-beach-morondava.png",
    technologies: [],
    caseStudyServices: ["Site vitrine", "Présence digitale"],
  },
  {
    id: "local-henault-escaliers",
    slug: "henault-escaliers",
    title: "Hénault Escalier",
    description:
      "Site web d'un fabricant d'escaliers sur mesure, présentant ses réalisations, son atelier et son savoir-faire.",
    client: "Hénault Escalier",
    url: "https://escalier-puce.vercel.app/",
    image: "/images/realisations/henault-escaliers.png",
    technologies: [],
    caseStudyServices: ["Site vitrine", "Présence digitale"],
  },
  {
    id: "local-sarintany-coloc",
    slug: "sarintany-coloc",
    title: "Sarintany'COLOC — Coloc'KOO",
    description:
      "Plateforme de colocation à Madagascar pour rechercher des annonces, déposer un logement et suivre les candidatures.",
    client: "Sarintany'COLOC / Coloc'KOO",
    url: "https://sarintany-coloc.com/",
    image: "/images/realisations/sarintany-coloc.png",
    technologies: [],
    caseStudyServices: ["Plateforme web", "Développement sur mesure"],
  },
  {
    id: "local-marina-beach",
    slug: "marina-beach",
    title: "Hôtel Marina Beach",
    description:
      "Site web de l'Hôtel Marina Beach à Toamasina, présentant ses chambres, son restaurant, sa piscine et ses espaces de réception.",
    client: "Hôtel Marina Beach",
    url: "https://www.hotelmarinabeach.com",
    image: "/images/realisations/marina-beach.jpg",
    technologies: [],
    caseStudyServices: ["Site vitrine", "Présence digitale"],
  },
  {
    id: "local-la-colongette",
    slug: "la-colongette",
    title: "La Colongette",
    description:
      "Site web de La Colongette à Antsirabe, présentant ses chambres, son restaurant, sa piscine et ses espaces de réception.",
    client: "La Colongette",
    url: "https://www.hotel-la-colongette.com",
    image: "/images/realisations/la-colongette.jpg",
    technologies: [],
    caseStudyServices: ["Site vitrine", "Présence digitale"],
  },
  {
    id: "local-royal-palace",
    slug: "royal-palace",
    title: "Royal Palace Antsirabe",
    description:
      "Site web du Royal Palace Antsirabe présentant ses chambres et suites, son restaurant, son spa, sa piscine et ses espaces événementiels.",
    client: "Royal Palace Antsirabe",
    url: "https://www.hotel-royal-palace.com",
    image: "/images/realisations/royal-palace.jpg",
    technologies: [],
    caseStudyServices: ["Site vitrine", "Présence digitale"],
  },
  {
    id: "local-soiree-pizza-noizay",
    slug: "soiree-pizza-noizay",
    title: "Soirée Pizza — Noizay",
    description:
      "Application web de réservation pour une soirée pizza solidaire organisée au profit des projets de l'école de Noizay.",
    client: "École de Noizay",
    url: "https://pizza-de-noizay.vercel.app/",
    image: "/images/realisations/pizza.png",
    technologies: ["Application web", "Réservation en ligne"],
    caseStudyServices: ["Application web", "Conception UX", "Réservation en ligne"],
  },
  {
    id: "local-aria-mg",
    slug: "aria-mg",
    title: "ARIA — Accompagnement Digital",
    description:
      "Site officiel d'ARIA présentant l'agence digitale malgache et ses expertises en développement, branding, marketing digital et solutions IA.",
    client: "ARIA",
    url: "https://www.aria-mg.com/",
    image: "/images/realisations/ARIA.png",
    technologies: ["React", "TypeScript", "Vite", "Express", "Prisma", "PostgreSQL"],
    caseStudyServices: ["Refonte web", "Développement full-stack", "UX/UI", "Chatbot", "Back-office"],
  },
  {
    id: "local-securitec-poste-de-garde-numerique",
    slug: "securitec-poste-de-garde-numerique",
    title: "SECURITEC — Poste de garde numérique",
    description:
      "Application web de gestion des agents de sécurité et des opérations de poste de garde pour des sites industriels et des agences.",
    client: "SECURITEC",
    url: null,
    image: "/images/realisations/secu.png.png",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Prisma"],
    caseStudyServices: ["Application métier sur mesure", "Développement full-stack", "Application web hors ligne"],
  },
  {
    id: "local-royal-palace-gestion-hoteliere",
    slug: "royal-palace-gestion-hoteliere",
    title: "Royal Palace — Gestion hôtelière",
    description:
      "Plateforme interne de gestion des opérations de l'hôtel Royal Palace à Antsirabe, réunissant l'hôtellerie, la restauration, le bar, le spa, les finances et la gestion du personnel.",
    client: "Royal Palace Antsirabe",
    url: null,
    image: "/images/realisations/Royal_.png",
    technologies: ["React", "TypeScript", "Node.js", "Express", "MySQL"],
    caseStudyServices: ["Application métier sur mesure", "Développement full-stack", "Gestion hôtelière"],
  },
  {
    id: "local-ampela-vagno",
    slug: "ampela-vagno",
    title: "Ampela Vagno",
    description:
      "Site web de l'association humanitaire Ampela Vagno, engagée pour l'autonomisation des femmes du Grand Sud de Madagascar et contre les mariages précoces et forcés.",
    client: "Association Ampela Vagno",
    url: "https://www.ampelavagno.org/",
    image: "/images/realisations/AmpelaVagno.png",
    technologies: [],
    caseStudyServices: ["Site vitrine", "Présence digitale"],
  },
  {
    id: "local-hda-plateforme-gestion-integree",
    slug: "hda-plateforme-gestion-integree",
    title: "HDA — Plateforme de gestion intégrée",
    description:
      "Application métier qui centralise la gestion d'un établissement réunissant hôtel, restaurant, bar & lounge et casino.",
    client: "HDA",
    url: null,
    image: "/images/realisations/hda.png",
    technologies: ["React", "TypeScript", "Node.js", "Express", "MySQL / MariaDB"],
    caseStudyServices: ["Application métier sur mesure", "Développement full-stack", "Gestion hôtelière et restauration"],
  },
  {
    id: "local-sophie-jacquet-audebert-psychologue",
    slug: "sophie-jacquet-audebert-psychologue",
    title: "Sophie Jacquet-Audebert — Psychologue",
    description:
      "Site professionnel de Sophie Jacquet-Audebert, psychologue clinicienne à Paris 10e, présentant son parcours, ses pratiques et les modalités de consultation.",
    client: "Sophie Jacquet-Audebert",
    url: "https://sophie-jacquet-audebert.vercel.app/",
    image: "images/realisations/sophie.png",
    technologies: [],
    caseStudyServices: ["Site vitrine", "Présence digitale"],
  },
  {
    id: "local-allie-jc-multiservices-habitat",
    slug: "allie-jc-multiservices-habitat",
    title: "L'Allié JC — Multiservices Habitat",
    description:
      "Site professionnel de L'Allié JC, entreprise de multiservices proposant l'entretien des espaces verts, le nettoyage et les petits travaux dans le Doubs et le Jura.",
    client: "L'Allié JC",
    url: " https://www.lalliejc.fr/",
    image: "/images/realisations/allijc.png",
    technologies: [],
    caseStudyServices: ["Site vitrine", "Simulateur de devis", "Présence digitale"],
  },
  {
    id: "local-ifaty-beach-club",
    slug: "ifaty-beach-club",
    title: "Ifaty Beach Club",
    description:
      "Site de présentation et de réservation de l'Ifaty Beach Club, hôtel trois étoiles en bord de lagon à Mangily, dans le sud-ouest de Madagascar.",
    client: "Ifaty Beach Club",
    url: "https://ifaty-beach-club-frontend.vercel.app/",
    image: "/images/realisations/Ifaty.png",
    technologies: [],
    caseStudyServices: ["Site hôtelier", "Présentation des hébergements", "Réservation en ligne"],
  },
  {
    id: "local-kolo-tv-fm",
    slug: "kolo-tv-fm",
    title: "KOLO TV/FM",
    description:
      "Plateforme média de KOLO TV/FM, réunissant télévision en direct, radio et contenus d'information, de culture et de divertissement malgaches.",
    client: "KOLO TV/FM",
    url: "https://kolo-tv-frontend.vercel.app/",
    image: "/images/realisations/KoloTv.png",
    technologies: [],
    caseStudyServices: ["Plateforme média", "Streaming vidéo et radio"],
  },
  {
    id: "local-agrisat-cartographie-agricole-madagascar",
    slug: "agrisat-cartographie-agricole-madagascar",
    title: "AGRISAT — Cartographie et suivi des parcelles d'orge par satellite",
    description:
      "Plateforme web de cartographie agricole pour la filière orge à Madagascar : détection automatique des parcelles, suivi par imagerie satellite et analyse de cultures en temps réel.",
    client: "MALTO (filière orge — Madagascar)",
    url: "https://maltocartographie.vercel.app/#/carte",
    image: "/images/realisations/MaltoStar.jpeg",
    technologies: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Google Earth Engine", "YOLO11-seg"],
    caseStudyServices: [
      "Développement full-stack (React / FastAPI)",
      "Intégration d'imagerie satellite et de modèles IA",
      "Cartographie SIG et visualisation de données",
    ],
  },
];
