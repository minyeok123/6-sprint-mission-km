import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prismaClient';

export class LikeRepository {
  async createProductLike(options: Prisma.ProductLikeCreateArgs) {
    return prisma.productLike.create(options);
  }
  async deleteProductLike(options: Prisma.ProductLikeDeleteArgs) {
    return prisma.productLike.delete(options);
  }
  async findFirstProductLike(options: Prisma.ProductLikeFindFirstArgs) {
    return prisma.productLike.findFirst(options);
  }

  async createArticleLike(options: Prisma.ArticleLikeCreateArgs) {
    return prisma.articleLike.create(options);
  }
  async deleteArticleLike(options: Prisma.ArticleLikeDeleteArgs) {
    return prisma.articleLike.delete(options);
  }
  async findFirstArticleLike(options: Prisma.ArticleLikeFindFirstArgs) {
    return prisma.articleLike.findFirst(options);
  }
}
