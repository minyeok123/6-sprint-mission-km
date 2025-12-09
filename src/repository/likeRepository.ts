import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prismaClient';

export class LikeRepository {
  async create(options: Prisma.LikeCreateArgs) {
    return prisma.like.create(options);
  }
  async delete(options: Prisma.LikeDeleteArgs) {
    return prisma.like.delete(options);
  }
  async findFirst(options: Prisma.LikeFindFirstArgs) {
    return prisma.like.findFirst(options);
  }
}
