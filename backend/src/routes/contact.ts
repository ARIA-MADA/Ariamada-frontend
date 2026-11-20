import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { param, requireAuth, validate } from "../middleware/auth.js";

const router = Router();

const createSchema = z.object({
  name: z.string().min(2, "Nom requis").max(200),
  company: z.string().max(300).nullish(),
  email: z.string().email("Email invalide").max(200),
  country: z.string().max(120).nullish(),
  phone: z.string().max(60).nullish(),
  message: z.string().min(5, "Message trop court").max(8000),
});

const statusSchema = z.object({
  status: z.enum(["NEW", "READ", "HANDLED"]),
});

/** POST /api/contact — public (rate-limited côté app) */
router.post("/", validate(createSchema), async (req, res, next) => {
  try {
    await prisma.contactMessage.create({ data: req.body });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/** GET /api/contact — admin */
router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.contactMessage.count(),
    ]);
    res.json({ items, total });
  } catch (err) {
    next(err);
  }
});

/** PATCH /api/contact/:id — admin */
router.patch("/:id", requireAuth, validate(statusSchema), async (req, res, next) => {
  try {
    const item = await prisma.contactMessage.update({
      where: { id: param(req, "id") },
      data: { status: req.body.status },
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/contact/:id — admin */
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.contactMessage.delete({ where: { id: param(req, "id") } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
