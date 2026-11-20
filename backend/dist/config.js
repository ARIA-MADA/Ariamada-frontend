import "dotenv/config";
/** Configuration centralisée — toute la config passe par ici (jamais de clé côté client). */
const env = process.env;
export const config = {
    port: Number(env.PORT ?? 4000),
    nodeEnv: env.NODE_ENV ?? "development",
    isProd: (env.NODE_ENV ?? "development") === "production",
    isVercel: env.VERCEL === "1",
    databaseUrl: env.DATABASE_URL ?? "",
    jwt: {
        secret: env.JWT_SECRET ?? "",
        expiresIn: env.JWT_EXPIRES_IN ?? "8h",
        cookieSecure: env.COOKIE_SECURE === "true",
    },
    admin: {
        email: env.ADMIN_EMAIL ?? "admin@aria-mg.com",
        password: env.ADMIN_PASSWORD ?? "",
    },
    /** Groq — clé serveur pour le chatbot et les traductions, jamais exposée au bundle */
    groq: {
        apiKey: env.GROQ_API_KEY ?? "",
        model: env.GROQ_MODEL ?? "openai/gpt-oss-120b",
    },
    frontendUrl: env.FRONTEND_URL ?? "http://localhost:5173",
};
export function assertConfig() {
    const problems = [];
    if (!config.databaseUrl)
        problems.push("DATABASE_URL manquant");
    if (!config.jwt.secret || config.jwt.secret.length < 32)
        problems.push("JWT_SECRET manquant ou trop court (min. 32 caractères)");
    if (!config.groq.apiKey)
        console.warn("⚠ GROQ_API_KEY absent — chatbot en mode secours et traductions automatiques indisponibles.");
    return problems;
}
//# sourceMappingURL=config.js.map