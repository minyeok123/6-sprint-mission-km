import express from 'express';
import { CommentIdParams, PatchComment, GetCommentQuery } from '../structs/commentStruct.js';
import { validate } from '../middleware/validate.js';
import { tryCatchHandler } from '../middleware/errorhandler.js';
import { commentController } from '../controller/commentController.js';
import { authenticate } from '../middleware/authenticate.js';
import { textParser } from '../middleware/formdataParser.js';
const commentRouter = express.Router();

//댓글 수정 및 삭제
commentRouter
  .route('/:commentId')
  .patch(
    authenticate,
    textParser,
    validate(CommentIdParams, 'params'),
    tryCatchHandler(commentController.patchComment),
  )
  .delete(
    authenticate,
    validate(CommentIdParams, 'params'),
    tryCatchHandler(commentController.deleteComment),
  );

//모든 댓글 조회
commentRouter
  .route('/')
  .get(validate(GetCommentQuery, 'query'), tryCatchHandler(commentController.getAllComment));

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
