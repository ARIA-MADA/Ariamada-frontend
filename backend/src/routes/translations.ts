import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/auth.js";
import { translateTexts } from "../services/translation.js";

const router = Router();

const bodySchema = z.object({
  locale: z.enum(["fr", "en"]),
  texts: z.array(z.string().max(20_000)).max(500),
}).superRefine(({ texts }, context) => {
  if (texts.reduce((total, text) => total + text.length, 0) > 12_000) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La demande de traduction dépasse la taille autorisée.",
      path: ["texts"],
    });
  }
});

router.post("/", validate(bodySchema), async (req, res) => {
  try {
    const { locale, texts } = req.body as z.infer<typeof bodySchema>;
    res.json({ translations: await translateTexts(texts, locale, { persist: true }) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur de traduction";
    console.error("[translation]", message);
    res.status(503).json({ message: "La traduction automatique est momentanément indisponible." });
  }
});

export default router;
