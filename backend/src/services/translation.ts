import { createHash } from "node:crypto";
import { config } from "../config.js";
import { prisma } from "../prisma.js";

const CACHE_LIMIT = 2_000;
const TRANSLATION_TTL_MS = 30 * 24 * 60 * 60 * 1_000;
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1_000;
const DATABASE_TOUCH_INTERVAL_MS = 24 * 60 * 60 * 1_000;
const CACHE = new Map<string, string>();
const IN_FLIGHT = new Map<string, Promise<string>>();
let translationQueue: Promise<void> = Promise.resolve();
let lastCleanupAt = 0;
let cleanupInFlight: Promise<void> | null = null;

function cacheKey(text: string, locale: string): string {
  return createHash("sha256")
    .update(`${locale}\0${config.groq.model}\0${text}`)
    .digest("hex");
}

function remember(key: string, value: string): void {
  CACHE.delete(key);
  CACHE.set(key, value);
  if (CACHE.size > CACHE_LIMIT) {
    const oldest = CACHE.keys().next().value;
    if (oldest) CACHE.delete(oldest);
  }
}

function parseTranslation(content: string, expected: number): string[] {
  const start = content.indexOf("[");
  const end = content.lastIndexOf("]");
  if (start < 0 || end <= start) throw new Error("Réponse de traduction invalide");
  const result: unknown = JSON.parse(content.slice(start, end + 1));
  if (
    !Array.isArray(result) ||
    result.length !== expected ||
    result.some((value) => typeof value !== "string")
  ) {
    throw new Error("La traduction ne correspond pas aux textes envoyés");
  }
  return result;
}

async function cleanupExpiredTranslations(): Promise<void> {
  if (Date.now() - lastCleanupAt < CLEANUP_INTERVAL_MS) return;
  if (cleanupInFlight) return cleanupInFlight;

  cleanupInFlight = prisma.translationCache
    .deleteMany({
      where: {
        updatedAt: { lt: new Date(Date.now() - TRANSLATION_TTL_MS) },
      },
    })
    .then(({ count }) => {
      lastCleanupAt = Date.now();
      if (count > 0) {
        console.info(`[translation] ${count} traduction(s) expirée(s) supprimée(s)`);
      }
    })
    .catch((error: unknown) => {
      console.error("[translation] Échec du nettoyage des traductions expirées", error);
    })
    .finally(() => {
      cleanupInFlight = null;
    });

  return cleanupInFlight;
}

async function translateChunk(texts: string[], locale: string): Promise<string[]> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(45_000),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.groq.apiKey}`,
    },
    body: JSON.stringify({
      model: config.groq.model,
      temperature: 0.1,
      max_tokens: 8192,
      messages: [
        {
          role: "system",
          content:
            "You are a professional website translator. Translate each input string into natural English. Preserve meaning, tone, punctuation, placeholders, URLs, email addresses, product names, code, and formatting. If text is already English, return it unchanged. Return only a JSON array of strings, in the exact same order and with exactly the same number of elements.",
        },
        { role: "user", content: JSON.stringify(texts) },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("[translation] Groq", response.status, detail.slice(0, 300));
    throw new Error("Le service de traduction est temporairement indisponible");
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Réponse de traduction vide");
  return parseTranslation(content, texts.length);
}

interface TranslateOptions {
  persist?: boolean;
}

export async function translateTexts(
  texts: string[],
  locale: "fr" | "en",
  { persist = false }: TranslateOptions = {},
): Promise<string[]> {
  if (locale === "fr") return texts;
  if (texts.length === 0) return [];

  const resolved = new Map<string, string>();
  const pending = new Map<string, Promise<string>>();
  const missing: { text: string; key: string }[] = [];

  if (persist) {
    const uniqueTexts = [...new Set(texts)];
    if (uniqueTexts.length > 0) {
      const hashes = uniqueTexts.map((text) => cacheKey(text, locale));
      const rows = await prisma.translationCache.findMany({
        where: {
          locale,
          model: config.groq.model,
          sourceHash: { in: hashes },
        },
        select: { sourceHash: true, sourceText: true, translatedText: true, updatedAt: true },
      });
      const byHash = new Map(rows.map((row) => [row.sourceHash, row]));
      const refreshBefore = new Date(Date.now() - DATABASE_TOUCH_INTERVAL_MS);
      const hashesToTouch: string[] = [];
      for (const text of uniqueTexts) {
        const key = cacheKey(text, locale);
        const row = byHash.get(key);
        if (row && row.sourceText === text) {
          remember(key, row.translatedText);
          if (row.updatedAt < refreshBefore) hashesToTouch.push(key);
        }
      }
      if (hashesToTouch.length > 0) {
        await prisma.translationCache.updateMany({
          where: {
            locale,
            model: config.groq.model,
            sourceHash: { in: hashesToTouch },
            updatedAt: { lt: refreshBefore },
          },
          data: { updatedAt: new Date() },
        });
      }
    }
    await cleanupExpiredTranslations();
  }

  for (const text of new Set(texts)) {
    const key = cacheKey(text, locale);
    const cached = CACHE.get(key);
    if (cached !== undefined) {
      remember(key, cached);
      resolved.set(text, cached);
      continue;
    }

    const existing = IN_FLIGHT.get(key);
    if (existing) pending.set(text, existing);
    else missing.push({ text, key });
  }

  if (missing.length > 0) {
    if (!config.groq.apiKey) {
      throw new Error("La traduction automatique nécessite GROQ_API_KEY");
    }

    const chunks: { text: string; key: string }[][] = [];
    let chunk: { text: string; key: string }[] = [];
    let chars = 0;
    for (const item of missing) {
      if (chunk.length > 0 && (chunk.length >= 20 || chars + item.text.length > 4_000)) {
        chunks.push(chunk);
        chunk = [];
        chars = 0;
      }
      chunk.push(item);
      chars += item.text.length;
    }
    if (chunk.length > 0) chunks.push(chunk);

    for (const items of chunks) {
      const chunkTexts = items.map(({ text }) => text);
      const work = translationQueue.then(async () => {
        const translations = await translateChunk(chunkTexts, locale);
        if (persist) {
          try {
            await prisma.translationCache.createMany({
              data: items.map(({ text, key }, index) => ({
                id: `translation-${key}`,
                locale,
                model: config.groq.model,
                sourceHash: key,
                sourceText: text,
                translatedText: translations[index],
              })),
              skipDuplicates: true,
            });
          } catch (error) {
            console.error("[translation] Impossible de sauvegarder les traductions en base", error);
          }
        }
        return translations;
      });
      translationQueue = work.then(() => undefined, () => undefined);

      items.forEach(({ text, key }, index) => {
        const textWork = work
          .then((translations) => {
            const translatedText = translations[index];
            remember(key, translatedText);
            return translatedText;
          })
          .finally(() => {
            if (IN_FLIGHT.get(key) === textWork) IN_FLIGHT.delete(key);
          });
        IN_FLIGHT.set(key, textWork);
        pending.set(text, textWork);
      });
    }
  }

  const translatedPending = await Promise.all(
    [...pending].map(async ([text, promise]) => [text, await promise] as const),
  );
  for (const [text, translation] of translatedPending) resolved.set(text, translation);
  return texts.map((text) => {
    const translation = resolved.get(text);
    if (translation === undefined) throw new Error("Traduction manquante pour un texte");
    return translation;
  });
}
