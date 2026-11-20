import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
/** GET /api/dashboard/stats — admin */
router.get("/stats", requireAuth, async (_req, res, next) => {
    try {
        const [projectsTotal, projectsCompleted, projectsInProgress, messagesTotal, messagesNew, quotesTotal, quotesNew] = await Promise.all([
            prisma.project.count(),
            prisma.project.count({ where: { status: "COMPLETED" } }),
            prisma.project.count({ where: { status: "IN_PROGRESS" } }),
            prisma.contactMessage.count(),
            prisma.contactMessage.count({ where: { status: "NEW" } }),
            prisma.quoteRequest.count(),
            prisma.quoteRequest.count({ where: { status: "NEW" } }),
        ]);
        res.json({
            projectsTotal,
            projectsCompleted,
            projectsInProgress,
            messagesTotal,
            messagesNew,
            quotesTotal,
            quotesNew,
        });
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=dashboard.js.map