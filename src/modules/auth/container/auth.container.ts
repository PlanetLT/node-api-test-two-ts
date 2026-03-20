
import { AuthController } from "../auth.controller";
import { UserRepository } from "../infrastructure/user.repository";
import { AuthService } from "../applicaiton/auth.service";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
export const authController = new AuthController(authService);