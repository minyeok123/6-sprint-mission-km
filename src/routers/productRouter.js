import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { validate } from '../middleware/validate.js';

import { CreateProduct, PatchProduct } from '../structers/productStruct.js';
import { asyncDeleteHandler } from '../handler/deleteHandler.js';
import { tryCatchHandler } from '../handler/errorhandler.js';
import { uploadHandler } from '../handler/upload.js';
import multer from 'multer';

// const app = express();
// app.use(express.json()); >> app.js에 이미 있음
const prisma = new PrismaClient();
const productRouter = express.Router();

//리스트 조회, 상품 등록
productRouter
  .route('/')
  .get(
    tryCatchHandler(async (req, res) => {
      const { offset = 0, limit = 10, order, search } = req.query;
      let orderBy;
      switch (order) {
        case 'recent':
          orderBy = { createdAt: 'desc' };
          break;
        case 'oldest':
          orderBy = { createdAt: 'asc' };
          break;
        default:
          orderBy = {};
      }
      // const where = search ? { name || description:search} : {}; >> 첫 시도
      const where = search
        ? { OR: [{ name: { contains: search } }, { description: { contains: search } }] }
        : {};
      // 프리즈마 내에서 or 사용 방법 {OR:{[{조건1},{조건2}]}}  >  ai 활용
      //{fieldName:{contains:...}} >> contains는 where이라는 옵션 안에있는 특정 필드등에 적용되는 더 세부적인 옵션
      const product = await prisma.product.findMany({
        where,
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
        // include: { description: false, updatedAt: false }, >> 첫 시도, 잠재적 문제 발생 할 수도있음,prisma에서 의도한 사용방법이 아님
        select: {
          //findMany 도움말 참고
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
      });
      res.status(200).send(product);
    }),
  )
  .post(
    validate(CreateProduct),
    tryCatchHandler(async (req, res) => {
      const product = await prisma.product.create({
        data: req.body,
      });
      res.send(product);
    }),
  );
// .post('/files', upload.single('attachment'), uploadHandler()); >> route().post() 처럼 라우트 체인 안에 있을때는 따로 post api 만들기

//app.use('/files', express.static('uploads')); //>> app.js 미들웨어로 추가
//상품 상세 조회 , 상품 업데이트 , 상품 삭제
productRouter
  .route('/:id')
  .get(
    tryCatchHandler(async (req, res) => {
      const { id } = req.params;
      const product = await prisma.product.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tag: true,
          createdAt: true,
        },
      });
      res.status(200).send(product);
    }),
  )
  .patch(
    validate(PatchProduct),
    tryCatchHandler(async (req, res) => {
      const { id } = req.params;

      const product = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.status(200).send(product);
    }),
  )
  .delete(tryCatchHandler(asyncDeleteHandler(prisma.product)));

// 상품 이미지 업로드
const upload = multer({ dest: 'productupload/' });
productRouter.post('/files', upload.single('attachment'), tryCatchHandler(uploadHandler()));

export default productRouter;
