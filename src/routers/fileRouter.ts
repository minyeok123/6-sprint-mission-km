import { Router } from 'express';
import { FileController } from '../controller/fileController';
import { UploadImage } from '../middleware/formdataParser';
import { tryCatchHandler } from '../middleware/errorhandler';
import { validate } from '../middleware/validate';
import { UploadFileQuery } from '../structs/fileStruct';

const fileRouter = Router();

// POST /files/upload
// 이미지 파일 목록을 업로드합니다. (Form Key: 'images')
fileRouter.post(
  '/upload',
  UploadImage().array('images'), // 다중 파일 허용 (array)
  validate(UploadFileQuery, 'query'),
  tryCatchHandler(FileController.uploadFile),
);

export default fileRouter;
