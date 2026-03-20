import type { NextFunction, Request, Response } from "express";
import type { RegisterInput } from "./schemas/register.schema";
import { AuthService } from "./applicaiton/auth.service";

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.registerUser(req.body as RegisterInput);
      res.json({ id: user.id, name: user.name, email: user.email });
    } catch (err: any) {
      next(err);
    }
  };

  listUsers = async (_req: Request, res: Response) => {
    const users = await this.service.getUsers();
    res.json(users);
  };
}