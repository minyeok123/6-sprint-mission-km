import express, { Router } from 'express';
import { tryCatchHandler } from '../middleware/errorhandler.js';
import { authenticate } from '../middleware/authenticate.js';
import { textParser } from '../middleware/formdataParser.js';
import { Like } from '../controller/likeController.js';
import { validate } from '../middleware/validate.js';
import { ProductParams } from '../structs/productStruct.js';
import { ArticleIdParams } from '../structs/articleStruct.js';
export const likeRouter = express.Router();

likeRouter.post(
  '/productLike/:productId',
  validate(ProductParams, 'params'),
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
