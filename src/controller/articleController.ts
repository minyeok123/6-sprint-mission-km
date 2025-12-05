import { prisma } from '../utils/prismaClient.js';
import { Request, Response } from 'express';
export class ArticleController {
  //게시글 목록 조회
  static getArticles = async (req: Request, res: Response) => {
    const { page = 0, limit = 10, order, search } = req.query;

    const orderByOption = {
      recent: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
    };
    const where = search
      ? { OR: [{ title: { contains: search } }, { content: { contains: search } }] }
      : {};

    const article = await prisma.article.findMany({
      where,
      orderBy: orderByOption[order] || orderByOption['recent'],
      skip: parseInt(page),
      take: parseInt(limit),
      select: { id: true, title: true, content: true, createdAt: true },
    });
    res.status(200).send(article);
  };
  //게시글 생성
  static createArticle = async (req, res) => {
    const { title, content } = req.body;
    const articleImage = req.files;
    const user = req.user;
    let image;
    if (articleImage && articleImage.length > 0) {
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
  static getArticleDetail = async (req, res) => {
    const articleId = parseInt(req.params.articleId, 10);
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
  static patchArticle = async (req, res) => {
    const articleId = parseInt(req.params.articleId, 10);
    const { title, content } = req.body;
    const user = req.user;
    try {
      const article = await prisma.$transaction(async (tx) => {
        const foundArticle = await tx.article.findUniqueOrThrow({ where: { id: articleId } });
        if (foundArticle.userId !== user.id) {
          throw { status: 401, message: '잘못된 접근입니다.' };
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
    } catch (e) {
      return res.status(e.status).send({ message: e.message });
    }
  };
  //게시글 삭제
  static deleteArticle = async (req, res) => {
    const articleId = parseInt(req.params.articleId, 10);
    const user = req.user;
    try {
      await prisma.$transaction(async (tx) => {
        const foundArticle = await tx.article.findUniqueOrThrow({
          where: { id: articleId },
        });
        if (foundArticle.userId !== user.id) {
          throw { status: 401, message: '잘못된 접근입니다.' };
        }
        await tx.article.delete({ where: { id: articleId } });
      });

      res.sendStatus(204);
    } catch (e) {
      return res.status(e.status).send({ message: e.message });
    }
  };
}
