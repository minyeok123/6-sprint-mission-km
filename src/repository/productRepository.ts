import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prismaClient';

export class ProductRepository {
  async findMany(options: Prisma.ProductFindManyArgs) {
    return prisma.product.findMany(options);
  }
  async findUniqueOrThrow<T extends Prisma.ProductFindUniqueOrThrowArgs>(
    options: Prisma.SelectSubset<T, Prisma.ProductFindUniqueOrThrowArgs>,
  ) {
    return prisma.product.findUniqueOrThrow(options);
  }
  async findUnique(options: Prisma.ProductFindUniqueArgs) {
    return prisma.product.findUnique(options);
  }
  async create(options: Prisma.ProductCreateArgs) {
    return prisma.product.create(options);
  }
  async update(options: Prisma.ProductUpdateArgs) {
    return prisma.product.update(options);
  }
  async delete(options: Prisma.ProductDeleteArgs) {
    return prisma.product.delete(options);
  }
  async findFirstTag(options: Prisma.TagFindFirstArgs) {
    return prisma.tag.findFirst(options);
  }
  async createTag(options: Prisma.TagCreateArgs) {
    return prisma.tag.create(options);
  }
  async findLikes(options: Prisma.ProductLikeFindManyArgs) {
    return prisma.productLike.findMany(options);
  }
}
