import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { validate } from "../middleware/auth.js";
import { config } from "../config.js";
import { translateTexts } from "../services/translation.js";

const router = Router();

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(30),
  locale: z.enum(["fr", "en"]).optional(),
});

/* ------------------------------------------------------------
   Informations statiques d'ARIA (secours si la table est vide)
   ------------------------------------------------------------ */
const BASE_FACTS = [
  "ARIA — Accompagnement Digital, agence basée à Antsirabe, Madagascar.",
  "Services : développement web & mobile, branding & design graphique, marketing digital & réseaux sociaux, solutions entreprise (IA & automatisation).",
  "Équipe : environ 25 talents. Plus de 50 projets réalisés, 40+ clients accompagnés.",
  "Contact : aria.madacom@gmail.com — +261 32 03 682 18 / +261 34 17 533 02 / +261 34 07 042 09 — WhatsApp https://wa.me/+261341753302",
  "Site : https://www.aria-mg.com/ — Devis en ligne en 3 étapes sur /devis, formulaire sur /contact.",
  "Process : 1) analyse & stratégie 2) conception & maquette 3) développement 4) lancement 5) suivi & optimisation.",
  "Délais : site vitrine 3 à 6 semaines en général. Tarifs sur devis, gratuits.",
  "Travaille à Madagascar et à l'international, en français et en anglais.",
].join("\n");

function buildSystemPrompt(knowledge: { category: string; question: string; answer: string }[], locale?: string) {
  const kb =
    knowledge.length > 0
      ? knowledge.map((k) => `[${k.category}] Q: ${k.question}\nR: ${k.answer}`).join("\n\n")
      : "(base de connaissances vide)";

  return `Tu es l'assistant officiel du site d'ARIA — Accompagnement Digital, agence digitale à Madagascar.
Tu réponds à TOUTES les questions sur ARIA : services, tarifs, délais, process, équipe, références, contact, devis.

RÈGLES :
- Réponds uniquement sur ARIA et ses prestations. Si la question ne concerne pas ARIA, redirige poliment vers les sujets ARIA.
- Sois concis (3 à 6 phrases), utile et chaleureux. Pas de liste à puces inutiles.
- Langue de réponse : ${locale === "en" ? "English" : "français"} (sauf si l'utilisateur écrit dans une autre langue, réponds alors dans la sienne).
- N'invente jamais de prix précis : propose un devis (/devis) ou le contact.
- Pour contact ou devis, donne l'email aria.madacom@gmail.com et le WhatsApp +261 34 17 533 02.
- Termine éventuellement par une question de relance utile.

INFORMATIONS DE BASE :
${BASE_FACTS}

BASE DE CONNAISSANCES ÉDITABLE PAR L'ADMINISTRATEUR :
${kb}`;
}

/** Réponse de secours si Groq est indisponible */
function fallbackReply(messages: { role: string; content: string }[]): string {
  const last = [...messages].reverse().find((m) => m.role === "user")?.content.toLowerCase() ?? "";
  const has = (...keys: string[]) => keys.some((k) => last.includes(k));

  if (has("prix", "tarif", "coût", "combien", "price", "cost"))
    return "Nos tarifs dépendent du périmètre du projet : nous établissons un devis gratuit et détaillé. Décrivez votre besoin sur /devis ou écrivez-nous à aria.madacom@gmail.com et nous vous répondons sous 24 h ouvrées.";
  if (has("délai", "delai", "quand", "combien de temps", "deadline"))
    return "Un site vitrine se réalise généralement en 3 à 6 semaines, selon le contenu et les validations. Le planning exact est fixé dès le démarrage du projet.";
  if (has("contact", "email", "téléphone", "telephone", "whatsapp", "joindre"))
    return "Vous pouvez nous joindre à aria.madacom@gmail.com, au +261 34 17 533 02, ou via WhatsApp : https://wa.me/+261341753302. Nous répondons sous 24 h ouvrées.";
  if (has("service", "propos", "faites", "offrez", "what do you"))
    return "ARIA accompagne sur 4 expertises : développement web & mobile, branding & design graphique, marketing digital & réseaux sociaux, et solutions entreprise (IA & automatisation).";
  return "Je suis l'assistant ARIA : je réponds à toutes les questions sur nos services, notre process, nos délais, notre équipe ou un projet à monter. Précisez votre question, ou contactez-nous sur /contact / /devis pour en parler directement avec l'équipe.";
}

async function localizedFallback(
  messages: { role: string; content: string }[],
  locale?: "fr" | "en",
): Promise<string> {
  const fallback = fallbackReply(messages);
  if (locale !== "en") return fallback;
  try {
    return (await translateTexts([fallback], "en"))[0];
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------
   POST /api/chat — proxy Groq (clé jamais côté client)
   ------------------------------------------------------------ */
router.post("/", validate(bodySchema), async (req, res, next) => {
  try {
    const { messages, locale } = req.body as z.infer<typeof bodySchema>;

    // 1. Base de connaissances éditable par l'admin
    const knowledge = await prisma.knowledge.findMany({
      where: { active: true },
      orderBy: [{ category: "asc" }, { updatedAt: "desc" }],
      take: 200,
    });

    // 2. Si pas de clé Groq → secours local
    if (!config.groq.apiKey) {
      res.json({ reply: await localizedFallback(messages, locale), fallback: true });
      return;
    }

    // 3. Appel Groq
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.groq.apiKey}`,
        },
        body: JSON.stringify({
          model: config.groq.model,
          temperature: 0.4,
          max_tokens: 700,
          messages: [
            { role: "system", content: buildSystemPrompt(knowledge, locale) },
            ...messages.slice(-12),
          ],
        }),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error("[chat] Groq", response.status, detail.slice(0, 400));
        res.json({ reply: await localizedFallback(messages, locale), fallback: true });
        return;
      }

      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) {
        res.json({ reply: await localizedFallback(messages, locale), fallback: true });
        return;
      }
      res.json({ reply });
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    console.error("[chat] erreur", err);
    // Ne pas faire échouer le chatbot : secours
    try {
      res.json({ reply: await localizedFallback(req.body.messages ?? [], req.body.locale), fallback: true });
    } catch {
      next(err);
    }
  }
});

export default router;
