import { ArticleIdParamsType } from '../structs/articleStruct';
import { Request, Response } from 'express';
import { LikeRepository } from '../repository/likeRepository';
import { LikeService } from '../service/likeService';
import { User } from '@prisma/client';
import { ProductIdParamsType } from '../structs/productStruct';
import { ValidatedParamsRequest } from '../middleware/validate';
const likeRepository = new LikeRepository();
const likeService = new LikeService(likeRepository);

export class LikeController {
  static toggleProductLike = async (req: Request, res: Response) => {
    const { productId } = (req as ValidatedParamsRequest<ProductIdParamsType>).validatedParams;
    const user = req.user as User;
    const result = await likeService.toggleProductLike(productId, user);
    const statusCode = result.created ? 201 : 200;
    const { created, ...response } = result;
    res.status(statusCode).send(response);
  };

  static toggleArticleLike = async (req: Request, res: Response) => {
    const { articleId } = (req as ValidatedParamsRequest<ArticleIdParamsType>).validatedParams;
    const user = req.user as User;
    const result = await likeService.toggleArticleLike(articleId, user);
    const statusCode = result.created ? 201 : 200;
    const { created, ...response } = result;
    res.status(statusCode).send(response);
  };
}
