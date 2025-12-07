import { prisma } from '../utils/prismaClient';
import { Request, Response } from 'express';
import type {
  ArticleIdParamsType,
  CreateArticleType,
  GetArticlesQueryType,
  PatchArticleType,
} from '../structs/articleStruct';
import { ArticleIdParams } from '../structs/articleStruct';
import { HttpError } from '../utils/errors';

export class ArticleController {
  //게시글 목록 조회
  static getArticles = async (req: Request, res: Response) => {
    const { page = 1, limit = 10, order, search } = req.query as GetArticlesQueryType;

    const orderByOption = {
      recent: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
    } as const;

    const where = search
      ? { OR: [{ title: { contains: search } }, { content: { contains: search } }] }
      : undefined;

    const article = await prisma.article.findMany({
      where,
      orderBy:
        order && (order === 'recent' || order === 'oldest')
          ? orderByOption[order]
          : orderByOption['recent'],
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, title: true, content: true, createdAt: true },
    });
    res.status(200).send(article);
  };
  //게시글 생성
  static createArticle = async (req: Request, res: Response) => {
    const { title, content } = req.body as CreateArticleType;
    const articleImage = req.files;
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '인증 정보가 없습니다.');
    }
    let image;
    if (Array.isArray(articleImage) && articleImage.length > 0) {
      image = {
        create: articleImage.map((file) => ({
          url: `/files/article-image/${file.filename}`,
        })),
      };
    }
    const article = await prisma.article.create({
      data: {
        title,
        content,
        user: { connect: { id: user.id } },
        articleImages: image,
      },
    });
    res.status(201).send(article);
  };
  //게시글 상세 조회
  static getArticleDetail = async (req: Request, res: Response) => {
    const { articleId } = ArticleIdParams.create(req.params);
    const article = await prisma.article.findUniqueOrThrow({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        _count: { select: { like: true } },
      },
    });
    const response = {
      ...article,
      isLiked: article['_count'].like > 0,
    };
    res.status(200).send(response);
  };
  //게시글 수정
  static patchArticle = async (req: Request, res: Response) => {
    const { articleId } = ArticleIdParams.create(req.params);
    const { title, content } = req.body as PatchArticleType;
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '인증 정보가 없습니다.');
    }
    const article = await prisma.$transaction(async (tx) => {
      const foundArticle = await tx.article.findUniqueOrThrow({ where: { id: articleId } });
      if (foundArticle.userId !== user.id) {
        throw new HttpError(401, '잘못된 접근입니다.');
      }
      const patchedArticle = await tx.article.update({
        where: { id: articleId },
        data: {
          title,
          content,
        },
      });
      return patchedArticle;
    });

    res.status(200).send(article);
  };
  //게시글 삭제
  static deleteArticle = async (req: Request, res: Response) => {
    const { articleId } = ArticleIdParams.create(req.params);
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '인증 정보가 없습니다.');
    }
    await prisma.$transaction(async (tx) => {
      const foundArticle = await tx.article.findUniqueOrThrow({
        where: { id: articleId },
      });
      if (foundArticle.userId !== user.id) {
        throw new HttpError(401, '잘못된 접근입니다.');
      }
      await tx.article.delete({ where: { id: articleId } });
    });

    res.sendStatus(204);
  };
}
