import { prisma } from '../utils/prismaClient';
import { Prisma } from '@prisma/client';

export class AuthRepository {
  async create(options: Prisma.UserCreateArgs) {
    return await prisma.user.create(options);
  }
  async findUnique(options: Prisma.UserFindUniqueArgs) {
    return await prisma.user.findUnique(options);
  }
  async update(options: Prisma.UserUpdateArgs) {
    return await prisma.user.update(options);
  }
}
