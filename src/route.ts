import { Router } from "express";
import { authController } from "./modules/auth/container/auth.container";
import { registerSchema } from "./modules/auth/schemas/register.schema";

const router = Router();

router.post("/register", (req, res) => authController.register(req, res, registerSchema));
router.get("/users", (req, res) => authController.listUsers(req, res));

export default router;