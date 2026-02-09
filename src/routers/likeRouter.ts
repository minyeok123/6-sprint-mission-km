import express from 'express';
import { tryCatchHandler } from '../middleware/errorhandler';
import { authenticate } from '../middleware/authenticate';
import { LikeController } from '../controller/likeController';
import { validate } from '../middleware/validate';
import { ProductIdParams } from '../structs/productStruct';
import { ArticleIdParams } from '../structs/articleStruct';
export const likeRouter = express.Router();

likeRouter.post(
  '/:productId/productLike',
  validate(ProductIdParams, 'params'),
  authenticate,
  tryCatchHandler(LikeController.toggleProductLike),
);

likeRouter.post(
  '/:articleId/articleLike',
  validate(ArticleIdParams, 'params'),
  authenticate,
  tryCatchHandler(LikeController.toggleArticleLike),
);

export default likeRouter;
