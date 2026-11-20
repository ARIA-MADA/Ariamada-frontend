import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { del as deleteBlob, put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { config } from "../config.js";
import { requireAuth } from "../middleware/auth.js";

/* ------------------------------------------------------------
   Stockage d'images : local en développement, Vercel Blob en production.
   ------------------------------------------------------------ */
const HERE = path.dirname(fileURLToPath(import.meta.url)); // src/routes
export const UPLOADS_ROOT = path.resolve(HERE, "..", "..", "uploads"); // backend/uploads

if (!config.isVercel) fs.mkdirSync(UPLOADS_ROOT, { recursive: true });

const ALLOWED = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
]);

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(UPLOADS_ROOT, "projects");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = ALLOWED.get(file.mimetype) ?? ".jpg";
    cb(null, `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`);
  },
});

const upload = multer({
  storage: config.isVercel ? multer.memoryStorage() : diskStorage,
  limits: { fileSize: 4 * 1024 * 1024, files: 1 }, // marge sous la limite du corps Vercel
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(new Error("Format d'image non autorisé (JPEG, PNG, WebP, AVIF, GIF, SVG)"));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

/** Autorise les uploads directement du navigateur vers Vercel Blob. */
router.post("/client-token", requireAuth, async (req, res, next) => {
  if (!config.isVercel) {
    res.status(400).json({ message: "L'upload direct est réservé à Vercel" });
    return;
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(503).json({ message: "Stockage d'images non configuré sur Vercel" });
    return;
  }

  try {
    const result = await handleUpload({
      request: req,
      body: req.body as HandleUploadBody,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^projects\/[A-Za-z0-9._-]+$/.test(pathname)) {
          throw new Error("Chemin d'image invalide");
        }
        return {
          allowedContentTypes: [...ALLOWED.keys()],
          maximumSizeInBytes: 4 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/upload — admin
 * Champ multipart « file ». Renvoie l'URL publique de l'image.
 * En production, renvoie l'URL publique Vercel Blob ; en local, une URL /api/files.
 */
router.post("/", requireAuth, (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      const message = err instanceof multer.MulterError
        ? err.code === "LIMIT_FILE_SIZE"
          ? "Image trop volumineuse (4 Mo maximum)"
          : err.message
        : err.message || "Échec de l'upload";
      res.status(400).json({ message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: "Aucun fichier reçu" });
      return;
    }
    if (config.isVercel) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        res.status(503).json({ message: "Stockage d'images non configuré sur Vercel" });
        return;
      }
      const ext = ALLOWED.get(req.file.mimetype) ?? ".jpg";
      const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
      void put(`projects/${filename}`, req.file.buffer, {
        access: "public",
        contentType: req.file.mimetype,
      }).then(
        (blob) => res.status(201).json({ url: blob.url }),
        next,
      );
      return;
    }
    res.status(201).json({ url: `/api/files/projects/${req.file.filename}` });
  });
});

/** DELETE /api/upload?path=projects/xxx.jpg — admin (remplace une image) */
router.delete("/", requireAuth, (req, res) => {
  const raw = String(req.query.path ?? "");
  if (config.isVercel) {
    if (!/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/projects\/[A-Za-z0-9._-]+$/.test(raw)) {
      res.status(400).json({ message: "Chemin d'image invalide" });
      return;
    }
    void deleteBlob(raw).then(
      () => res.status(204).end(),
      (err: unknown) => {
        console.error("[upload] suppression Blob", err);
        res.status(500).json({ message: "Impossible de supprimer l'image" });
      },
    );
    return;
  }
  // Sécurité : chemin relatif strict, pas de « .. », pas d'absolu
  const clean = path.normalize(raw).replace(/^(\.\.[/\\])+/, "");
  if (!clean || clean.startsWith("..") || path.isAbsolute(clean)) {
    res.status(400).json({ message: "Chemin d'image invalide" });
    return;
  }
  const target = path.join(UPLOADS_ROOT, clean);
  if (!target.startsWith(UPLOADS_ROOT)) {
    res.status(400).json({ message: "Chemin d'image invalide" });
    return;
  }
  if (!fs.existsSync(target)) {
    res.status(404).json({ message: "Image introuvable" });
    return;
  }
  fs.unlinkSync(target);
  res.status(204).end();
});

export default router;
