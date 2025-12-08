import {
  CreateProductType,
  GetProductsQueryType,
  PatchProductType,
  ProductIdParams,
} from '../structs/productStruct';
import { UserIdParams } from '../structs/userStruct';
import { HttpError } from '../utils/errors';
import { prisma } from '../utils/prismaClient';
import { Request, Response } from 'express';

export class ProductController {
  //상품 리스트 조회
  static getProduct = async (req: Request, res: Response) => {
    const { page = 0, limit = 10, order, search } = req.query as GetProductsQueryType;
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
    const product = await prisma.product.findMany({
      where,
      orderBy:
        order && (order === 'recent' || order === 'oldest')
          ? orderbyOption[order]
          : orderbyOption['recent'],
      skip: page,
      take: limit,
      // include: { description: false, updatedAt: false }, >> 첫 시도, 잠재적 문제 발생 할 수도있음,prisma에서 의도한 사용방법이 아님
      select: {
        //findMany 도움말 참고
        id: true,
        productName: true,
        price: true,
        createdAt: true,
      },
    });
    res.status(200).send(product);
  };
  static createProduct = async (req: Request, res: Response) => {
    const { ...productData } = req.body as CreateProductType;

    const productImage = req.files;
    let image;
    if (Array.isArray(productImage) && productImage.length > 0) {
      image = {
        create: productImage.map((file) => ({
          url: `/files/product-image/${file.filename}`,
        })),
      };
    }
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }
    const product = await prisma.product.create({
      data: {
        ...productData,
        productImages: image,
        user: { connect: { id: user.id } },
      },
    });
    res.send(product);
  };
  //상품 상세 조회
  static getProductDetail = async (req: Request, res: Response) => {
    const { productId } = ProductIdParams.create(req.params);
    const product = await prisma.product.findUniqueOrThrow({
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
    });
    const response = {
      ...product,
      isLiked: product['_count'].like > 0,
    };
    res.status(200).send(response);
  };
  //상품 정보 수정
  static patchProduct = async (req: Request, res: Response) => {
    const { productId } = ProductIdParams.create(req.params);
    const { ...productData } = req.body as PatchProductType;
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }
    const product = await prisma.$transaction(async (tx) => {
      const findProduct = await tx.product.findUniqueOrThrow({
        where: { id: productId },
      });
      if (findProduct.userId !== user.id) {
        throw new HttpError(401, '잘못된 접근입니다.');
      }
      const patchedProduct = await tx.product.update({
        where: { id: productId },
        data: { ...productData },
      });
      console.log(productData);
      return patchedProduct;
    });
    res.status(200).send(product);
  };

  //상품 삭제

  static deleteProduct = async (req: Request, res: Response) => {
    const { productId } = ProductIdParams.create(req.params);
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }

    await prisma.$transaction(async (tx) => {
      const foundProduct = await tx.product.findUniqueOrThrow({
        where: { id: productId },
      });
      if (foundProduct.userId !== user.id) {
        throw new HttpError(401, '잘못된 접근입니다.');
      }
      await tx.product.delete({
        where: { id: productId },
      });
    });

    res.sendStatus(204);
  };
  //게시 상품 조회
  static getCreatedProduct = async (req: Request, res: Response) => {
    const { userId } = UserIdParams.create(req.params);
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }

    const product = await prisma.$transaction(async (tx) => {
      const foundUser = await tx.user.findUnique({ where: { id: userId } });
      if (!foundUser) {
        throw new HttpError(401, '회원을 찾을 수 없습니다.');
      }
      if (foundUser.id !== user.id) {
        throw new HttpError(401, '잘못된 접근입니다.');
      }
      const createdProduct = await tx.product.findMany({
        where: { userId: userId },
      });
      if (!createdProduct) {
        throw new HttpError(401, '등록된 상품을 찾을 수 없습니다.');
      }
      return createdProduct;
    });
    res.status(200).send(product);
  };

  //좋아요 상품 조회
  static getLikedProduct = async (req: Request, res: Response) => {
    const { userId } = UserIdParams.create(req.params);
    const user = req.user;
    if (!user) {
      return res.status(401).send({ message: '잘못된 접근입니다.' });
    }
    if (userId !== user.id) {
      return res.status(401).send({ message: '접근 권한이 없습니다.' });
    }

    const likedProduct = await prisma.product.findMany({
      where: { like: { some: { userId: userId } } },
    });
    res.status(200).send(likedProduct);
  };
}
