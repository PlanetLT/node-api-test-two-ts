import  { UserRepository } from "../infrastructure/user.repository";
import type { RegisterInput } from "../schemas/register.schema";
import { User } from "../domain/user.entity";
import bcrypt from "bcrypt";
import crypto from "crypto";

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async registerUser(data: RegisterInput) {
    const exists = await this.userRepo.findByEmail(data.email);
    if (exists) throw new Error("User already registered");

    const hashed = await bcrypt.hash(data.password, 10);

    const user = User.create({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: hashed,
      createdAt: new Date(),
    });

    return this.userRepo.create(user);
  }

  async getUsers() {
    return this.userRepo.findAll();
  }
}
