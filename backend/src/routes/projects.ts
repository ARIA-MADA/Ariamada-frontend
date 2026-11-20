import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { param, requireAuth, validate } from "../middleware/auth.js";

const router = Router();

const projectSchema = z.object({
  slug: z.string().min(1).max(240),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(5000),
  fullDescription: z.string().max(20000).nullish(),
  objective: z.string().max(1000).nullish(),
  client: z.string().max(300).nullish(),
  duration: z.string().max(200).nullish(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING"),
  url: z.string().max(1000).nullish(),
  technologies: z.array(z.string().max(120)).max(40).default([]),
  goals: z.array(z.string().max(500)).max(40).default([]),
  solutions: z.array(z.string().max(500)).max(40).default([]),
  caseStudyExcerpt: z.string().max(1000).nullish(),
  caseStudyChallenge: z.string().max(8000).nullish(),
  caseStudyApproach: z.string().max(8000).nullish(),
  caseStudyResults: z.array(z.string().max(500)).max(40).default([]),
  caseStudyServices: z.array(z.string().max(200)).max(40).default([]),
  image: z.string().max(1000).nullish(),
  published: z.boolean().default(false),
  order: z.number().int().default(0),
});

const updateSchema = projectSchema.partial();

/** GET /api/projects — public (publiés) ; ?all=true → tous (admin) */
router.get("/", (req, res, next) => {
  if (req.query.all === "true") {
    requireAuth(req, res, () => listProjects(req, res, next));
    return;
  }
  listProjects(req, res, next);
});

async function listProjects(
  req: import("express").Request,
  res: import("express").Response,
  next: import("express").NextFunction,
) {
  try {
    const onlyPublished = req.query.all !== "true";
    const where = onlyPublished ? { published: true } : {};
    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.project.count({ where }),
    ]);
    res.json({ items, total });
  } catch (err) {
    next(err);
  }
}

/** GET /api/projects/admin/:id — admin */
router.get("/admin/:id", requireAuth, async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: param(req, "id") } });
    if (!project) {
      res.status(404).json({ message: "Réalisation introuvable" });
      return;
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
});

/** GET /api/projects/:slug */
router.get("/:slug", async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({ where: { slug: param(req, "slug") } });
    if (!project || !project.published) {
      res.status(404).json({ message: "Réalisation introuvable" });
      return;
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
});

/** POST /api/projects — admin */
router.post("/", requireAuth, validate(projectSchema), async (req, res, next) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

/** PUT /api/projects/:id — admin */
router.put("/:id", requireAuth, validate(updateSchema), async (req, res, next) => {
  try {
    const project = await prisma.project.update({
      where: { id: param(req, "id") },
      data: req.body,
    });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/projects/:id — admin */
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.project.delete({ where: { id: param(req, "id") } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
