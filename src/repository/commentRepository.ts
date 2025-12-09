import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prismaClient';

export class CommentRepository {
  async create(options: Prisma.CommentCreateArgs) {
    return prisma.comment.create(options);
  }
  async update(options: Prisma.CommentUpdateArgs) {
    return prisma.comment.update(options);
  }
  async findMany(options: Prisma.CommentFindManyArgs) {
    return prisma.comment.findMany(options);
  }
  async findUnique(options: Prisma.CommentFindUniqueArgs) {
    return prisma.comment.findUnique(options);
  }
  async delete(options: Prisma.CommentDeleteArgs) {
    return prisma.comment.delete(options);
  }
}
