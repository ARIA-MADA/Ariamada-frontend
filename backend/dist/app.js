import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { errorHandler } from "./middleware/auth.js";
import { UPLOADS_ROOT } from "./routes/upload.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import contactRoutes from "./routes/contact.js";
import quoteRoutes from "./routes/quotes.js";
import faqRoutes from "./routes/faq.js";
import caseStudyRoutes from "./routes/case-studies.js";
import knowledgeRoutes from "./routes/knowledge.js";
import chatRoutes from "./routes/chat.js";
import dashboardRoutes from "./routes/dashboard.js";
import uploadRoutes from "./routes/upload.js";
import translationRoutes from "./routes/translations.js";
const app = express();
app.set("trust proxy", 1);
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors({
    origin: [config.frontendUrl, "http://localhost:5173", "http://localhost:4173"],
    credentials: true,
}));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
if (!config.isVercel) {
    app.use("/api/files", express.static(UPLOADS_ROOT, {
        index: false,
        maxAge: config.isProd ? "7d" : 0,
        setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
    }));
}
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Trop de requêtes, réessayez plus tard." },
});
const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Trop de tentatives, réessayez dans quelques minutes." },
});
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Trop de tentatives de connexion." },
});
const translationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Trop de demandes de traduction, réessayez plus tard." },
});
app.use("/api", generalLimiter);
app.get("/api/health", (_req, res) => {
    res.json({ ok: true, env: config.nodeEnv, time: new Date().toISOString() });
});
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", strictLimiter, contactRoutes);
app.use("/api/quotes", strictLimiter, quoteRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/case-studies", caseStudyRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/chat", strictLimiter, chatRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/translations", translationLimiter, translationRoutes);
app.use("/api", (_req, res) => {
    res.status(404).json({ message: "Route introuvable" });
});
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map