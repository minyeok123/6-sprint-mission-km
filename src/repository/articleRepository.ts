import { prisma } from '../utils/prismaClient';
import { Prisma } from '@prisma/client';

export class ArticleRepository {
  async findMany(options: Prisma.ArticleFindManyArgs) {
    return prisma.article.findMany(options);
  }
  async create(options: Prisma.ArticleCreateArgs) {
    return prisma.article.create(options);
  }
  async findUniqueOrThrow<T extends Prisma.ArticleFindUniqueOrThrowArgs>(
    options: Prisma.SelectSubset<T, Prisma.ArticleFindUniqueOrThrowArgs>,
  ) {
    return prisma.article.findUniqueOrThrow(options);
  }
  async update(option: Prisma.ArticleUpdateArgs) {
    return prisma.article.update(option);
  }
  async delete(option: Prisma.ArticleDeleteArgs) {
    return prisma.article.delete(option);
  }
}
