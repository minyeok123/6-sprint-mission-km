import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prismaClient';

export class UserRepository {
  async findMany(options: Prisma.UserFindManyArgs) {
    return prisma.user.findMany(options);
  }
  async delete(options: Prisma.UserDeleteArgs) {
    return prisma.user.delete(options);
  }
}
