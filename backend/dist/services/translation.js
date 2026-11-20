import { createHash } from "node:crypto";
import { config } from "../config.js";
const CACHE_LIMIT = 200;
const CACHE = new Map();
const IN_FLIGHT = new Map();
function cacheKey(texts, locale) {
    return createHash("sha256").update(`${locale}\0${JSON.stringify(texts)}`).digest("hex");
}
function remember(key, value) {
    CACHE.delete(key);
    CACHE.set(key, value);
    if (CACHE.size > CACHE_LIMIT) {
        const oldest = CACHE.keys().next().value;
        if (oldest)
            CACHE.delete(oldest);
    }
}
function parseTranslation(content, expected) {
    const start = content.indexOf("[");
    const end = content.lastIndexOf("]");
    if (start < 0 || end <= start)
        throw new Error("Réponse de traduction invalide");
    const result = JSON.parse(content.slice(start, end + 1));
    if (!Array.isArray(result) ||
        result.length !== expected ||
        result.some((value) => typeof value !== "string")) {
        throw new Error("La traduction ne correspond pas aux textes envoyés");
    }
    return result;
}
async function translateChunk(texts, locale) {
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
                    content: "You are a professional website translator. Translate each input string into natural English. Preserve meaning, tone, punctuation, placeholders, URLs, email addresses, product names, code, and formatting. If text is already English, return it unchanged. Return only a JSON array of strings, in the exact same order and with exactly the same number of elements.",
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
    const data = (await response.json());
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content)
        throw new Error("Réponse de traduction vide");
    return parseTranslation(content, texts.length);
}
export async function translateTexts(texts, locale) {
    if (locale === "fr")
        return texts;
    if (!config.groq.apiKey)
        throw new Error("La traduction automatique nécessite GROQ_API_KEY");
    if (texts.length === 0)
        return [];
    const key = cacheKey(texts, locale);
    const cached = CACHE.get(key);
    if (cached) {
        CACHE.delete(key);
        CACHE.set(key, cached);
        return cached;
    }
    const existing = IN_FLIGHT.get(key);
    if (existing)
        return existing;
    const work = (async () => {
        const chunks = [];
        let chunk = [];
        let chars = 0;
        for (const text of texts) {
            if (chunk.length > 0 && (chunk.length >= 80 || chars + text.length > 12_000)) {
                chunks.push(chunk);
                chunk = [];
                chars = 0;
            }
            chunk.push(text);
            chars += text.length;
        }
        if (chunk.length > 0)
            chunks.push(chunk);
        const translatedChunks = new Array(chunks.length);
        let nextChunk = 0;
        const workers = Array.from({ length: Math.min(4, chunks.length) }, async () => {
            while (nextChunk < chunks.length) {
                const index = nextChunk++;
                translatedChunks[index] = await translateChunk(chunks[index], locale);
            }
        });
        await Promise.all(workers);
        const translated = translatedChunks.flat();
        remember(key, translated);
        return translated;
    })();
    IN_FLIGHT.set(key, work);
    try {
        return await work;
    }
    finally {
        IN_FLIGHT.delete(key);
    }
}
//# sourceMappingURL=translation.js.map