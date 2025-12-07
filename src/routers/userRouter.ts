import express from 'express';
import { validate } from '../middleware/validate';
import { GetUserQuery, PatchUser, UserIdParams } from '../structs/userStruct';
import { UserController } from '../controller/userController';
import { tryCatchHandler } from '../middleware/errorhandler';

const userRouter = express.Router();

userRouter
  .route('/')
  .get(validate(GetUserQuery, 'query'), tryCatchHandler(UserController.getUsers));

userRouter
  .route('/:userId')

  .delete(validate(UserIdParams, 'params'), tryCatchHandler(UserController.deleteUser));

export default userRouter;
