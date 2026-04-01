import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../domain/user.entity";
import type { IUserRepository } from "../domain/user.repository.interface";
import type { RegisterInput } from "../schemas/register.schema";

const PASSWORD_SALT_ROUNDS = 10;

export class AuthService {
  constructor(private readonly userRepo: IUserRepository) {}

  async registerUser(data: RegisterInput) {
    const exists = await this.userRepo.findByEmail(data.email);
    if (exists) throw new Error("User already registered");

    const hashed = await bcrypt.hash(data.password, PASSWORD_SALT_ROUNDS);

    const user = User.create({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: hashed,
    });

    return this.userRepo.create(user);
  }

  async getUsers() {
    return this.userRepo.findAll();
  }
}
