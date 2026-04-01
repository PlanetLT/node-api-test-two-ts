import type { User } from "./user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
}
