import express from 'express';
import { validate } from '../middleware/validate';
import {
  CreateProduct,
  GetProductsQuery,
  PatchProduct,
  ProductIdParams,
} from '../structs/productStruct';
import { CreateProductComment } from '../structs/commentStruct';
import { tryCatchHandler } from '../middleware/errorhandler';
import { ProductController } from '../controller/productController';
import { UploadImage, textParser } from '../middleware/formdataParser';
import { authenticate } from '../middleware/authenticate';
import { productValidate } from '../middleware/productValidate';
import { commentController } from '../controller/commentController';
import { UserIdParams } from '../structs/userStruct';
// const app = express();
// app.use(express.json()); >> app.js에 이미 있음

const productRouter = express.Router();
const productImageUpload = UploadImage('product-image');
//리스트 조회, 상품 등록
productRouter
  .route('/')
  .get(validate(GetProductsQuery, 'query'), tryCatchHandler(ProductController.getProduct))
  .post(
    authenticate,
    productImageUpload.array('productImage', 5),
    productValidate(CreateProduct),
    tryCatchHandler(ProductController.createProduct),
  );
// .post('/files', upload.single('attachment'), uploadHandler()); >> route().post() 처럼 라우트 체인 안에 있을때는 따로 post api 만들기

//app.use('/files', express.static('uploads')); //>> app.js 미들웨어로 추가
//상품 상세 조회 , 상품 업데이트 , 상품 삭제
productRouter
  .route('/:productId')
  .get(tryCatchHandler(ProductController.getProductDetail))
  .patch(
    authenticate,
    productImageUpload.none(),
    validate(ProductIdParams, 'params'),
    productValidate(PatchProduct),
    tryCatchHandler(ProductController.patchProduct),
  )
  .delete(
    authenticate,
    validate(ProductIdParams, 'params'),
    tryCatchHandler(ProductController.deleteProduct),
  );
//중고마켓 댓글 작성
productRouter
  .route('/:productId/comments')
  .post(
    authenticate,
    textParser,
    validate(ProductIdParams, 'params'),
    validate(CreateProductComment),
    tryCatchHandler(commentController.createProductComment),
  );

productRouter
  .get(
    '/users/:userId/products',
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
