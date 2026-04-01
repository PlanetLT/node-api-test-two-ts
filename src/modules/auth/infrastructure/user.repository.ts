import { User } from "../domain/user.entity";
import type { IUserRepository } from "../domain/user.repository.interface";
import type { IUser } from "../domain/user.interface";
import { UserModel } from "./user.model";

type UserRecord = IUser & { _id?: unknown };

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export class UserRepository implements IUserRepository {
  constructor(private readonly userModel = UserModel) {}

  async findByEmail(email: string) {
    // Query Mongo with the normalized email shape stored in the database.
    const user = await this.userModel
      .findOne({ email: normalizeEmail(email) })
      .lean<UserRecord | null>()
      .exec();

    return user ? this.toDomain(user) : null;
  }

  async create(user: User) {
    const created = await this.userModel.create(this.toPersistence(user));

    return this.toDomain(created.toObject<UserRecord>());
  }

  async findAll() {
    const users = await this.userModel.find().lean<UserRecord[]>().exec();

    return users.map((user) => this.toDomain(user));
  }

  // Translate raw database records into domain entities before returning them upward.
  private toDomain(doc: UserRecord): User {
    return User.reconstitute(doc);
  }

  // Translate domain entities into plain persistence objects for Mongoose.
  private toPersistence(user: User): IUser {
    return user.toObject();
  }
}
