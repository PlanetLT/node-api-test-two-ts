import { Router } from "express";
import { registerSchema } from "./modules/auth/schemas/register.schema";
import { validate } from "./common/middlewares/validate";

import { authController } from "./modules/auth/container/auth.container";

const router = Router();

// Validate the incoming payload before it reaches the controller/service layers.
router.post("/register", validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);
router.get("/users", (req, res) => authController.listUsers(req, res));

export default router;
