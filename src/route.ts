import { Router } from "express";
import { AuthController } from "./modules/auth/auth.controller.js";
import { AuthService } from "./modules/auth/applicaiton/auth.service.js";
import { UserRepository } from "./modules/auth/infrastructure/user.repository.js";
import { registerSchema } from "./modules/auth/schemas/register.schema.js";

const router = Router();
const service = new AuthService(new UserRepository());
const controller = new AuthController(service);

router.post("/register", (req, res) => controller.register(req, res, registerSchema));
router.get("/users", (req, res) => controller.listUsers(req, res));

export default router;