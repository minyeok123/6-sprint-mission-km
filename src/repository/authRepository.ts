import { prisma } from '../utils/prismaClient';
import { Prisma } from '@prisma/client';

export class AuthRepository {
  async create(options: Prisma.UserCreateArgs) {
    return await prisma.user.create(options);
  }
  async findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        nickname: true,
        email: true,
        createdAt: true,
        profileImage: { select: { url: true } },
      },
    });
  }
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
  async update(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        nickname: true,
        email: true,
        createdAt: true,
        profileImage: { select: { url: true } },
      },
    });
  }
  async updatePassword(id: number, password: string) {
    return prisma.user.update({
      where: { id },
      data: { password },
    });
  }
  async delete(options: Prisma.UserDeleteArgs) {
    return await prisma.user.delete(options);
  }
}
