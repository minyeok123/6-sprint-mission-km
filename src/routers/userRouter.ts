import express from 'express';
import { validate } from '../middleware/validate.js';
import { GetUserQuery, PatchUser, UserIdParams } from '../structs/userStruct.js';
import { UserController } from '../controller/userController.js';
import { tryCatchHandler } from '../middleware/errorhandler.js';

const userRouter = express.Router();

userRouter
  .route('/')
  .get(validate(GetUserQuery, 'query'), tryCatchHandler(UserController.getUsers));

userRouter
  .route('/:userId')

  .delete(validate(UserIdParams, 'params'), tryCatchHandler(UserController.deleteUser));

export default userRouter;
