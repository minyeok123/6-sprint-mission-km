import { Request, Response } from 'express';
import type {
  CreateArticleType,
  GetArticlesQueryType,
  PatchArticleType,
} from '../structs/articleStruct';
import { ArticleService } from '../service/articleService';
import { ArticleRepository } from '../repository/articleRepository';
import { User } from '@prisma/client';
import { ArticleIdParamsType } from '../structs/articleStruct';
import { ValidatedParamsRequest } from '../middleware/validate';
import { UserIdParamsType } from '../structs/userStruct';

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
    const user = req.user as User;
    const article = await articleService.createArticle(articleData, user);
    res.status(201).send(article);
  };

  //게시글 상세 조회
  static getArticleDetail = async (req: Request, res: Response) => {
    const { articleId } = (req as ValidatedParamsRequest<ArticleIdParamsType>).validatedParams;
    const article = await articleService.getArticleDetail(articleId);
    res.status(200).send(article);
  };
  //게시글 수정
  static patchArticle = async (req: Request, res: Response) => {
    const { articleId } = (req as ValidatedParamsRequest<ArticleIdParamsType>).validatedParams;
    const articleData = req.body as PatchArticleType;
    const user = req.user as User;
    const article = await articleService.patchArticle(articleId, articleData, user);
    res.status(200).send(article);
  };
  //게시글 삭제
  static deleteArticle = async (req: Request, res: Response) => {
    const { articleId } = (req as ValidatedParamsRequest<ArticleIdParamsType>).validatedParams;
    const user = req.user as User;
    await articleService.deleteArticle(articleId, user);
    res.sendStatus(204);
  };

  //생성 아티클 조회
  static getCreatedArticle = async (req: Request, res: Response) => {
    const { userId } = (req as ValidatedParamsRequest<UserIdParamsType>).validatedParams;
    const user = req.user as User;
    const createdArticle = await articleService.getCreatedArticle(userId, user);
    res.status(200).send(createdArticle);
  };
  //좋아요 게시글 조회
  static getLikedArticle = async (req: Request, res: Response) => {
    const { userId } = (req as ValidatedParamsRequest<UserIdParamsType>).validatedParams;
    const user = req.user as User;
    const likedArticle = await articleService.getLikedArticle(userId, user);
    res.status(200).send(likedArticle);
  };
}
