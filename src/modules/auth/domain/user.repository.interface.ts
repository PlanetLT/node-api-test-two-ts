import type { IUser } from "./user.interface";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser>;
  findAll(): Promise<IUser[]>;
}
