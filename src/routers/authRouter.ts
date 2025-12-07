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
import { UploadImage } from '../middleware/formdataParser';
import { AuthController } from '../controller/authController';
import { authenticate } from '../middleware/authenticate';

const authRouter = express.Router();
const profileUpload = UploadImage('user-profiles');

authRouter
  .post(
    '/register',
    profileUpload.single('profileImage'),
    validate(CreateUser),
    tryCatchHandler(AuthController.register),
  )
  .post('/login', profileUpload.none(), validate(LoginUser), tryCatchHandler(AuthController.login))
  .post('/refresh', profileUpload.none(), tryCatchHandler(AuthController.refreshToken))
  .post('/logout', tryCatchHandler(AuthController.logout));

authRouter
  .get(
    '/:userId',
    authenticate,
    validate(UserIdParams, 'params'),
    tryCatchHandler(AuthController.getInfo),
  )
  .patch(
    '/:userId',
    authenticate,
    profileUpload.none(),
    validate(UserIdParams, 'params'),
    validate(PatchUser),
    tryCatchHandler(AuthController.patchInfo),
  )
  .patch(
    '/:userId/password',
    authenticate,
    profileUpload.none(),
    validate(UserIdParams, 'params'),
    validate(PatchPassword),
    tryCatchHandler(AuthController.updatePassword),
  )
  .get(
    '/:userId/products',
    authenticate,
    profileUpload.none(),
    validate(UserIdParams, 'params'),
    tryCatchHandler(AuthController.getCreatedProduct),
  )
  .get(
    '/:userId/liked-products',
    authenticate,
    profileUpload.none(),
    validate(UserIdParams, 'params'),
    tryCatchHandler(AuthController.getLikedProduct),
  );

export default authRouter;
