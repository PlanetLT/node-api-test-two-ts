import { prisma } from "../../../common/prisma/prisma";
import type { IUserRepository } from "../domain/user.repository.interface";
import type { IUser } from "../domain/user.interface";

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
