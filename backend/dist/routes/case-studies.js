import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { param, requireAuth, validate } from "../middleware/auth.js";
const router = Router();
const createSchema = z.object({
    slug: z.string().min(1).max(240),
    title: z.string().min(1).max(300),
    excerpt: z.string().max(1000).default(""),
    challenge: z.string().max(8000).default(""),
    approach: z.string().max(8000).default(""),
    results: z.array(z.string().max(500)).max(40).default([]),
    services: z.array(z.string().max(200)).max(40).default([]),
    image: z.string().max(1000).nullish(),
    published: z.boolean().default(false),
    order: z.number().int().default(0),
});
const updateSchema = createSchema.partial();
/** GET /api/case-studies — public ; ?all=true → toutes (admin) */
router.get("/", (req, res, next) => {
    if (req.query.all === "true") {
        requireAuth(req, res, () => list(req, res, next));
        return;
    }
    list(req, res, next);
});
async function list(req, res, next) {
    try {
        const where = req.query.all === "true" ? {} : { published: true };
        const [items, total] = await Promise.all([
            prisma.caseStudy.findMany({ where, orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
            prisma.caseStudy.count({ where }),
        ]);
        res.json({ items, total });
    }
    catch (err) {
        next(err);
    }
}
/** GET /api/case-studies/:slug */
router.get("/:slug", async (req, res, next) => {
    try {
        const item = await prisma.caseStudy.findUnique({ where: { slug: param(req, "slug") } });
        if (!item || !item.published) {
            res.status(404).json({ message: "Étude de cas introuvable" });
            return;
        }
        res.json(item);
    }
    catch (err) {
        next(err);
    }
});
/** POST /api/case-studies — admin */
router.post("/", requireAuth, validate(createSchema), async (req, res, next) => {
    try {
        const item = await prisma.caseStudy.create({ data: req.body });
        res.status(201).json(item);
    }
    catch (err) {
        next(err);
    }
});
/** PUT /api/case-studies/:id — admin */
router.put("/:id", requireAuth, validate(updateSchema), async (req, res, next) => {
    try {
        const item = await prisma.caseStudy.update({
            where: { id: param(req, "id") },
            data: req.body,
        });
        res.json(item);
    }
    catch (err) {
        next(err);
    }
});
/** DELETE /api/case-studies/:id — admin */
router.delete("/:id", requireAuth, async (req, res, next) => {
    try {
        await prisma.caseStudy.delete({ where: { id: param(req, "id") } });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=case-studies.js.map