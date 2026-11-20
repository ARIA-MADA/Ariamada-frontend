import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { config } from "../config.js";
export function signToken(user) {
    return jwt.sign(user, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
}
export function setAuthCookie(res, token) {
    res.cookie("aria_token", token, {
        httpOnly: true,
        secure: config.jwt.cookieSecure,
        sameSite: "lax",
        maxAge: 8 * 60 * 60 * 1000, // 8 h
        path: "/",
    });
}
export function clearAuthCookie(res) {
    res.clearCookie("aria_token", { path: "/" });
}
/** Récupère l'utilisateur depuis le cookie (sans bloquer). */
export function readUser(req) {
    const token = req.cookies?.aria_token ??
        (req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.slice(7)
            : undefined);
    if (!token)
        return null;
    try {
        return jwt.verify(token, config.jwt.secret);
    }
    catch {
        return null;
    }
}
/** Middleware : exige un admin connecté. */
export function requireAuth(req, res, next) {
    const user = readUser(req);
    if (!user) {
        res.status(401).json({ message: "Authentification requise" });
        return;
    }
    req.user = user;
    next();
}
/** Paramètre de route toujours en string (Express 5 peut renvoyer string[]). */
export function param(req, name) {
    const raw = req.params[name];
    if (Array.isArray(raw))
        return raw[0] ?? "";
    return raw ?? "";
}
/* ------------------------------------------------------------
   Validation Zod → 400 normalisé
   ------------------------------------------------------------ */
export function validate(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof ZodError) {
                const errors = {};
                for (const issue of err.issues) {
                    const key = issue.path.join(".") || "_";
                    (errors[key] ??= []).push(issue.message);
                }
                res.status(400).json({ message: "Données invalides", errors });
                return;
            }
            next(err);
        }
    };
}
/* ------------------------------------------------------------
   Gestion d'erreur unique
   ------------------------------------------------------------ */
export function errorHandler(err, _req, res, _next) {
    console.error("[api]", err);
    if (res.headersSent)
        return;
    res.status(500).json({ message: "Erreur interne du serveur" });
}
//# sourceMappingURL=auth.js.map