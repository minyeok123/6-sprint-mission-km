import { User } from '@prisma/client';
import { ProductRepository } from '../repository/productRepository';
import {
  CreateProductType,
  GetProductsQueryType,
  PatchProductType,
} from '../structs/productStruct';
import { HttpError } from '../utils/errors';
import { getIO } from '../socket';
import { NotificationType } from '@prisma/client';
import { prisma } from '../utils/prismaClient';

import { NotificationService } from './notificationService';
import { getS3Url } from '../utils/s3Handler';

export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private notificationService: NotificationService,
  ) {}
  async getProduct(query: GetProductsQueryType) {
    const { page = 1, limit = 10, order, search } = query;
    const orderbyOption = {
      recent: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
    } as const;
    const where = search
      ? { OR: [{ productName: { contains: search } }, { description: { contains: search } }] }
      : {};
    // 프리즈마 내에서 or 사용 방법 {OR:{[{조건1},{조건2}]}}  >  ai 활용
    //{fieldName:{contains:...}} >> contains는 where이라는 옵션 안에있는 특정 필드등에 적용되는 더 세부적인 옵션
    const getProductOptions = {
      where,
      orderBy:
        order && (order === 'recent' || order === 'oldest')
          ? orderbyOption[order]
          : orderbyOption['recent'],
      skip: (page - 1) * limit,
      take: limit,
      // include: { description: false, updatedAt: false }, >> 첫 시도, 잠재적 문제 발생 할 수도있음,prisma에서 의도한 사용방법이 아님
      select: {
        //findMany 도움말 참고
        id: true,
        productName: true,
        price: true,
        createdAt: true,
      },
    };
    const product = await this.productRepository.findMany(getProductOptions);
    return product;
  }

  async createProduct(data: CreateProductType, user: User) {
    const { tag, imageUrls, ...productData } = data;
    let image;
    if (imageUrls && imageUrls.length > 0) {
      image = {
        create: imageUrls.map((url) => ({
          url,
        })),
      };
    }

    let tagConnect;
    if (tag) {
      const existingTag = await this.productRepository.findFirstTag({ where: { tag } });
      if (existingTag) {
        tagConnect = { tag: { connect: { id: existingTag.id } } };
      } else {
        const newTag = await this.productRepository.createTag({ data: { tag } });
        tagConnect = { tag: { connect: { id: newTag.id } } };
      }
    }

    const product = await this.productRepository.create({
      data: {
        ...productData,
        productImages: image,
        productTags: tagConnect ? { create: tagConnect } : undefined,
        user: { connect: { id: user.id } },
      },
      select: {
        id: true,
        productName: true,
        description: true,
        price: true,
        stock: true,
        productTags: { select: { tag: true } },
        createdAt: true,
        _count: { select: { productLikes: true } },
      },
    });
    return product;
  }

  async patchProduct(id: number, data: PatchProductType, user: User) {
    const productId = id;
    const { tag, newImages, deleteImageIds, ...productData } = data;
    const findProduct = await this.productRepository.findUniqueOrThrow({
      where: { id: productId },
      select: { userId: true, price: true },
    });
    if (findProduct.userId !== user.id) {
      throw new HttpError(403, '상품을 수정할 권한이 없습니다.');
    }

    if (deleteImageIds && deleteImageIds.length > 0) {
      await this.productRepository.deleteImages(deleteImageIds);
    }

    if (newImages && newImages.length > 0) {
      await this.productRepository.createImages(newImages.map((url) => ({ productId, url })));
    }

    let tagConnect;
    if (tag) {
      const existingTag = await this.productRepository.findFirstTag({ where: { tag } });
      if (existingTag) {
        tagConnect = { tag: { connect: { id: existingTag.id } } };
      } else {
        const newTag = await this.productRepository.createTag({ data: { tag } });
        tagConnect = { tag: { connect: { id: newTag.id } } };
      }
    }
    const patchedProduct = await this.productRepository.update(productId, {
      ...productData,
      productTags: tagConnect ? { create: tagConnect } : undefined,
    });

    if (productData.price && productData.price !== findProduct.price) {
      const likedUsers = await this.productRepository.findLikes({
        where: { productId: productId },
        select: { userId: true },
      });
      const userIdsToNotify = likedUsers
        .map((liker) => liker.userId)
        .filter((likerId) => likerId !== user.id);

      if (userIdsToNotify.length > 0) {
        await this.notificationService.notifyPriceChange(userIdsToNotify, {
          id: patchedProduct.id,
          productName: patchedProduct.productName,
        });
      }
    }

    return {
      ...patchedProduct,
      productImages: patchedProduct.productImages.map((img) => ({
        id: img.id,
        url: getS3Url(img.url),
      })),
    };
  }

  async getProductDetail(id: number) {
    const productId = id;
    const getProductOptions = {
      where: { id: productId },
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
    };
    const product = await this.productRepository.findUniqueOrThrow(getProductOptions);

    return {
      ...product,
      productImages: product.productImages.map((img) => ({ id: img.id, url: getS3Url(img.url) })),
      isLiked: product._count.productLikes > 0,
    };
  }

  async deleteProduct(id: number, user: User) {
    const productId = id;
    const productToDelete = await this.productRepository.findUniqueOrThrow({
      where: { id: productId },
      select: { userId: true },
    });
    if (productToDelete.userId !== user.id) {
      throw new HttpError(403, '상품을 삭제할 권한이 없습니다.');
    }
    await this.productRepository.delete({
      where: { id: productId },
    });
  }

  async getCreatedProduct(id: number, user: User) {
    const userId = id;

    if (userId !== user.id) {
      throw new HttpError(403, '자신이 등록한 상품만 조회할 수 있습니다.');
    }
    const createdProduct = await this.productRepository.findMany({
      where: { userId: userId },
    });
    // if (!createdProduct) {  >> 등록한 상품이 없다면 빈배열 리턴 >> 그렇다면 아예 작동하지 않는 로직.
    //   throw new HttpError(404, '등록된 상품을 찾을 수 없습니다.');
    // }
    return createdProduct;
  }

  async getLikedProduct(id: number, user: User) {
    const userId = id;
    if (userId !== user.id) {
      throw new HttpError(403, '자신이 좋아요 한 상품만 조회할 수 있습니다.');
    }
    const likedProduct = await this.productRepository.findMany({
      where: { productLikes: { some: { userId: userId } } },
    });

    return likedProduct;
  }
}
