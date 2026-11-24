import { PrismaClient, type Prisma } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const projects = [
  {
    slug: "onlyclik",
    title: "OnlyClik",
    description:
      "Site vitrine pour une agence d'acquisition digitale spécialisée dans la génération de prospects et de rendez-vous qualifiés.",
    fullDescription:
      "Conception et réalisation du site d'OnlyClik pour présenter son accompagnement en acquisition digitale, ses services et les témoignages de ses clients.",
    objective: "Présenter l'offre d'acquisition digitale et faciliter la prise de contact.",
    client: "OnlyClik",
    status: "COMPLETED",
    url: "https://www.onlyclik.com/",
    image: "/images/realisations/onlyclik.png",
    technologies: [],
    goals: ["Présenter les services d'acquisition digitale", "Faciliter la prise de contact"],
    solutions: ["Conception d'un site vitrine", "Mise en avant des services et témoignages"],
    caseStudyExcerpt:
      "Un site web pour aider les professionnels à découvrir les services d'acquisition et à contacter l'équipe OnlyClik.",
    caseStudyServices: ["Site vitrine", "Présence digitale"],
    published: true,
    order: 0,
  },
  {
    slug: "only-cloz",
    title: "Only Cloz",
    description:
      "Site vitrine pour une agence de prospection B2C proposant des leads qualifiés et conformes au RGPD.",
    fullDescription:
      "Réalisation du site d'Only Cloz afin de présenter son activité de prospection B2C et son offre de génération de leads.",
    objective: "Présenter l'offre de prospection B2C et sa conformité RGPD.",
    client: "Only Cloz",
    status: "COMPLETED",
    url: "https://www.onlycloz.com/",
    image: "/images/realisations/only-cloz.png",
    technologies: [],
    goals: ["Présenter l'activité et les services", "Mettre en avant la conformité RGPD"],
    solutions: ["Conception d'un site vitrine", "Présentation de l'offre de prospection"],
    caseStudyExcerpt:
      "Un site web dédié à la présentation des services de prospection B2C d'Only Cloz.",
    caseStudyServices: ["Site vitrine", "Présence digitale"],
    published: true,
    order: 1,
  },
  {
    slug: "le-miroir-et-la-plume",
    title: "Le Miroir et la Plume",
    description:
      "Site web pour une activité d'accompagnement, d'orientation professionnelle et de biographies sur mesure.",
    fullDescription:
      "Création du site de Le Miroir et la Plume pour présenter ses services d'accompagnement et d'orientation professionnelle ainsi que la réalisation de biographies sur mesure.",
    objective: "Présenter les services et faciliter la découverte de l'accompagnement proposé.",
    client: "Le Miroir et la Plume",
    status: "COMPLETED",
    url: "https://www.lemiroiretlaplume.fr/",
    image: "/images/realisations/le-miroir-et-la-plume.png",
    technologies: [],
    goals: ["Présenter les offres d'accompagnement", "Valoriser les biographies sur mesure"],
    solutions: ["Conception d'un site vitrine", "Présentation des services et témoignages"],
    caseStudyExcerpt:
      "Un site éditorial pour faire connaître les services d'accompagnement et d'écriture biographique.",
    caseStudyServices: ["Site vitrine", "Présence digitale"],
    published: true,
    order: 2,
  },
  {
    slug: "vezo-beach-morondava",
    title: "Le Vezo Beach Morondava",
    description:
      "Site web d'un hôtel de charme à Morondava présentant ses chambres, son restaurant, sa piscine et ses massages.",
    fullDescription:
      "Conception du site du Vezo Beach pour présenter l'hôtel, ses chambres et suites ainsi que ses services de restauration et de détente.",
    objective: "Présenter l'hôtel et ses prestations aux voyageurs.",
    client: "Le Vezo Beach",
    status: "COMPLETED",
    url: "https://hotel-vezo-beach-morondava.vercel.app/",
    image: "/images/realisations/vezo-beach-morondava.png",
    technologies: [],
    goals: ["Présenter les chambres et suites", "Mettre en valeur les services de l'hôtel"],
    solutions: ["Conception d'un site vitrine hôtelier", "Présentation des chambres et prestations"],
    caseStudyExcerpt:
      "Un site de présentation pour un hôtel en bord de mer à Morondava, avec des contenus en français et en anglais.",
    caseStudyServices: ["Site vitrine", "Présence digitale"],
    published: true,
    order: 3,
  },
  {
    slug: "henault-escaliers",
    title: "Hénault Escalier",
    description:
      "Site web d'un fabricant d'escaliers sur mesure, présentant ses réalisations, son atelier et son savoir-faire.",
    fullDescription:
      "Réalisation du site de Hénault Escalier pour présenter la conception et la fabrication d'escaliers sur mesure ainsi que les services de l'entreprise.",
    objective: "Valoriser le savoir-faire de l'entreprise et présenter ses offres d'escaliers sur mesure.",
    client: "Hénault Escalier",
    status: "COMPLETED",
    url: "https://escalier-puce.vercel.app/",
    image: "/images/realisations/henault-escaliers.png",
    technologies: [],
    goals: ["Présenter les modèles d'escaliers", "Mettre en avant le savoir-faire de l'atelier"],
    solutions: ["Conception d'un site vitrine", "Présentation des réalisations et services"],
    caseStudyExcerpt:
      "Un site web pour faire découvrir les escaliers sur mesure et l'activité de l'atelier Hénault.",
    caseStudyServices: ["Site vitrine", "Présence digitale"],
    published: true,
    order: 4,
  },
  {
    slug: "sarintany-coloc",
    title: "Sarintany'COLOC — Coloc'KOO",
    description:
      "Plateforme de colocation à Madagascar pour rechercher des annonces, déposer un logement et suivre les candidatures.",
    fullDescription:
      "Développement d'une plateforme dédiée à la colocation à Madagascar, avec un parcours public de recherche et de dépôt d'annonces ainsi que des espaces de gestion.",
    objective: "Faciliter la mise en relation entre personnes en recherche de colocation et propriétaires.",
    client: "Sarintany'COLOC / Coloc'KOO",
    status: "COMPLETED",
    url: "https://sarintany-coloc.com/",
    image: "/images/realisations/sarintany-coloc.png",
    technologies: [],
    goals: ["Permettre la recherche de logements en colocation", "Faciliter le dépôt d'annonces"],
    solutions: ["Développement d'une plateforme web", "Création de parcours dédiés aux utilisateurs et à l'administration"],
    caseStudyExcerpt:
      "Une plateforme web de colocation pensée pour le marché malgache et ses principales villes.",
    caseStudyServices: ["Plateforme web", "Développement sur mesure"],
    published: true,
    order: 5,
  },
  {
    slug: "marina-beach",
    title: "Hôtel Marina Beach",
    description:
      "Site web de l'Hôtel Marina Beach à Toamasina, présentant ses chambres, son restaurant, sa piscine et ses espaces de réception.",
    fullDescription:
      "Conception du site de l'Hôtel Marina Beach pour présenter l'établissement, ses chambres et suites ainsi que ses services de restauration, de bien-être et d'événementiel.",
    objective: "Présenter l'hôtel et ses prestations aux voyageurs et aux organisateurs d'événements.",
    client: "Hôtel Marina Beach",
    status: "COMPLETED",
    url: "https://www.hotelmarinabeach.com",
    image: "/images/realisations/marina-beach.jpg",
    technologies: [],
    goals: ["Présenter les chambres et suites", "Mettre en valeur les services et espaces de l'hôtel"],
    solutions: ["Conception d'un site vitrine hôtelier", "Présentation des chambres, services et événements"],
    caseStudyExcerpt:
      "Un site web pour découvrir l'Hôtel Marina Beach et ses prestations à Toamasina.",
    caseStudyServices: ["Site vitrine", "Présence digitale"],
    published: true,
    order: 6,
  },
  {
    slug: "la-colongette",
    title: "La Colongette",
    description:
      "Site web de La Colongette à Antsirabe, présentant ses chambres, son restaurant, sa piscine et ses espaces de réception.",
    fullDescription:
      "Réalisation du site de La Colongette afin de présenter l'hôtel, ses chambres et suites ainsi que ses services de restauration, de bien-être et d'événementiel.",
    objective: "Présenter l'hôtel et faciliter la découverte de ses prestations à Antsirabe.",
    client: "La Colongette",
    status: "COMPLETED",
    url: "https://www.hotel-la-colongette.com",
    image: "/images/realisations/la-colongette.jpg",
    technologies: [],
    goals: ["Présenter les chambres et suites", "Valoriser les services de l'hôtel"],
    solutions: ["Conception d'un site vitrine hôtelier", "Présentation des chambres et prestations"],
    caseStudyExcerpt:
      "Un site de présentation pour faire découvrir La Colongette et ses services à Antsirabe.",
    caseStudyServices: ["Site vitrine", "Présence digitale"],
    published: true,
    order: 7,
  },
  {
    slug: "royal-palace",
    title: "Royal Palace Antsirabe",
    description:
      "Site web du Royal Palace Antsirabe présentant ses chambres et suites, son restaurant, son spa, sa piscine et ses espaces événementiels.",
    fullDescription:
      "Conception du site du Royal Palace Antsirabe pour présenter l'établissement et ses prestations d'hébergement, de restauration, de bien-être et d'événementiel.",
    objective: "Présenter l'hôtel et ses prestations aux voyageurs et aux organisateurs d'événements.",
    client: "Royal Palace Antsirabe",
    status: "COMPLETED",
    url: "https://www.hotel-royal-palace.com",
    image: "/images/realisations/royal-palace.jpg",
    technologies: [],
    goals: ["Présenter les chambres et suites", "Mettre en valeur les services et espaces de l'hôtel"],
    solutions: ["Conception d'un site vitrine hôtelier", "Présentation des chambres, services et événements"],
    caseStudyExcerpt:
      "Un site web pour découvrir les prestations et les espaces du Royal Palace à Antsirabe.",
    caseStudyServices: ["Site vitrine", "Présence digitale"],
    published: true,
    order: 8,
  },
  {
    slug: "soiree-pizza-noizay",
    title: "Soirée Pizza — Noizay",
    description:
      "Application web de réservation pour une soirée pizza solidaire organisée au profit des projets de l'école de Noizay.",
    fullDescription:
      "Conception d'une application simple permettant aux familles de découvrir le menu, de réserver leurs pizzas en ligne et de choisir un créneau de retrait. Le site présente aussi les modalités de paiement, les informations pratiques et les moments de la soirée.",
    objective:
      "Faciliter les réservations et l'organisation d'une soirée pizza solidaire pour l'école de Noizay.",
    client: "École de Noizay",
    status: "COMPLETED",
    url: "https://pizza-de-noizay.vercel.app/",
    image: "https://pizza-de-noizay.vercel.app/assets/pizzamiel-KTSR5phY.png",
    technologies: ["Application web", "Réservation en ligne"],
    goals: [
      "Permettre aux familles de réserver leurs pizzas en ligne",
      "Centraliser les informations pratiques de la soirée",
      "Simplifier l'organisation des commandes et du retrait",
    ],
    solutions: [
      "Création d'une page présentant l'événement et le menu",
      "Mise en place d'un parcours de réservation",
      "Ajout des choix de pizzas, de créneaux de retrait et d'informations de contact",
    ],
    caseStudyExcerpt:
      "Une application de réservation dédiée à une soirée pizza solidaire, pensée pour être rapide à utiliser sur mobile.",
    caseStudyChallenge:
      "Donner aux organisateurs un outil clair pour collecter les réservations tout en offrant aux familles un parcours simple, accessible et adapté aux inscriptions de dernière minute.",
    caseStudyApproach:
      "Le site associe une présentation chaleureuse de l'événement à un formulaire guidé avec coordonnées, sélection des pizzas et créneau de retrait.",
    caseStudyResults: [
      "Réservation possible directement depuis le site",
      "Commande limitée et structurée selon le menu disponible",
      "Informations pratiques visibles avant et pendant la réservation",
    ],
    caseStudyServices: [
      "Application web",
      "Conception UX",
      "Réservation en ligne",
    ],
    published: true,
    order: 9,
  },
  {
    slug: "aria-mg",
    title: "ARIA — Accompagnement Digital",
    description:
      "Site officiel d'ARIA présentant l'agence digitale malgache et ses expertises en développement, branding, marketing digital et solutions IA.",
    fullDescription:
      "Conception et refonte du site institutionnel d'ARIA autour d'une expérience claire, rapide et responsive. Le site présente les services de l'agence, son approche de travail, ses réalisations, ses partenaires et ses coordonnées. Il comprend également des formulaires de contact et de demande de devis, un chatbot renseigné sur les offres d'ARIA et un espace d'administration pour gérer les contenus.",
    objective:
      "Renforcer la présence numérique d'ARIA, présenter son expertise et faciliter les prises de contact et les demandes de devis.",
    client: "ARIA",
    status: "COMPLETED",
    url: "https://www.aria-mg.com/",
    image: "/og-aria.jpg",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "React Router",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Vercel",
    ],
    goals: [
      "Présenter clairement les expertises de l'agence",
      "Valoriser les réalisations et les partenaires",
      "Faciliter les demandes de contact et de devis",
    ],
    solutions: [
      "Refonte de l'identité numérique et des parcours de navigation",
      "Présentation des services en développement, branding, marketing et IA",
      "Développement du portfolio, des formulaires et du chatbot",
      "Création d'un back-office pour administrer les projets et les contenus",
    ],
    caseStudyExcerpt:
      "Une plateforme institutionnelle complète pour présenter l'agence ARIA et transformer les visiteurs en prospects qualifiés.",
    caseStudyChallenge:
      "Présenter quatre domaines d'expertise dans une interface cohérente, tout en facilitant la découverte des services et la prise de contact depuis tous les appareils.",
    caseStudyApproach:
      "Le site a été structuré autour d'un parcours commercial direct : valorisation de l'offre, preuve sociale, réalisations, services détaillés et appels à l'action vers le devis ou le contact.",
    caseStudyResults: [
      "Une présentation unifiée des services et des expertises d'ARIA",
      "Un portfolio administrable depuis le back-office",
      "Des parcours dédiés aux prises de contact et aux demandes de devis",
      "Une expérience responsive disponible en français et en anglais",
    ],
    caseStudyServices: [
      "Refonte web",
      "Développement full-stack",
      "UX/UI",
      "Chatbot",
      "Back-office",
    ],
    published: true,
    order: 10,
  },
  {
    slug: "securitec-poste-de-garde-numerique",
    title: "SECURITEC — Poste de garde numérique",
    description:
      "Application web de gestion des agents de sécurité et des opérations de poste de garde pour des sites industriels et des agences.",
    fullDescription:
      "SECURITEC numérise les opérations quotidiennes du poste de garde : prise et passation de service, pointage des agents, contrôle des accès, rondes, consignes, main courante, registres de site et logistique. L'application centralise les informations par site, organise les accès selon les rôles et permet de poursuivre certaines saisies hors ligne avec synchronisation ultérieure.",
    objective:
      "Remplacer les registres papier et centraliser le suivi des équipes, des accès et des opérations sur les sites surveillés.",
    client: "SECURITEC",
    status: "COMPLETED",
    technologies: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "React Router",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "IndexedDB",
      "Service Worker",
    ],
    goals: [
      "Numériser les prises de poste, passations et pointages des agents",
      "Tracer les visiteurs, véhicules, rondes, consignes et événements de site",
      "Centraliser les registres et la logistique dans un outil partagé",
      "Maintenir les opérations essentielles lorsque la connexion est indisponible",
      "Cloisonner les données selon les sites et les rôles des utilisateurs",
    ],
    solutions: [
      "Développement d'une application métier organisée autour des postes de garde et des cahiers de site",
      "Gestion des rôles et du contexte multi-sites",
      "Mise en place d'un cache et d'une file d'attente IndexedDB pour les saisies hors ligne",
      "Synchronisation des saisies en attente au retour de la connexion",
      "Prise en charge de l'impression et de l'export des données opérationnelles",
    ],
    caseStudyExcerpt:
      "Un poste de garde numérique pour suivre les équipes, les accès et les opérations quotidiennes des sites depuis une application centralisée.",
    caseStudyChallenge:
      "Remplacer des registres papier dispersés par un outil adapté aux opérations de terrain, aux droits d'accès par rôle et aux sites où la connexion peut être instable.",
    caseStudyApproach:
      "L'application regroupe les principaux flux du poste de garde dans des modules dédiés et rattache les opérations à leur site. Une file locale permet de conserver certaines saisies hors ligne avant leur synchronisation.",
    caseStudyResults: [
      "Suivi numérique des prises de poste, passations et présences",
      "Regroupement des contrôles d'accès, rondes, consignes et registres",
      "Accès aux données organisé par site et par rôle",
      "Continuité de certaines saisies sans connexion, avec synchronisation ultérieure",
    ],
    caseStudyServices: [
      "Application métier sur mesure",
      "Développement full-stack",
      "Gestion des opérations de sécurité",
      "Application web hors ligne",
    ],
    published: true,
    order: 11,
  },
  {
    slug: "royal-palace-gestion-hoteliere",
    title: "Royal Palace — Gestion hôtelière",
    description:
      "Plateforme interne de gestion des opérations de l'hôtel Royal Palace à Antsirabe, réunissant l'hôtellerie, la restauration, le bar, le spa, les finances et la gestion du personnel.",
    fullDescription:
      "Développement d'une application métier sécurisée pour centraliser les opérations quotidiennes du Royal Palace. La plateforme propose des espaces dédiés à la gestion des chambres et réservations, des clients, du restaurant et du bar, du spa, des finances ainsi qu'aux utilisateurs, aux ressources humaines et au planning du personnel. Les accès aux modules sont contrôlés selon les rôles.",
    objective:
      "Rassembler les outils de gestion des différents services de l'hôtel dans une plateforme unique avec des accès adaptés aux équipes.",
    client: "Royal Palace Antsirabe",
    status: "COMPLETED",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "React Router",
      "Node.js",
      "Express",
      "MySQL",
      "JWT",
    ],
    goals: [
      "Centraliser le suivi des réservations et des opérations hôtelières",
      "Faciliter la gestion des activités restaurant, bar et spa",
      "Donner une visibilité sur les revenus et les finances",
      "Organiser la gestion des utilisateurs, des rôles et du personnel",
    ],
    solutions: [
      "Développement d'une application de gestion accessible après authentification",
      "Création de modules dédiés à l'hôtel, au restaurant, au bar, au spa et aux finances",
      "Mise en place de permissions par rôle et par module",
      "Ajout d'espaces pour la gestion des clients, des ressources humaines et du planning",
    ],
    caseStudyExcerpt:
      "Une plateforme de gestion interne conçue pour réunir les principaux services et opérations du Royal Palace.",
    caseStudyChallenge:
      "Réunir dans un même outil les besoins opérationnels de plusieurs services hôteliers tout en adaptant les accès aux responsabilités de chaque utilisateur.",
    caseStudyApproach:
      "L'application structure les fonctions par module métier et protège les espaces selon l'authentification, les rôles et les permissions attribuées.",
    caseStudyResults: [
      "Accès centralisé aux outils de gestion des différents services",
      "Gestion des réservations, clients, restaurant, bar et spa",
      "Suivi financier et gestion du personnel dans la même plateforme",
      "Droits d'accès adaptés aux rôles des équipes",
    ],
    caseStudyServices: [
      "Application métier sur mesure",
      "Développement full-stack",
      "Gestion hôtelière",
      "Gestion des accès par rôle",
    ],
    published: true,
    order: 12,
  },
  {
    slug: "ampela-vagno",
    title: "Ampela Vagno",
    description:
      "Site web de l'association humanitaire Ampela Vagno, engagée pour l'autonomisation des femmes du Grand Sud de Madagascar et contre les mariages précoces et forcés.",
    fullDescription:
      "Réalisation du site de l'association afin de présenter sa mission, ses actions et son impact auprès des communautés du district d'Ampanihy Ouest. Le site met en avant les initiatives menées autour des droits des femmes, de la transmission de savoir-faire, de l'autonomie économique et de l'éducation numérique, et invite les visiteurs à soutenir l'association ou à devenir bénévoles.",
    objective:
      "Faire connaître la mission et les actions d'Ampela Vagno, sensibiliser le public et faciliter le soutien à ses initiatives dans le Grand Sud de Madagascar.",
    client: "Association Ampela Vagno",
    status: "COMPLETED",
    url: "https://www.ampelavagno.org/",
    image : "/images/realisations/AmpelaVagno.png",
    technologies: [],
    goals: [
      "Présenter la mission et les valeurs de l'association",
      "Faire découvrir ses projets et ses axes d'intervention sur le terrain",
      "Sensibiliser aux droits et à l'autonomisation des femmes",
      "Encourager les dons, les partenariats et le bénévolat",
    ],
    solutions: [
      "Création d'un site de présentation de l'association et de sa mission",
      "Mise en valeur des actions locales et des initiatives d'autonomisation",
      "Présentation des informations d'impact et de la zone d'intervention",
      "Intégration d'appels à l'action pour soutenir l'association et la contacter",
    ],
    caseStudyExcerpt:
      "Un site de présentation pour faire connaître les actions d'Ampela Vagno en faveur des femmes et des communautés du Grand Sud malgache.",
    caseStudyChallenge:
      "Présenter les enjeux sociaux et les projets de terrain de l'association tout en offrant aux visiteurs des moyens simples de s'informer et de s'engager.",
    caseStudyApproach:
      "Le contenu organise la présentation autour de la mission, des actions menées à Ejeda, de la zone d'intervention et des témoignages, avec des invitations à faire un don ou à devenir bénévole.",
    caseStudyResults: [
      "Présentation en ligne de la mission et des actions de l'association",
      "Mise en avant des projets menés dans la région d'Ampanihy Ouest",
      "Parcours permettant de découvrir comment soutenir l'association",
    ],
    caseStudyServices: ["Site vitrine", "Présence digitale"],
    published: true,
    order: 13,
  },
  {
    slug: "hda-plateforme-gestion-integree",
    title: "HDA — Plateforme de gestion intégrée",
    description:
      "Application métier qui centralise la gestion d'un établissement réunissant hôtel, restaurant, bar & lounge et casino.",
    fullDescription:
      "Développement d'une plateforme de gestion intégrée pour réunir les opérations des différents départements dans un outil unique. Elle couvre notamment les réservations et séjours hôteliers, les clients et dossiers KYC, les commandes et caisses du restaurant et du bar, les opérations du casino, les stocks, les finances, les ressources humaines et le planning du personnel. Les accès sont adaptés aux rôles et les opérations sensibles sont conçues pour être traçables.",
    objective:
      "Centraliser les opérations de l'établissement, améliorer le suivi des encaissements et des stocks, et fournir aux équipes des outils adaptés à leurs responsabilités.",
    client: "HDA",
    status: "COMPLETED",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "React Router",
      "Node.js",
      "Express",
      "MySQL / MariaDB",
      "JWT",
      "bcrypt",
    ],
    goals: [
      "Réunir les opérations de l'hôtel, du restaurant, du bar et du casino",
      "Améliorer la traçabilité des encaissements, des stocks et des opérations métier",
      "Centraliser les informations clients et le suivi KYC",
      "Faciliter le pilotage des activités et l'organisation des équipes",
      "Adapter les fonctionnalités accessibles aux rôles des utilisateurs",
    ],
    solutions: [
      "Développement de modules métier pour l'hébergement, la restauration, le bar et le casino",
      "Centralisation des stocks, des achats et des opérations financières",
      "Ajout d'outils de gestion des clients, des ressources humaines et du planning",
      "Mise en place d'une authentification et de permissions selon les rôles",
      "Prise en charge des rapports, des impressions et des signatures électroniques",
    ],
    caseStudyExcerpt:
      "Une plateforme de gestion intégrée qui rassemble les principaux services et fonctions de pilotage d'un établissement hôtelier et de loisirs.",
    caseStudyChallenge:
      "Unifier des activités aux besoins différents — hébergement, restauration, bar, casino, finances et RH — tout en gardant des opérations traçables et des accès adaptés à chaque métier.",
    caseStudyApproach:
      "La plateforme organise les fonctionnalités par département et rôle, avec une API centralisée et des flux métier dédiés aux réservations, commandes, caisses, stocks, clients et équipes.",
    caseStudyResults: [
      "Outils de gestion regroupés pour l'hôtel, le restaurant, le bar et le casino",
      "Suivi centralisé des clients, des stocks et des opérations financières",
      "Fonctionnalités adaptées aux différents profils et métiers",
      "Rapports et supports d'impression pour les opérations quotidiennes",
    ],
    caseStudyServices: [
      "Application métier sur mesure",
      "Développement full-stack",
      "Gestion hôtelière et restauration",
      "Gestion de caisse et de stock",
    ],
    published: true,
    order: 14,
  },
  {
    slug: "agrisat-cartographie-agricole-madagascar",
    title: "AGRISAT — Cartographie et suivi des parcelles d'orge par satellite",
    description:
      "Plateforme web de cartographie agricole pour la filière orge à Madagascar : détection automatique des parcelles, suivi par imagerie satellite et analyse de cultures en temps réel.",
    fullDescription:
      "AGRISAT centralise la cartographie des parcelles d'orge de la filière MALTO à Madagascar. Sur une carte satellite, les équipes délimitent une zone puis laissent le système détecter et tracer automatiquement les parcelles par segmentation d'image (YOLO11-seg), sans dupliquer celles déjà en base. Chaque parcelle est ensuite enrichie par imagerie Sentinel-2 et imagerie haute résolution complémentaire : indices spectraux (NDVI, NDRE, EVI, SAVI, NDWI), séries temporelles, classification de la culture et estimation du rendement. Un tableau de bord suit la santé des cultures et les zones à risque, tandis que les fiches parcelles, les analyses et le module de modèles restent accessibles aux agronomes. Les résultats s'exportent en GeoJSON, CSV et PDF pour les rapports de zonage.",
    objective:
      "Donner aux agronomes et aux équipes terrain une vision fiable, actualisée et partagée des parcelles d'orge, afin de réduire les vérifications manuelles sur le terrain et de prioriser les actions là où les cultures sont à risque.",
    client: "MALTO (filière orge — Madagascar)",
    status: "COMPLETED",
    url: "https://aria-mg.vercel.app/",
    image: "/images/realisations/MaltoStar.jpeg",
    technologies: [
      "React 18",
      "TypeScript",
      "Vite",
      "Zustand",
      "React Router",
      "Google Maps JavaScript API",
      "Leaflet",
      "Recharts",
      "Tailwind CSS",
      "Python 3.11",
      "FastAPI",
      "SQLAlchemy (async)",
      "PostgreSQL / Neon",
      "Alembic",
      "Google Earth Engine",
      "Sentinel-2",
      "YOLO11-seg",
      "Random Forest",
    ],
    goals: [
      "Cartographier les parcelles d'orge sans relevé GPS exhaustif sur le terrain.",
      "Suivre l'état des cultures et détecter les parcelles à risque au fil de la saison.",
      "Rendre les données partageables avec les équipes terrain et les partenaires.",
    ],
    solutions: [
      "Détection automatique des parcelles par segmentation d'image sur capture satellite, avec déduplication avec la base existante.",
      "Calcul des indices spectraux et des séries temporelles via Google Earth Engine, à partir de Sentinel-2 et d'imagerie haute résolution.",
      "Tableau de bord et fiches parcelles (santé, confiance, verdict, recommandations) alimentés par une API FastAPI asynchrone.",
      "Exports GeoJSON, CSV et PDF pour les rapports et le partage des zonages.",
    ],
    caseStudyExcerpt:
      "Une plateforme de cartographie agricole qui automatise la détection des parcelles d'orge et le suivi satellite des cultures à Madagascar.",
    caseStudyServices: [
      "Développement full-stack (React / FastAPI)",
      "Intégration d'imagerie satellite et de modèles IA",
      "Cartographie SIG et visualisation de données",
    ],
    published: true,
    order: 1,
  },
] satisfies Prisma.ProjectCreateManyInput[];

async function main() {
  const result = await prisma.project.createMany({
    data: projects,
    skipDuplicates: true,
  });
  const skipped = projects.length - result.count;

  console.log(
    `✓ ${result.count} réalisations ajoutées${skipped > 0 ? `, ${skipped} déjà présentes conservées sans modification` : ""}`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Échec du seed des réalisations :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
