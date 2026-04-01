import type { IUserRepository } from "../domain/user.repository.interface";
import type { IUser } from "../domain/user.interface";
import { UserModel } from "./user.model";

type UserRecord = IUser & { _id?: unknown };

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export class UserRepository implements IUserRepository {
  constructor(private readonly userModel = UserModel) {}

  async findByEmail(email: string) {
    const user = await this.userModel
      .findOne({ email: normalizeEmail(email) })
      .lean<UserRecord | null>()
      .exec();

    return user ? this.toDomain(user) : null;
  }

  async create(user: IUser) {
    const created = await this.userModel.create({
      ...user,
      email: normalizeEmail(user.email),
    });

    return this.toDomain(created.toObject<UserRecord>());
  }

  async findAll() {
    const users = await this.userModel.find().lean<UserRecord[]>().exec();

    return users.map((user) => this.toDomain(user));
  }

  private toDomain(doc: UserRecord): IUser {
    return {
      id: doc.id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
      ...(doc.createdAt ? { createdAt: doc.createdAt } : {}),
    };
  }
}
