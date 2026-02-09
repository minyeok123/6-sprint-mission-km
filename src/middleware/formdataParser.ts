import multer from 'multer';
import { Request } from 'express';

// 단순히 폼 데이터를 파싱하여 메모리에 저장하는 미들웨어
export function UploadImage(): multer.Multer {
  const storage = multer.memoryStorage();

  const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (/^image\//.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
  };

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter,
  });
}
