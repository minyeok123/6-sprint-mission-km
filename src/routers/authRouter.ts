import express from 'express';
import { validate } from '../middleware/validate.js';
import {
  CreateUser,
  LoginUser,
  PatchPassword,
  PatchUser,
  UserIdParams,
} from '../structs/userStruct.js';
import { tryCatchHandler } from '../middleware/errorhandler.js';
import { UploadImage } from '../middleware/formdataParser.js';
import { AuthController } from '../controller/authController.js';
import { authenticate } from '../middleware/authenticate.js';

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
