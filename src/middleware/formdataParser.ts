import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { Request } from 'express';

export function UploadImage(subfolder: string): multer.Multer {
  // 1) 업로드 폴더 경로
  const uploadDir = path.join(process.cwd(), 'uploads', subfolder); //현재 작업 디렉토리(process.cwd()) 안에 있는 ‘uploads’ 폴더 경로를 만든다

  // 2) 폴더가 없으면 생성
  // !fs.existsSync(uploadDir) -> uploadDir 파일이 존재하지 않으면(true) uploadDir 폴더를 만들어라
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 3) 저장 방식 설정
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const unique = crypto.randomBytes(16).toString('hex');
      const ext = path.extname(file.originalname);
      cb(null, unique + ext);
    },
  });

  // 4) 이미지 파일만 허용하는 필터
  function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (/^image\//.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
  }

  // 5) multer middleware export
  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, //10MB
    fileFilter,
  });
}

export const textParser = multer().fields([]);
