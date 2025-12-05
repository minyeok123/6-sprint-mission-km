import { prisma } from '../utils/prismaClient.js';

export class commentController {
  static createProductComment = async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    const user = req.user;
    const { content } = req.body;

    const productComment = await prisma.comment.create({
      data: {
        content,
        user: {
          connect: {
            // connect >> 레코드를 생성할때 원래 있는 부모 레코드의 필드를 참조,
            // create  >> 포스트 요청시 부모 레코드가 새로 만들어져야 할때  그 필드를 참조할때
            id: user.id,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
      },
      select: { id: true, content: true, createdAt: true, productId: true, userId: true },
    });
    res.status(201).send(productComment);
  };
  static createArticleComment = async (req, res) => {
    const articleId = parseInt(req.params.articleId, 10);
    const user = req.user;
    const { content } = req.body;
    const articleComment = await prisma.comment.create({
      data: {
        content,
        user: { connect: { id: user.id } },
        article: { connect: { id: articleId } },
      },
      select: { id: true, content: true, createdAt: true, articleId: true, userId: true },
    });
    res.status(201).send(articleComment);
  };
  static patchComment = async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10);
    const { content } = req.body;
    const user = req.user;
    try {
      const comment = await prisma.$transaction(async (tx) => {
        const foundComment = await tx.comment.findUniqueOrThrow({ where: { id: commentId } });
        if (foundComment.userId !== user.id) {
          throw { status: 401, message: '잘못된 접근입니다.' };
        }
        const patchedComment = await tx.comment.update({
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
        });
        return patchedComment;
      });
      res.status(200).send(comment);
    } catch (e) {
      return res.status(e.status).send({ message: e.message });
    }
  };

  static getAllComment = async (req, res) => {
    const { limit = 10, cursorId } = req.query;
    const orderBy = { createdAt: 'desc' };
    const comments = await prisma.comment.findMany({
      cursor: cursorId ? { id: cursorId } : undefined,
      skip: cursorId ? 1 : 0,
      take: limit,
      orderBy,
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    let nextCursor = null;
    if (comments.length === limit) {
      nextCursor = comments[comments.length - 1].id;
    }

    res.status(200).send({ comments, nextCursor });
  };
  static deleteComment = async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10);
    const user = req.user;
    try {
      await prisma.$transaction(async (tx) => {
        const foundComment = await tx.comment.findUniqueOrThrow({ where: { id: commentId } });
        if (foundComment.userId !== user.id) {
          throw { status: 401, message: '잘못된 접근입니다.' };
        }
        await tx.comment.delete({ where: { id: commentId } });
      });
      res.sendStatus(204);
    } catch (e) {
      return res.status(e.status).send({ message: e.message });
    }
  };
}
