import bcrypt from "bcrypt";
import crypto from "crypto";
import { JwtService } from "../../../common/services/jwt.service";
import { User } from "../domain/user.entity";
import type { IUserRepository } from "../domain/user.repository.interface";
import type { RegisterInput } from "../schemas/register.schema";

const PASSWORD_SALT_ROUNDS = 10;

export class AuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService
  ) {}

  async registerUser(data: RegisterInput) {
    const exists = await this.userRepo.findByEmail(data.email);
    if (exists) throw new Error("User already registered");

    // Hash before building the entity so plain passwords never reach persistence.
    const hashed = await bcrypt.hash(data.password, PASSWORD_SALT_ROUNDS);

    const user = User.create({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: hashed,
    });

    const savedUser = await this.userRepo.create(user);

    return {
      user: this.toPublicUser(savedUser),
      ...this.jwtService.generateAuthTokens(savedUser.id),
    };
  }

  async getUsers() {
    return this.userRepo.findAll();
  }

  refreshAccessToken(userId: string) {
    return {
      accessToken: this.jwtService.generateAccessToken(userId),
    };
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
