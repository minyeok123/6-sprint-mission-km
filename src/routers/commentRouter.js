import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  CreateAricleComment,
  CreateProductComment,
  PatchComment,
} from '../structers/commentStruct.js';
import { validate } from '../middleware/validate.js';

import { asyncDeleteHandler } from '../handler/deleteHandler.js';
import { tryCatchHandler } from '../handler/errorhandler.js';

const prisma = new PrismaClient();

const app = express();
const commentRouter = express.Router();

app.use;

//중고마켓 댓글 작성
commentRouter.route('/products').post(
  validate(CreateProductComment),
  tryCatchHandler(async (req, res) => {
    const { content, product, user } = req.body;

    const productComment = await prisma.comment.create({
      data: {
        content,
        user: {
          connect: {
            // connect >> 레코드를 생성할때 원래 있는 부모 레코드의 필드를 참조,
            // create  >> 포스트 요청시 부모 레코드가 새로 만들어져야 할때  그 필드를 참조할때
            id: user.userId,
          },
        },
        product: {
          connect: {
            id: product.productId,
          },
        },
      },
      select: { id: true, content: true, createdAt: true, productId: true, userId: true },
    });
    res.status(201).send(productComment);
  }),
);

//자유게시판 댓글 생성
commentRouter.route('/articles').post(
  validate(CreateAricleComment),
  tryCatchHandler(async (req, res) => {
    const { content, article, user } = req.body;
    const articleComment = await prisma.comment.create({
      data: {
        content,
        user: { connect: { id: user.userId } },
        article: { connect: { id: article.articleId } },
      },
      select: { id: true, content: true, createdAt: true, articleId: true, userId: true },
    });
    res.status(201).send(articleComment);
  }),
);

//댓글 수정 및 삭제
commentRouter
  .route('/:id')
  .patch(
    validate(PatchComment),
    tryCatchHandler(async (req, res) => {
      const { id } = req.params;

      const patchcomment = await prisma.comment.update({
        where: { id },
        data: req.body,
        select: {
          id: true,
          content: true,
          updatedAt: true,
          userId: true,
        },
      });
      res.status(200).send(patchcomment);
    }),
  )
  .delete(tryCatchHandler(asyncDeleteHandler(prisma.comment)));

//모든 댓글 조회
commentRouter.route('/').get(
  tryCatchHandler(async (req, res) => {
    const { limit = 10, cursorId } = req.query;
    const orderBy = { createdAt: 'desc' };
    const cursor = cursorId ? { id: cursorId } : undefined; //>> undefined 값을 전달할시 해당 옶션은 없는 옵션으로 간주 >> 오류 발생 확률 내려감
    const getAllComment = await prisma.comment.findMany({
      cursor,
      orderBy,
      skip: cursor ? 1 : 0,
      take: parseInt(limit),
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    res.status(200).send(getAllComment);
  }),
);

export default commentRouter;
// 프리즈마 문서만 참고해서 커서 옵션을 사용했을 때 시도 >> 실패

// commentRouter.route('/product/:id').get(async (req, res) => {
//   const { limit = 10, id } = req.query;
//   const orderBy = { createdAt: 'asc' };
//   const productComment = prisma.comment.findMany({
//     cursor: {product:{ id:productId }},
//     orderBy,
//     take: parseInt(limit),
//   });
//   res.send(productComment);
// });
//

// commentRouter.route('/product/:id').get(async (req, res) => {
//   const id = req.params;
//   const { limit = 0, cursorId } = req.body;
//   const orderBy = { createdAt: 'asc' };
//   const productComment = await prisma.comment.findMany({
//     where: { id },
//     cursor: orderBy,
//   });
// });
