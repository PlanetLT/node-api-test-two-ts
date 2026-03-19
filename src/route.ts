import { Router } from "express";
import { AuthController } from "./modules/auth/auth.controller";
import { AuthService } from "./modules/auth/applicaiton/auth.service";
import { UserRepository } from "./modules/auth/infrastructure/user.repository";
import { registerSchema } from "./modules/auth/schemas/register.schema";

const router = Router();
const service = new AuthService(new UserRepository());
const controller = new AuthController(service);

router.post("/register", (req, res) => controller.register(req, res, registerSchema));
router.get("/users", (req, res) => controller.listUsers(req, res));

export default router;