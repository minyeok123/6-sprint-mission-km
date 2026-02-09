import express from 'express';
import { validate } from '../middleware/validate';
import {
  CreateProduct,
  GetProductsQuery,
  PatchProduct,
  ProductIdParams,
} from '../structs/productStruct';
import { tryCatchHandler } from '../middleware/errorhandler';
import { ProductController } from '../controller/productController';
import { authenticate } from '../middleware/authenticate';
import { productValidate } from '../middleware/productValidate';
import { UserIdParams } from '../structs/userStruct';
// const app = express();
// app.use(express.json()); >> app.js에 이미 있음

const productRouter = express.Router();

//리스트 조회, 상품 등록
productRouter
  .route('/')
  .get(validate(GetProductsQuery, 'query'), tryCatchHandler(ProductController.getProduct))
  .post(
    authenticate,
    productValidate(CreateProduct),
    tryCatchHandler(ProductController.createProduct),
  );
// .post('/files', upload.single('attachment'), uploadHandler()); >> route().post() 처럼 라우트 체인 안에 있을때는 따로 post api 만들기

//app.use('/files', express.static('uploads')); //>> app.js 미들웨어로 추가
//상품 상세 조회 , 상품 업데이트 , 상품 삭제
productRouter
  .route('/:productId')
  .get(validate(ProductIdParams, 'params'), tryCatchHandler(ProductController.getProductDetail))
  .patch(
    authenticate,
    validate(ProductIdParams, 'params'),
    productValidate(PatchProduct),
    tryCatchHandler(ProductController.patchProduct),
  )
  .delete(
    authenticate,
    validate(ProductIdParams, 'params'),
    tryCatchHandler(ProductController.deleteProduct),
  );
//좋아요 및 게시 상품 조회
productRouter
  .get(
    '/users/:userId/created-products',
    authenticate,
    validate(UserIdParams, 'params'),
    tryCatchHandler(ProductController.getCreatedProduct),
  )
  .get(
    '/users/:userId/liked-products',
    authenticate,
    validate(UserIdParams, 'params'),
    tryCatchHandler(ProductController.getLikedProduct),
  );

export default productRouter;
