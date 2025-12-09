import { ArticleIdParams } from '../structs/articleStruct';
import { prisma } from '../utils/prismaClient';
import { Request, Response } from 'express';
import { HttpError } from '../utils/errors';
import {
  CreateArticleCommentType,
  CreateProductCommentType,
  PatchCommentType,
  CommentIdParams,
  GetCommentQueryType,
} from '../structs/commentStruct';
import { ProductIdParams } from '../structs/productStruct';
import { CommentService } from '../service/commentService';
import { CommentRepository } from '../repository/commentRepository';
import { User } from '@prisma/client';

const commentRepository = new CommentRepository();
const commentService = new CommentService(commentRepository);

export class commentController {
  static createProductComment = async (req: Request, res: Response) => {
    const { productId } = ProductIdParams.create(req.params);
    const data = req.body as CreateProductCommentType;
    const user = req.user as User;
    const productComment = await commentService.createProductComment(productId, data, user);
    res.status(201).send(productComment);
  };

  static createArticleComment = async (req: Request, res: Response) => {
    const { articleId } = ArticleIdParams.create(req.params);
    const user = req.user as User;
    const data = req.body as CreateArticleCommentType;
    const articleComment = await commentService.createArticleComment(articleId, data, user);
    res.status(201).send(articleComment);
  };

  static patchComment = async (req: Request, res: Response) => {
    const { commentId } = CommentIdParams.create(req.params);
    const data = req.body as PatchCommentType;
    const user = req.user as User;
    const patchedComment = await commentService.patchComment(commentId, data, user);
    res.status(200).send(patchedComment);
  };

  static getAllComment = async (req: Request, res: Response) => {
    const query = req.query as GetCommentQueryType;
    const { comments, nextCursor } = await commentService.getAllComment(query);
    res.status(200).send({ comments, nextCursor });
  };

  static deleteComment = async (req: Request, res: Response) => {
    const { commentId } = CommentIdParams.create(req.params);
    const user = req.user as User;
    await commentService.deleteComment(commentId, user);
    res.sendStatus(204);
  };
}
