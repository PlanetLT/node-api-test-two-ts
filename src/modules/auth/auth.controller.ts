import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../../common/errors/http-error";
import type { RegisterInput } from "./schemas/register.schema";
import { AuthService } from "./applicaiton/auth.service";

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.registerUser(req.body as RegisterInput);
      res.json(result);
    } catch (err: any) {
      next(err);
    }
  };

  refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth?.userId;

      if (!userId) {
        throw new HttpError("Unauthorized", 401, "UNAUTHORIZED");
      }

      res.json(this.service.refreshAccessToken(userId));
    } catch (err) {
      next(err);
    }
  };

  listUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.service.getUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  };
}
