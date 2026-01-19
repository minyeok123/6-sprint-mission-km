import { Prisma, User } from '@prisma/client';
import { CommentRepository } from '../repository/commentRepository';
import {
  CreateArticleCommentType,
  CreateProductCommentType,
  GetCommentQueryType,
  PatchCommentType,
} from '../structs/commentStruct';
import { HttpError } from '../utils/errors';
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async createProductComment(id: number, data: CreateProductCommentType, user: User) {
    const productId = id;
    const { content } = data;
    const dataToSave = {
      data: {
        content,
        user: { connect: { id: user.id } },
        product: { connect: { id: productId } },
      },
      select: { id: true, content: true, createdAt: true, productId: true, userId: true },
    };
    return this.commentRepository.createProductComment(dataToSave);
  }

  async createArticleComment(id: number, data: CreateArticleCommentType, user: User) {
    const articleId = id;
    const { content } = data;
    const dataToSave = {
      data: {
        content,
        user: { connect: { id: user.id } },
        article: { connect: { id: articleId } },
      },
      select: { id: true, content: true, createdAt: true, articleId: true, userId: true },
    };
    return this.commentRepository.createArticleComment(dataToSave);
  }

  async patchProductComment(id: number, data: PatchCommentType, user: User) {
    const commentId = id;
    const { content } = data;
    const userId = user.id;
    const foundComment = await this.commentRepository.findUniqueProductComment({
      where: { id: commentId },
      select: { userId: true },
    });
    if (!foundComment) {
      throw new HttpError(404, '댓글을 찾을 수 없습니다.');
    }
    if (foundComment.userId !== userId) {
      throw new HttpError(403, '댓글을 수정할 권한이 없습니다.');
    }
    return this.commentRepository.updateProductComment({
      where: { id: commentId },
      data: { content },
    });
  }

  async patchArticleComment(id: number, data: PatchCommentType, user: User) {
    const commentId = id;
    const { content } = data;
    const userId = user.id;
    const foundComment = await this.commentRepository.findUniqueArticleComment({
      where: { id: commentId },
      select: { userId: true },
    });
    if (!foundComment) {
      throw new HttpError(404, '댓글을 찾을 수 없습니다.');
    }
    if (foundComment.userId !== userId) {
      throw new HttpError(403, '댓글을 수정할 권한이 없습니다.');
    }
    return this.commentRepository.updateArticleComment({
      where: { id: commentId },
      data: { content },
    });
  }

  async deleteProductComment(id: number, user: User) {
    const commentId = id;
    const userId = user.id;
    const foundComment = await this.commentRepository.findUniqueProductComment({
      where: { id: commentId },
      select: { userId: true },
    });
    if (!foundComment) {
      throw new HttpError(404, '댓글을 찾을 수 없습니다.');
    }
    if (foundComment.userId !== userId) {
      throw new HttpError(403, '댓글을 삭제할 권한이 없습니다.');
    }
    await this.commentRepository.deleteProductComment({ where: { id: commentId } });
  }

  async deleteArticleComment(id: number, user: User) {
    const commentId = id;
    const userId = user.id;
    const foundComment = await this.commentRepository.findUniqueArticleComment({
      where: { id: commentId },
      select: { userId: true },
    });
    if (!foundComment) {
      throw new HttpError(404, '댓글을 찾을 수 없습니다.');
    }
    if (foundComment.userId !== userId) {
      throw new HttpError(403, '댓글을 삭제할 권한이 없습니다.');
    }
    await this.commentRepository.deleteArticleComment({ where: { id: commentId } });
  }

  async getProductComments(query: GetCommentQueryType) {
    const { limit = 10, cursorId } = query;
    const orderBy = { createdAt: 'desc' } as const;
    const findManyOptions = {
      cursor: cursorId ? { id: cursorId } : undefined,
      skip: cursorId ? 1 : 0,
      take: limit,
      orderBy,
      select: {
        id: true,
        content: true,
        createdAt: true,
        productId: true,
        userId: true,
      },
    };
    const comments = await this.commentRepository.findManyProductComment(findManyOptions);
    let nextCursor = null;
    if (comments.length === limit) {
      nextCursor = comments[comments.length - 1].id;
    }
    return { comments, nextCursor };
  }

  async getArticleComments(query: GetCommentQueryType) {
    const { limit = 10, cursorId } = query;
    const orderBy = { createdAt: 'desc' } as const;
    const findManyOptions = {
      cursor: cursorId ? { id: cursorId } : undefined,
      skip: cursorId ? 1 : 0,
      take: limit,
      orderBy,
      select: {
        id: true,
        content: true,
        createdAt: true,
        articleId: true,
        userId: true,
      },
    };
    const comments = await this.commentRepository.findManyArticleComment(findManyOptions);
    let nextCursor = null;
    if (comments.length === limit) {
      nextCursor = comments[comments.length - 1].id;
    }
    return { comments, nextCursor };
  }
}
