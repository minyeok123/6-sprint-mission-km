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
        user: {
          connect: {
            // connect >> 레코드를 생성할때 원래 있는 부모 레코드의 필드를 참조,
            // create  >> 포스트 요청시 부모 레코드가 새로 만들어져야 할때  그 필드를 참조할때
            id: user.id,
          },
        },
        product: { connect: { id: productId } },
      },
      select: { id: true, content: true, createdAt: true, productId: true, userId: true },
    };
    const productComment = await this.commentRepository.create(dataToSave);
    return productComment;
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
    const articleComment = await this.commentRepository.create(dataToSave);
    return articleComment;
  }

  async patchComment(id: number, data: PatchCommentType, user: User) {
    const commentId = id;
    const { content } = data;
    const userId = user.id;
    const foundComment = await this.commentRepository.findUnique({
      where: { id: commentId },
      select: { userId: true }, //userId만 확인 >> 효율 상승
    });
    if (!foundComment) {
      throw new HttpError(404, '댓글을 찾을 수 없습니다.');
    }
    if (foundComment.userId !== userId) {
      throw new HttpError(403, '댓글을 수정할 권한이 없습니다.');
    }
    const dataToUpdate = {
      where: { id: commentId },
      data: {
        content,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        productId: true,
        articleId: true,
        userId: true,
      },
    };
    const patchedComment = await this.commentRepository.update(dataToUpdate);
    return patchedComment;
  }

  async getAllComment(query: GetCommentQueryType) {
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
      },
    };
    const comments = await this.commentRepository.findMany(findManyOptions);
    let nextCursor = null;
    if (comments.length === limit) {
      nextCursor = comments[comments.length - 1].id;
    }

    return { comments, nextCursor };
  }
  async deleteComment(id: number, user: User) {
    const commentId = id;
    const userId = user.id;
    const foundComment = await this.commentRepository.findUnique({
      where: { id: commentId },
      select: { userId: true }, //userId만 확인 >> 효율 상승
    });
    if (!foundComment) {
      throw new HttpError(404, '댓글을 찾을 수 없습니다.');
    }
    if (foundComment.userId !== userId) {
      throw new HttpError(403, '댓글을 삭제할 권한이 없습니다.');
    }
    await this.commentRepository.delete({ where: { id: commentId } });
  }
}
