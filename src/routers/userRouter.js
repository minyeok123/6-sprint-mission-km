import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { tryCatchHandler } from '../handler/errorhandler.js';
import { asyncDeleteHandler } from '../handler/deleteHandler.js';
import { validate } from '../middleware/validate.js';

import { CreateUser, PatchUser } from '../structers/userStruct.js';
const userRouter = express.Router();
const prisma = new PrismaClient();

userRouter
  .route('/')
  .get(
    tryCatchHandler(async (req, res) => {
      const { offset = 0, limit = 10, order } = req.query;
      let orderBy;
      switch (order) {
        case 'oldest':
          orderBy = { createdAt: 'asc' };
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }
      const user = await prisma.user.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          userPreference: { select: { receivedEmail: true } },
        },
      });
      res.status(200).send(user);
    }),
  )
  .post(
    validate(CreateUser),
    tryCatchHandler(async (req, res) => {
      const { userPreference, ...userFields } = req.body;
      const received = userPreference ? userPreference.receivedEmail : false;

      const user = await prisma.user.create({
        data: {
          ...userFields,
          userPreference: {
            create: {
              receivedEmail: received,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          userPreference: { select: { receivedEmail: true } },
        },
      });
      res.status(201).send(user);
    }),
  );

userRouter
  .route('/:id')
  .get(
    tryCatchHandler(async (req, res) => {
      const { id } = req.params;
      const user = await prisma.user.findUniqueOrThrow({
        where: { id },
        select: {
          name: true,
          email: true,
          createdAt: true,
          userPreference: { select: { receivedEmail: true } },
          comment: true,
        },
      });
      res.status(200).send(user);
    }),
  )
  .patch(
    validate(PatchUser),
    tryCatchHandler(async (req, res) => {
      const { id } = req.params;
      const { userPreference, ...userFields } = req.body;
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...userFields,
          userPreference: { update: { receivedEmail: userPreference.receivedEmail } },
        },
        select: { name: true, email: true, userPreference: { select: { receivedEmail: true } } },
      });
      res.send(user);
    }),
  )
  .delete(tryCatchHandler(asyncDeleteHandler(prisma.user)));

export default userRouter;
