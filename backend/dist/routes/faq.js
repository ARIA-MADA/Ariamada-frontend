import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { param, requireAuth, validate } from "../middleware/auth.js";
const router = Router();
const createSchema = z.object({
    question: z.string().min(2).max(500),
    answer: z.string().min(2).max(8000),
    category: z.string().max(120).nullish(),
    order: z.number().int().optional(),
    published: z.boolean().optional(),
});
const updateSchema = createSchema.partial();
/** GET /api/faq — public (publiées) ; ?all=true → toutes (admin) */
router.get("/", (req, res, next) => {
    if (req.query.all === "true") {
        requireAuth(req, res, () => listFaqs(req, res, next));
        return;
    }
    listFaqs(req, res, next);
});
async function listFaqs(req, res, next) {
    try {
        const where = req.query.all === "true" ? {} : { published: true };
        const [items, total] = await Promise.all([
            prisma.faq.findMany({ where, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
            prisma.faq.count({ where }),
        ]);
        res.json({ items, total });
    }
    catch (err) {
        next(err);
    }
}
/** POST /api/faq — admin */
router.post("/", requireAuth, validate(createSchema), async (req, res, next) => {
    try {
        const count = await prisma.faq.count();
        const item = await prisma.faq.create({
            data: { ...req.body, order: req.body.order ?? count },
        });
        res.status(201).json(item);
    }
    catch (err) {
        next(err);
    }
});
/** PUT /api/faq/:id — admin */
router.put("/:id", requireAuth, validate(updateSchema), async (req, res, next) => {
    try {
        const item = await prisma.faq.update({ where: { id: param(req, "id") }, data: req.body });
        res.json(item);
    }
    catch (err) {
        next(err);
    }
});
/** DELETE /api/faq/:id — admin */
router.delete("/:id", requireAuth, async (req, res, next) => {
    try {
        await prisma.faq.delete({ where: { id: param(req, "id") } });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=faq.js.map