import { Router } from "express";
import { registerSchema } from "./modules/auth/schemas/register.schema.js";

import { authController } from "./modules/auth/container/auth.container.js";

const router = Router();

router.post("/register", (req, res) => authController.register(req, res, registerSchema));
router.get("/users", (req, res) => authController.listUsers(req, res));

export default router;