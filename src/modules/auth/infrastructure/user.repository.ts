import { getCollection } from "../../../common/db/mongo";
import type { IUserRepository } from "../domain/user.repository.interface";
import type { IUser } from "../domain/user.interface";

type UserDocument = Omit<IUser, "id"> & { _id: string };

export class UserRepository implements IUserRepository {
  private async users() {
    return getCollection<UserDocument>("users");
  }

  async findByEmail(email: string) {
    const collection = await this.users();
    const user = await collection.findOne({ email });
    if (!user) return null;
    return this.toDomain(user);
  }

  async create(user: IUser) {
    const collection = await this.users();
    const doc: UserDocument = {
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    };
    await collection.insertOne(doc);
    return this.toDomain(doc);
  }

  async findAll() {
    const collection = await this.users();
    const users = await collection.find().toArray();
    return users.map((user) => this.toDomain(user));
  }

  private toDomain(doc: UserDocument): IUser {
    return {
      id: doc._id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
    };
  }
}
