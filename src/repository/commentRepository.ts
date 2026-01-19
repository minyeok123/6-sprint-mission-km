import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prismaClient';

export class CommentRepository {
  // Product Comment
  async createProductComment(options: Prisma.ProductCommentCreateArgs) {
    return prisma.productComment.create(options);
  }
  async updateProductComment(options: Prisma.ProductCommentUpdateArgs) {
    return prisma.productComment.update(options);
  }
  async findManyProductComment(options: Prisma.ProductCommentFindManyArgs) {
    return prisma.productComment.findMany(options);
  }
  async findUniqueProductComment(options: Prisma.ProductCommentFindUniqueArgs) {
    return prisma.productComment.findUnique(options);
  }
  async deleteProductComment(options: Prisma.ProductCommentDeleteArgs) {
    return prisma.productComment.delete(options);
  }

  // Article Comment
  async createArticleComment(options: Prisma.ArticleCommentCreateArgs) {
    return prisma.articleComment.create(options);
  }
  async updateArticleComment(options: Prisma.ArticleCommentUpdateArgs) {
    return prisma.articleComment.update(options);
  }
  async findManyArticleComment(options: Prisma.ArticleCommentFindManyArgs) {
    return prisma.articleComment.findMany(options);
  }
  async findUniqueArticleComment(options: Prisma.ArticleCommentFindUniqueArgs) {
    return prisma.articleComment.findUnique(options);
  }
  async deleteArticleComment(options: Prisma.ArticleCommentDeleteArgs) {
    return prisma.articleComment.delete(options);
  }
}
