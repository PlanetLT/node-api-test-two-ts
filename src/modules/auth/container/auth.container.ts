import { AuthController } from "../auth.controller";
import {
  createRequireAccessToken,
  createRequireRefreshToken,
} from "../../../common/middlewares/auth";
import { JwtService } from "../../../common/services/jwt.service";
import { UserRepository } from "../infrastructure/user.repository";
import { AuthService } from "../applicaiton/auth.service";

const userRepository = new UserRepository();
const jwtService = new JwtService();
const authService = new AuthService(userRepository, jwtService);
export const authController = new AuthController(authService);
export const requireAccessToken = createRequireAccessToken(jwtService);
export const requireRefreshToken = createRequireRefreshToken(jwtService);
