import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { param, requireAuth, validate } from "../middleware/auth.js";

const router = Router();

const createSchema = z.object({
  category: z.string().min(1).max(120),
  question: z.string().min(2).max(500),
  answer: z.string().min(2).max(8000),
  active: z.boolean().default(true),
});

const updateSchema = createSchema.partial();

/** GET /api/knowledge — admin (base du chatbot) */
router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const [items, total] = await Promise.all([
      prisma.knowledge.findMany({ orderBy: [{ category: "asc" }, { updatedAt: "desc" }] }),
      prisma.knowledge.count(),
    ]);
    res.json({ items, total });
  } catch (err) {
    next(err);
  }
});

/** POST /api/knowledge — admin */
router.post("/", requireAuth, validate(createSchema), async (req, res, next) => {
  try {
    const item = await prisma.knowledge.create({ data: req.body });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

/** PUT /api/knowledge/:id — admin */
router.put("/:id", requireAuth, validate(updateSchema), async (req, res, next) => {
  try {
    const item = await prisma.knowledge.update({
      where: { id: param(req, "id") },
      data: req.body,
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/knowledge/:id — admin */
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.knowledge.delete({ where: { id: param(req, "id") } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
