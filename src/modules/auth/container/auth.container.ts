
import { AuthController } from "../auth.controller.js";
import { UserRepository } from "../infrastructure/user.repository.js";
import { AuthService } from "../applicaiton/auth.service.js";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
export const authController = new AuthController(authService);