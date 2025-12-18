import express from 'express';
import { validate } from '../middleware/validate';
import { GetUserQuery } from '../structs/userStruct';
import { UserController } from '../controller/userController';
import { tryCatchHandler } from '../middleware/errorhandler';

const userRouter = express.Router();

userRouter
  .route('/')
  .get(validate(GetUserQuery, 'query'), tryCatchHandler(UserController.getUsers));

export default userRouter;
