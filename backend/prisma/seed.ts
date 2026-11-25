import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  /* ---------- Admin ---------- */
  const email = (process.env.ADMIN_EMAIL ?? "admin@aria-mg.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!password || password.length < 12) {
    console.error(
      "❌ ADMIN_PASSWORD doit être défini dans .env (12 caractères minimum) avant de lancer le seed.",
    );
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: hash },
    create: { email, password: hash, name: "ARIA Admin", role: "ADMIN" },
  });
  console.log(`✓ Admin : ${admin.email}`);

  /* ---------- FAQ de démarrage ---------- */
  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    const faqs = [
      {
        question: "Quels services propose ARIA ?",
        answer:
          "ARIA accompagne les entreprises sur quatre expertises : le développement web & mobile, le branding & design graphique, le marketing digital & réseaux sociaux, et les solutions entreprise (IA & automatisation).",
        category: "Services",
      },
      {
        question: "Comment obtenir un devis ?",
        answer:
          "Remplissez le formulaire de devis en 3 étapes : votre besoin, puis les langues et les précisions complémentaires, enfin vos coordonnées. Nous vous revenons avec une proposition détaillée sous 24 h ouvrées.",
        category: "Devis",
      },
      {
        question: "Combien coûte un site web ?",
        answer:
          "Le tarif dépend du périmètre (pages, fonctionnalités, contenu). Un site vitrine démarre à un budget modéré ; un e-commerce ou une application sur-mesure est chiffré après analyse. Le devis est gratuit.",
        category: "Tarifs",
      },
      {
        question: "Quel est votre processus de travail ?",
        answer:
          "Cinq étapes : analyse & stratégie, conception & maquette, développement, lancement, puis suivi & optimisation. Vous avez un interlocuteur unique du début à la fin.",
        category: "Méthode",
      },
      {
        question: "Quels sont les délais de livraison ?",
        answer:
          "Un site vitrine se réalise généralement en 3 à 6 semaines, selon le contenu et les validations. Un planning clair est fixé dès le démarrage du projet.",
        category: "Méthode",
      },
      {
        question: "Travaillez-vous avec des clients hors de Madagascar ?",
        answer:
          "Oui. Nous accompagnons des clients à Madagascar et à l'international, en français et en anglais, avec des points réguliers à distance.",
        category: "Services",
      },
    ];
    await prisma.faq.createMany({
      data: faqs.map((f, i) => ({ ...f, order: i + 1, published: true })),
    });
    console.log(`✓ ${faqs.length} questions FAQ créées`);
  }

  /* ---------- Base de connaissances du chatbot ---------- */
  const kbCount = await prisma.knowledge.count();
  if (kbCount === 0) {
    const kb = [
      {
        category: "equipe",
        question: "Qui est ARIA ?",
        answer:
          "Nous sommes ARIA — Accompagnement Digital, une agence digitale basée à Antsirabe, Madagascar. Notre équipe compte environ 25 talents. Nous avons réalisé plus de 50 projets pour plus de 40 clients.",
      },
      {
        category: "services",
        question: "Quelles sont vos expertises ?",
        answer:
          "4 expertises : (1) développement web & mobile, (2) branding & design graphique, (3) marketing digital & réseaux sociaux, (4) solutions entreprise — IA & automatisation.",
      },
      {
        category: "contacts",
        question: "Comment vous contacter ?",
        answer:
          "Email : aria.madacom@gmail.com — Téléphones : +261 32 03 682 18, +261 34 17 533 02, +261 34 07 042 09 — WhatsApp : https://wa.me/+261341753302. Réponse sous 24 h ouvrées.",
      },
      {
        category: "process",
        question: "Comment se déroule un projet ?",
        answer:
          "5 étapes : analyse & stratégie, conception & maquette, développement, lancement, suivi & optimisation. Un interlocuteur unique vous accompagne du début à la fin.",
      },
      {
        category: "tarifs",
        question: "Quels sont vos tarifs et délais ?",
        answer:
          "Les tarifs sont établis sur devis gratuit, selon le périmètre. Un site vitrine se réalise en général en 3 à 6 semaines.",
      },
    ];
    await prisma.knowledge.createMany({ data: kb });
    console.log(`✓ ${kb.length} entrées dans la base de connaissances`);
  }

  /* ---------- Projets de démarrage (brouillons) ---------- */
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          slug: "refonte-site-entreprise-services",
          title: "Refonte du site d'une entreprise de services",
          description:
            "Site vitrine moderne, prise de contact simplifiée, blog intégré.",
          objective: "Améliorer la crédibilité et générer plus de demandes de devis.",
          fullDescription:
            "Refonte complète de la présence en ligne : architecture de l'information repensée, design sur-mesure, performance et référencement naturel, formulaire de contact et blog intégrés.",
          status: "COMPLETED",
          technologies: ["React", "Node.js", "PostgreSQL", "SEO"],
          solutions: ["Audit & stratégie", "Maquettage", "Développement", "Lancement"],
          published: true,
          order: 1,
        },
        {
          slug: "identite-visuelle-marque-locale",
          title: "Création de l'identité visuelle d'une marque locale",
          description:
            "Logo, charte graphique, supports imprimés et visuels réseaux sociaux.",
          objective: "Uniformiser la communication et monter en gamme.",
          status: "COMPLETED",
          technologies: ["Branding", "Illustrator", "Print"],
          solutions: ["Positionnement", "Logo & charte", "Déclinaisons"],
          published: true,
          order: 2,
        },
        {
          slug: "plateforme-interne-automatisations",
          title: "Plateforme interne + automatisations",
          description: "Outil web pour gérer les clients, les demandes et les documents.",
          objective: "Réduire la charge manuelle et centraliser l'information.",
          status: "IN_PROGRESS",
          technologies: ["React", "TypeScript", "Express", "PostgreSQL", "IA"],
          solutions: ["Cadrage", "Développement", "Automatisation"],
          published: true,
          order: 3,
        },
      ],
    });
    console.log("✓ 3 projets de démarrage créés");
  }

  console.log("\n✅ Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
