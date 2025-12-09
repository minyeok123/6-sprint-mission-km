import { ArticleIdParams } from '../structs/articleStruct';
import { ProductIdParams } from '../structs/productStruct';
import { HttpError } from '../utils/errors';
import { prisma } from '../utils/prismaClient';
import { Request, Response } from 'express';
import { LikeRepository } from '../repository/likeRepository';
import { LikeService } from '../service/likeService';
import { User } from '@prisma/client';

const likeRepository = new LikeRepository();
const likeService = new LikeService(likeRepository);

export class LikeController {
  static toggleProductLike = async (req: Request, res: Response) => {
    const { productId } = ProductIdParams.create(req.params);
    const user = req.user as User;
    const result = await likeService.toggleProductLike(productId, user);
    const statusCode = result.created ? 201 : 200;
    const { created, ...response } = result;
    res.status(statusCode).send(response);
  };

  static toggleArticleLike = async (req: Request, res: Response) => {
    const { articleId } = ArticleIdParams.create(req.params);
    const user = req.user as User;
    const result = await likeService.toggleArticleLike(articleId, user);
    const statusCode = result.created ? 201 : 200;
    const { created, ...response } = result;
    res.status(statusCode).send(response);
  };
}
