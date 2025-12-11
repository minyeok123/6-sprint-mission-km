import {
  CreateProductType,
  GetProductsQueryType,
  PatchProductType,
  ProductIdParams,
} from '../structs/productStruct';
import { UserIdParams } from '../structs/userStruct';
import { Request, Response } from 'express';
import { ProductService } from '../service/productService';
import { ProductRepository } from '../repository/productRepository';
import { User } from '@prisma/client';

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

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
    const productImage = req.files as Express.Multer.File[];
    const user = req.user as User;
    const product = await productService.createProduct(data, user, productImage);
    res.status(201).send(product);
  };

  //상품 상세 조회
  static getProductDetail = async (req: Request, res: Response) => {
    const { productId } = ProductIdParams.create(req.params);
    const product = await productService.getProductDetail(productId);
    res.status(200).send(product);
  };

  //상품 정보 수정
  static patchProduct = async (req: Request, res: Response) => {
    const { productId } = ProductIdParams.create(req.params);
    const data = req.body as PatchProductType;
    const user = req.user as User;
    const patchedProduct = await productService.patchProduct(productId, data, user);
    res.status(200).send(patchedProduct);
  };

  //상품 삭제
  static deleteProduct = async (req: Request, res: Response) => {
    const { productId } = ProductIdParams.create(req.params);
    const user = req.user as User;
    await productService.deleteProduct(productId, user);
    res.sendStatus(204);
  };

  //게시 상품 조회
  static getCreatedProduct = async (req: Request, res: Response) => {
    const { userId } = UserIdParams.create(req.params);
    const user = req.user as User;
    const createdProduct = await productService.getCreatedProduct(userId, user);
    res.status(200).send(createdProduct);
  };

  //좋아요 상품 조회
  static getLikedProduct = async (req: Request, res: Response) => {
    const { userId } = UserIdParams.create(req.params);
    const user = req.user as User;
    const likedProduct = await productService.getLikedProduct(userId, user);
    res.status(200).send(likedProduct);
  };
}
