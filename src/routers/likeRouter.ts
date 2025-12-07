import express, { Router } from 'express';
import { tryCatchHandler } from '../middleware/errorhandler';
import { authenticate } from '../middleware/authenticate';
import { textParser } from '../middleware/formdataParser';
import { Like } from '../controller/likeController';
import { validate } from '../middleware/validate';
import { ProductIdParams } from '../structs/productStruct';
import { ArticleIdParams } from '../structs/articleStruct';
export const likeRouter = express.Router();

likeRouter.post(
  '/productLike/:productId',
  validate(ProductIdParams, 'params'),
  authenticate,
  tryCatchHandler(Like.toggleProductLike),
);

likeRouter.post(
  '/articleLike/:articleId',
  validate(ArticleIdParams, 'params'),
  authenticate,
  tryCatchHandler(Like.toggleArticleLike),
);

export default likeRouter;
