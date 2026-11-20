import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { param, requireAuth, validate } from "../middleware/auth.js";
const router = Router();
const createSchema = z.object({
    service: z.string().min(1, "Service requis").max(120),
    projectDescription: z.string().max(10000).nullish(),
    teamSize: z.string().max(200).nullish(),
    languages: z.string().max(300).nullish(),
    name: z.string().min(2, "Nom requis").max(200),
    company: z.string().max(300).nullish(),
    email: z.string().email("Email invalide").max(200),
    country: z.string().max(120).nullish(),
    phone: z.string().max(60).nullish(),
    message: z.string().max(8000).nullish(),
});
const statusSchema = z.object({
    status: z.enum(["NEW", "CONTACTED", "PROPOSAL_SENT", "CLOSED"]),
});
/** POST /api/quotes — public */
router.post("/", validate(createSchema), async (req, res, next) => {
    try {
        await prisma.quoteRequest.create({ data: req.body });
        res.status(201).json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
/** GET /api/quotes — admin */
router.get("/", requireAuth, async (_req, res, next) => {
    try {
        const [items, total] = await Promise.all([
            prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } }),
            prisma.quoteRequest.count(),
        ]);
        res.json({ items, total });
    }
    catch (err) {
        next(err);
    }
});
/** PATCH /api/quotes/:id — admin */
router.patch("/:id", requireAuth, validate(statusSchema), async (req, res, next) => {
    try {
        const item = await prisma.quoteRequest.update({
            where: { id: param(req, "id") },
            data: { status: req.body.status },
        });
        res.json(item);
    }
    catch (err) {
        next(err);
    }
});
/** DELETE /api/quotes/:id — admin */
router.delete("/:id", requireAuth, async (req, res, next) => {
    try {
        await prisma.quoteRequest.delete({ where: { id: param(req, "id") } });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=quotes.js.map