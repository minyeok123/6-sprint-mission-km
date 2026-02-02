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
  async update(id: number, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      select: {
        id: true,
        productName: true,
        description: true,
        price: true,
        stock: true,
        productTags: { select: { tag: true } },
        createdAt: true,
        productImages: { select: { id: true, url: true } },
        _count: { select: { productLikes: true } },
      },
    });
  }
  async createImages(data: Prisma.ProductImageCreateManyInput[]) {
    return prisma.productImage.createMany({ data });
  }
  async deleteImages(ids: number[]) {
    return prisma.productImage.deleteMany({
      where: { id: { in: ids } },
    });
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
