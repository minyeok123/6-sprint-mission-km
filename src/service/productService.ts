import { User } from '@prisma/client';
import { ProductRepository } from '../repository/productRepository';
import {
  CreateProductType,
  GetProductsQueryType,
  PatchProductType,
} from '../structs/productStruct';
import { HttpError } from '../utils/errors';

export class ProductService {
  constructor(private productRepository: ProductRepository) {}
  async getProduct(query: GetProductsQueryType) {
    const { page = 1, limit = 10, order, search } = query;
    const orderbyOption = {
      recent: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
    } as const;
    // const where = search ? { name || description:search} : {}; >> 첫 시도
    const where = search
      ? { OR: [{ name: { contains: search } }, { description: { contains: search } }] }
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

  async createProduct(data: CreateProductType, user: User, files?: Express.Multer.File[]) {
    const { ...productData } = data;
    let image;
    if (Array.isArray(files) && files.length > 0) {
      image = {
        create: files.map((file) => ({
          url: `/files/product-image/${file.filename}`,
        })),
      };
    }
    const dataToSave = {
      data: {
        ...productData,
        productImages: image,
        user: { connect: { id: user.id } },
      },
    };
    const product = await this.productRepository.create(dataToSave);
    return product;
  }

  async patchProduct(id: number, data: PatchProductType, user: User) {
    const productId = id;
    const { ...productData } = data;
    const findProduct = await this.productRepository.findUniqueOrThrow({
      where: { id: productId },
      select: { userId: true },
    });
    if (findProduct.userId !== user.id) {
      throw new HttpError(403, '상품을 수정할 권한이 없습니다.');
    }
    const dataToUpdate = {
      where: { id: productId },
      data: { ...productData },
    };
    const patchedProduct = await this.productRepository.update(dataToUpdate);
    return patchedProduct;
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
        tag: true,
        createdAt: true,
        _count: { select: { like: true } },
      },
    };
    const product = await this.productRepository.findUniqueOrThrow(getProductOptions);

    return { ...product, isLiked: product._count.like > 0 };
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
      where: { like: { some: { userId: userId } } },
    });

    return likedProduct;
  }
}
