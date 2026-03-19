import type { Request, Response } from "express";
import type { ZodType } from "zod";
import type { RegisterInput } from "./schemas/register.schema";
import { AuthService } from "./applicaiton/auth.service";

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response, schema: ZodType<RegisterInput>) => {
    try {
      const data = schema.parse(req.body);
      const user = await this.service.registerUser(data);
      res.json({ id: user.id, name: user.name, email: user.email });
    } catch (err: any) {
      res.status(400).json({ message: err.message || err });
    }
  };

  listUsers = async (_req: Request, res: Response) => {
    const users = await this.service.getUsers();
    res.json(users);
  };
}
