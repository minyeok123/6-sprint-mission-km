import express from 'express';
import { CommentIdParams, PatchComment, GetCommentQuery } from '../structs/commentStruct';
import { validate } from '../middleware/validate';
import { tryCatchHandler } from '../middleware/errorhandler';
import { commentController } from '../controller/commentController';
import { authenticate } from '../middleware/authenticate';
import { ProductIdParams } from '../structs/productStruct';
import { CreateProductComment } from '../structs/commentStruct';
import { ArticleIdParams } from '../structs/articleStruct';
import { CreateArticleComment } from '../structs/commentStruct';
const commentRouter = express.Router();

// Product Comment Update/Delete
commentRouter
  .route('/product-comments/:commentId')
  .patch(
    authenticate,
    validate(CommentIdParams, 'params'),
    validate(PatchComment),
    tryCatchHandler(commentController.patchProductComment),
  )
  .delete(
    authenticate,
    validate(CommentIdParams, 'params'),
    tryCatchHandler(commentController.deleteProductComment),
  );

// Article Comment Update/Delete
commentRouter
  .route('/article-comments/:commentId')
  .patch(
    authenticate,
    validate(CommentIdParams, 'params'),
    validate(PatchComment),
    tryCatchHandler(commentController.patchArticleComment),
  )
  .delete(
    authenticate,
    validate(CommentIdParams, 'params'),
    tryCatchHandler(commentController.deleteArticleComment),
  );

//상품 댓글 생성
commentRouter
  .route('/:productId/product-comments')
  .post(
    authenticate,
    validate(ProductIdParams, 'params'),
    validate(CreateProductComment),
    tryCatchHandler(commentController.createProductComment),
  );

//아티클 댓글 생성
commentRouter
  .route('/:articleId/article-comments')
  .post(
    authenticate,
    validate(ArticleIdParams, 'params'),
    validate(CreateArticleComment),
    tryCatchHandler(commentController.createArticleComment),
  );

//상품 댓글 전체 조회
commentRouter
  .route('/product-comments')
  .get(validate(GetCommentQuery, 'query'), tryCatchHandler(commentController.getProductComments));

//아티클 댓글 전체 조회
commentRouter
  .route('/article-comments')
  .get(validate(GetCommentQuery, 'query'), tryCatchHandler(commentController.getArticleComments));

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
