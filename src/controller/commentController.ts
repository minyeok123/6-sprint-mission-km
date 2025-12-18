import { ArticleIdParamsType } from '../structs/articleStruct';
import { Request, Response } from 'express';
import {
  CreateArticleCommentType,
  CreateProductCommentType,
  PatchCommentType,
  CommentIdParamsType,
  GetCommentQueryType,
} from '../structs/commentStruct';
import { ProductIdParamsType } from '../structs/productStruct';
import { CommentService } from '../service/commentService';
import { CommentRepository } from '../repository/commentRepository';
import { User } from '@prisma/client';
import { ValidatedParamsRequest } from '../middleware/validate';

const commentRepository = new CommentRepository();
const commentService = new CommentService(commentRepository);

export class commentController {
  static createProductComment = async (req: Request, res: Response) => {
    const { productId } = (req as ValidatedParamsRequest<ProductIdParamsType>).validatedParams;
    const data = req.body as CreateProductCommentType;
    const user = req.user as User;
    const productComment = await commentService.createProductComment(productId, data, user);
    res.status(201).send(productComment);
  };

  static createArticleComment = async (req: Request, res: Response) => {
    const { articleId } = (req as ValidatedParamsRequest<ArticleIdParamsType>).validatedParams;
    const user = req.user as User;
    const data = req.body as CreateArticleCommentType;
    const articleComment = await commentService.createArticleComment(articleId, data, user);
    res.status(201).send(articleComment);
  };

  static patchComment = async (req: Request, res: Response) => {
    const { commentId } = (req as ValidatedParamsRequest<CommentIdParamsType>).validatedParams;
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
    const { commentId } = (req as ValidatedParamsRequest<CommentIdParamsType>).validatedParams;
    const user = req.user as User;
    await commentService.deleteComment(commentId, user);
    res.sendStatus(204);
  };
}
