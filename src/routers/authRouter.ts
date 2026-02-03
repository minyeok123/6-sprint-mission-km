import express from 'express';
import { validate } from '../middleware/validate';
import {
  CreateUser,
  LoginUser,
  PatchPassword,
  PatchUser,
  UserIdParams,
} from '../structs/userStruct';
import { tryCatchHandler } from '../middleware/errorhandler';

import { AuthController } from '../controller/authController';
import { authenticate } from '../middleware/authenticate';

const authRouter = express.Router();

authRouter
  .post('/register', validate(CreateUser), tryCatchHandler(AuthController.register))
  .post('/login', validate(LoginUser), tryCatchHandler(AuthController.login))
  .post('/refresh', tryCatchHandler(AuthController.refreshToken))
  .post('/logout', tryCatchHandler(AuthController.logout));

authRouter.get(
  '/:userId',
  authenticate,
  validate(UserIdParams, 'params'),
  tryCatchHandler(AuthController.userInfo),
);

authRouter.patch(
  '/:userId/update-info',
  authenticate,
  validate(UserIdParams, 'params'),
  validate(PatchUser),
  tryCatchHandler(AuthController.patchInfo),
);

authRouter
  .patch(
    '/:userId/password',
    authenticate,
    validate(UserIdParams, 'params'),
    validate(PatchPassword),
    tryCatchHandler(AuthController.updatePassword),
  )
  .delete(
    '/:userId/delete-account',
    authenticate,
    validate(UserIdParams, 'params'),
    tryCatchHandler(AuthController.deleteAccount),
  );

export default authRouter;
