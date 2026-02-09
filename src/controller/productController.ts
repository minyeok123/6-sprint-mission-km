import {
  CreateProductType,
  GetProductsQueryType,
  PatchProductType,
  ProductIdParamsType,
} from '../structs/productStruct';
import { UserIdParamsType } from '../structs/userStruct';
import { Request, Response } from 'express';
import { ProductService } from '../service/productService';
import { ProductRepository } from '../repository/productRepository';
import { NotificationService } from '../service/notificationService';
import { NotificationRepository } from '../repository/notificationRepository';
import { User } from '@prisma/client';
import { ValidatedParamsRequest } from '../middleware/validate';
const productRepository = new ProductRepository();
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const productService = new ProductService(productRepository, notificationService);

export class ProductController {
  //상품 리스트 조회
  static getProduct = async (req: Request, res: Response) => {
    const query = req.query as GetProductsQueryType;
    const product = await productService.getProduct(query);
    res.status(200).send(product);
  };

  //상품 생성
  static createProduct = async (req: Request, res: Response) => {
    const data = req.body as CreateProductType;
    const user = req.user as User;
    const product = await productService.createProduct(data, user);
    res.status(201).send(product);
  };

  //상품 상세 조회
  static getProductDetail = async (req: Request, res: Response) => {
    const { productId } = (req as ValidatedParamsRequest<ProductIdParamsType>).validatedParams;
    const product = await productService.getProductDetail(productId);
    res.status(200).send(product);
  };

  //상품 정보 수정
  static patchProduct = async (req: Request, res: Response) => {
    const { productId } = (req as ValidatedParamsRequest<ProductIdParamsType>).validatedParams;
    const data = req.body as PatchProductType;
    const user = req.user as User;
    const patchedProduct = await productService.patchProduct(productId, data, user);
    res.status(200).send(patchedProduct);
  };

  //상품 삭제
  static deleteProduct = async (req: Request, res: Response) => {
    const { productId } = (req as ValidatedParamsRequest<ProductIdParamsType>).validatedParams;
    const user = req.user as User;
    await productService.deleteProduct(productId, user);
    res.sendStatus(204);
  };

  //게시 상품 조회
  static getCreatedProduct = async (req: Request, res: Response) => {
    const { userId } = (req as ValidatedParamsRequest<UserIdParamsType>).validatedParams;
    const user = req.user as User;
    const createdProduct = await productService.getCreatedProduct(userId, user);
    res.status(200).send(createdProduct);
  };

  //좋아요 상품 조회
  static getLikedProduct = async (req: Request, res: Response) => {
    const { userId } = (req as ValidatedParamsRequest<UserIdParamsType>).validatedParams;
    const user = req.user as User;
    const likedProduct = await productService.getLikedProduct(userId, user);
    res.status(200).send(likedProduct);
  };
}
