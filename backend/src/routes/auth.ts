import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../prisma.js";
import {
  clearAuthCookie,
  readUser,
  requireAuth,
  setAuthCookie,
  signToken,
  validate,
} from "../middleware/auth.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email("Email invalide").max(200),
  password: z.string().min(8, "Mot de passe trop court").max(200),
});

/** POST /api/auth/login */
router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as z.infer<typeof loginSchema>;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      res.status(401).json({ message: "Identifiants incorrects" });
      return;
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401).json({ message: "Identifiants incorrects" });
      return;
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    setAuthCookie(res, signToken(payload));
    res.json({ user: payload });
  } catch (err) {
    next(err);
  }
});

/** POST /api/auth/logout */
router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
});

/** GET /api/auth/me */
router.get("/me", (req, res) => {
  const user = readUser(req);
  if (!user) {
    res.json(null);
    return;
  }
  res.json({ id: user.id, email: user.email, name: null, role: user.role });
});

/** POST /api/auth/change-password — admin connecté */
router.post(
  "/change-password",
  requireAuth,
  validate(
    z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(12, "12 caractères minimum"),
    }),
  ),
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body as {
        currentPassword: string;
        newPassword: string;
      };
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        res.status(400).json({ message: "Mot de passe actuel incorrect" });
        return;
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(newPassword, 12) },
      });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
);

export default router;
