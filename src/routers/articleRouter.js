import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { validate } from '../middleware/validate.js';

import { CreateArticle, PatchArticle } from '../structers/articleStruct.js';
import { asyncDeleteHandler } from '../handler/deleteHandler.js';
import { tryCatchHandler } from '../handler/errorhandler.js';
import { uploadHandler } from '../handler/upload.js';
import multer from 'multer';
const prisma = new PrismaClient();

const articleRouter = express.Router();

// 자유게시판 목록 조회 및 생성
articleRouter
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
          break;
      }
      const where = search
        ? { OR: [{ title: { contains: search } }, { content: { contains: search } }] }
        : {};

      const article = await prisma.article.findMany({
        where,
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
        select: { id: true, title: true, content: true, createdAt: true },
      });
      res.status(200).send(article);
    }),
  )
  .post(validate(CreateArticle), async (req, res) => {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).send(article);
  });
// 자유게시판 상세 조회 및 수정 및 삭제
articleRouter
  .route('/:id')
  .get(
    tryCatchHandler(async (req, res) => {
      const { id } = req.params;
      const article = await prisma.article.findUniqueOrThrow({
        where: { id },
        select: { id: true, title: true, content: true, createdAt: true },
      });
      res.status(200).send(article);
    }),
  )
  .patch(
    validate(PatchArticle),
    tryCatchHandler(async (req, res) => {
      const { id } = req.params;
      const { title, content } = req.body;
      const article = await prisma.article.update({
        where: { id },
        data: { title, content },
      });
      res.status(200).send(article);
    }),
  )
  .delete(tryCatchHandler(asyncDeleteHandler(prisma.article)));

// 자유게시판 이미지 업로드
const upload = multer({ dest: 'articlesUpload/' });
articleRouter.post('/files', upload.single('attachment'), tryCatchHandler(uploadHandler()));

export default articleRouter;
