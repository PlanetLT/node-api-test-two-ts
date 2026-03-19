import type { IUser } from "./user.interface.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser>;
  findAll(): Promise<IUser[]>;
}
