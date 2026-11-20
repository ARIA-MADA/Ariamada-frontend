import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ZodError, type ZodSchema } from "zod";
import { config } from "../config.js";

/* ------------------------------------------------------------
   Authentification JWT (cookie httpOnly)
   ------------------------------------------------------------ */
export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie("aria_token", token, {
    httpOnly: true,
    secure: config.jwt.cookieSecure,
    sameSite: "lax",
    maxAge: 8 * 60 * 60 * 1000, // 8 h
    path: "/",
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie("aria_token", { path: "/" });
}

/** Récupère l'utilisateur depuis le cookie (sans bloquer). */
export function readUser(req: Request): AuthUser | null {
  const token =
    (req.cookies?.aria_token as string | undefined) ??
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined);
  if (!token) return null;
  try {
    return jwt.verify(token, config.jwt.secret) as AuthUser;
  } catch {
    return null;
  }
}

/** Middleware : exige un admin connecté. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = readUser(req);
  if (!user) {
    res.status(401).json({ message: "Authentification requise" });
    return;
  }
  req.user = user;
  next();
}

/** Paramètre de route toujours en string (Express 5 peut renvoyer string[]). */
export function param(req: Request, name: string): string {
  const raw = (req.params as Record<string, string | string[] | undefined>)[name];
  if (Array.isArray(raw)) return raw[0] ?? "";
  return raw ?? "";
}

/* ------------------------------------------------------------
   Validation Zod → 400 normalisé
   ------------------------------------------------------------ */
export function validate<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string[]> = {};
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
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("[api]", err);
  if (res.headersSent) return;
  res.status(500).json({ message: "Erreur interne du serveur" });
}
