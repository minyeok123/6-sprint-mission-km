import { Prisma } from '@prisma/client';
import fs from 'fs/promises';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { HttpError } from '../utils/errors';
type AsyncHandler = (req: Request, res: Response) => Promise<any>;

export function tryCatchHandler(handler: AsyncHandler): RequestHandler {
  // handler(req,res)를 tryCatchHandler 의 파라미터로 정의해야함
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (e) {
      if (e instanceof HttpError) {
        return res.status(e.status).json({ message: e.message });
      }
      next(e);
    }
  };
}

export async function errorHandler(e: Error, req: Request, res: Response, next: NextFunction) {
  if (req.file) {
    // 에러가 발생했는데, 업로드된 파일이 있다면?
    // 일단 파일을 삭제해서 "고아 파일"이 남지 않게 한다.
    await fs.unlink(req.file.path);
  }

  //   (&&) 연산자는 "내가 반환하는 값이 true인가? false인가?" 에는 관심이 없음. 규칙에 따라 값을 전달. if 문이 &&연산자가 truthy값인지 falsy값인지 판단
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
    return res.status(404).send({ message: '정보를 찾을 수 없음' });
  } else if (e.name === 'StructError') {
    console.log(e);
    return res.status(400).send({ message: '전달 사항을 조건에 맞춰 수정해주세요' });
  } else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
    return res.status(400).send({ message: '이미 사용중인 이메일 또는 닉네임 입니다.' });
  } else {
    console.log(e);
    return res.status(500).send({ message: '네트워크 오류 발생' });
  }
}
