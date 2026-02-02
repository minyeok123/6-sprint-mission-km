import { prisma } from '../utils/prismaClient';
import { Prisma } from '@prisma/client';

export class AuthRepository {
  async create(options: Prisma.UserCreateArgs) {
    return await prisma.user.create(options);
  }
  async findUnique<T extends Prisma.UserFindUniqueArgs>(options: T) {
    return await prisma.user.findUnique(options);
  }
  async update<T extends Prisma.UserUpdateArgs>(options: T) {
    return await prisma.user.update(options);
  }
  async delete(options: Prisma.UserDeleteArgs) {
    return await prisma.user.delete(options);
  }
}
