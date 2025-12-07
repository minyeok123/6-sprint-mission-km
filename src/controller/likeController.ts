import { ArticleIdParams } from '../structs/articleStruct.js';
import { ProductIdParams } from '../structs/productStruct.js';
import { HttpError } from '../utils/errors.js';
import { prisma } from '../utils/prismaClient.js';
import { Request, Response } from 'express';
export class Like {
  static toggleProductLike = async (req: Request, res: Response) => {
    const { productId } = ProductIdParams.create(req.params);
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }
    const isLikedProduct = await prisma.like.findFirst({
      where: {
        userId: user.id,
        productId: productId,
        articleId: null,
      },
    });
    if (isLikedProduct) {
      await prisma.like.delete({
        where: { id: isLikedProduct.id },
      });
      res.status(200).send({ message: '좋아요가 취소되었습니다.' });
    } else {
      const newLike = await prisma.like.create({
        data: {
          user: { connect: { id: user.id } },
          product: { connect: { id: productId } },
        },
      });
      res.status(201).send({ message: '좋아요를 눌렀습니다.', data: newLike });
    }
  };

  static toggleArticleLike = async (req: Request, res: Response) => {
    const { articleId } = ArticleIdParams.create(req.params);
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }
    const isLikedArticle = await prisma.like.findFirst({
      where: {
        userId: user.id,
        productId: null,
        articleId: articleId,
      },
    });

    if (isLikedArticle) {
      await prisma.like.delete({ where: { id: isLikedArticle.id } });
      res.status(200).send({ message: '좋아요가 취소되었습니다.' });
    } else {
      const newLike = await prisma.like.create({
        data: {
          user: { connect: { id: user.id } },
          article: { connect: { id: articleId } },
        },
      });
      res.status(201).send({ message: '좋아요를 눌렀습니다.', data: newLike });
    }
  };
}
