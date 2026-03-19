// domain/user.entity.ts
import type { IUser } from "./user.interface.js";

export class User implements IUser {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  createdAt?: Date;

  constructor(data: IUser) {
    Object.assign(this, data);
  }

  static create(data: IUser) {
    return new User(data);
  }
}
