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

  static patchProductComment = async (req: Request, res: Response) => {
    const { commentId } = (req as ValidatedParamsRequest<CommentIdParamsType>).validatedParams;
    const data = req.body as PatchCommentType;
    const user = req.user as User;
    const patchedComment = await commentService.patchProductComment(commentId, data, user);
    res.status(200).send(patchedComment);
  };

  static patchArticleComment = async (req: Request, res: Response) => {
    const { commentId } = (req as ValidatedParamsRequest<CommentIdParamsType>).validatedParams;
    const data = req.body as PatchCommentType;
    const user = req.user as User;
    const patchedComment = await commentService.patchArticleComment(commentId, data, user);
    res.status(200).send(patchedComment);
  };

  static getProductComments = async (req: Request, res: Response) => {
    const query = req.query as GetCommentQueryType; // Assuming same query type
    // If filtering by productId is needed via Params, we should take it from params.
    // However, usually "get product comments" implies fetching for a specific product.
    // The previous implementation was "get ALL comments system-wide". 
    // If the intention is "get comments for ONE product", we need productId.
    // Users query: "Product Article Comment Retrieval".
    // Usually lists are associated with parent. 
    // Let's assume for now this endpoint is "System-wide product comments feed" based on previous `getAllComments` logic.
    // IF it is "get comments of a product", it should be under /products/:id/comments.
    // Given the previous code `getAllComment` was a feed of ALL comments, `getProductComments` here likely means "Feed of all product comments".
    const { comments, nextCursor } = await commentService.getProductComments(query);
    res.status(200).send({ comments, nextCursor });
  };

  static getArticleComments = async (req: Request, res: Response) => {
    const query = req.query as GetCommentQueryType;
    const { comments, nextCursor } = await commentService.getArticleComments(query);
    res.status(200).send({ comments, nextCursor });
  };

  static deleteProductComment = async (req: Request, res: Response) => {
    const { commentId } = (req as ValidatedParamsRequest<CommentIdParamsType>).validatedParams;
    const user = req.user as User;
    await commentService.deleteProductComment(commentId, user);
    res.sendStatus(204);
  };

  static deleteArticleComment = async (req: Request, res: Response) => {
    const { commentId } = (req as ValidatedParamsRequest<CommentIdParamsType>).validatedParams;
    const user = req.user as User;
    await commentService.deleteArticleComment(commentId, user);
    res.sendStatus(204);
  };
}
