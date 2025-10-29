import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structers/articleStruct.js';

const prisma = new PrismaClient();

const articleRouter = express.Router();

articleRouter
  .route('/')
  .get(async (req, res) => {
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
  })
  .post(async (req, res) => {
    assert(req.body, CreateArticle);
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).send(article);
  });

articleRouter
  .route('/:id')
  .get(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    res.status(200).send(article);
  })
  .patch(async (req, res) => {
    assert(req.body, PatchArticle);
    const { id } = req.params;
    const { title, content } = req.body;
    const article = await prisma.article.update({
      where: { id },
      data: { title, content },
    });
    res.status(200).send(article);
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.delete({
      where: { id },
    });
    res.status(204).send(article);
  });

export default articleRouter;
