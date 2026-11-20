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
] satisfies Prisma.ProjectCreateInput[];

async function main() {
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      create: project,
      update: project,
    });
  }

  console.log(`✓ ${projects.length} réalisations publiées ou mises à jour`);
}

main()
  .catch((error: unknown) => {
    console.error("Échec du seed des réalisations :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
