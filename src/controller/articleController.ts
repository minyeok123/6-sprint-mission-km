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
import { ArticleService } from '../service/articleService';
import { ArticleRepository } from '../repository/articleRepository';
import { User } from '@prisma/client';

const articleRepository = new ArticleRepository();
const articleService = new ArticleService(articleRepository);

export class ArticleController {
  //게시글 목록 조회
  static getArticles = async (req: Request, res: Response) => {
    const query = req.query as GetArticlesQueryType;
    const article = await articleService.getArticles(query);
    res.status(200).send(article);
  };

  //게시글 생성
  static createArticle = async (req: Request, res: Response) => {
    const articleData = req.body as CreateArticleType;
    const articleImage = req.files as Express.Multer.File[];
    const user = req.user as User;
    const article = await articleService.createArticle(articleData, user, articleImage);
    res.status(201).send(article);
  };

  //게시글 상세 조회
  static getArticleDetail = async (req: Request, res: Response) => {
    const { articleId } = ArticleIdParams.create(req.params);
    const article = await articleService.getArticleDetail(articleId);
    res.status(200).send(article);
  };
  //게시글 수정
  static patchArticle = async (req: Request, res: Response) => {
    const { articleId } = ArticleIdParams.create(req.params);
    const articleData = req.body as PatchArticleType;
    const user = req.user as User;
    const article = await articleService.patchArticle(articleId, articleData, user);
    res.status(200).send(article);
  };
  //게시글 삭제
  static deleteArticle = async (req: Request, res: Response) => {
    const { articleId } = ArticleIdParams.create(req.params);
    const user = req.user as User;
    await articleService.deleteArticle(articleId, user);
    res.sendStatus(204);
  };
}
