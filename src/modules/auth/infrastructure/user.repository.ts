import { prisma } from "../../../common/prisma/prisma.js";
import type { IUserRepository } from "../domain/user.repository.interface.js";
import type { IUser } from "../domain/user.interface.js";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(user: IUser) {
    return prisma.user.create({ data: user });
  }

  async findAll() {
    return prisma.user.findMany();
  }
}
