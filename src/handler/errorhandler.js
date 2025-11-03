import { StructError } from 'superstruct';
import { Prisma } from '@prisma/client';

export function tryCatchHandler(handler) {
  // handler(req,res)를 tryCatchHandler 의 파라미터로 정의해야함
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  };
}

export function errorHandler(e, req, res, next) {
  //   (&&) 연산자는 "내가 반환하는 값이 true인가? false인가?" 에는 관심이 없음. 규칙에 따라 값을 전달. if 문이 &&연산자가 truthy값인지 falsy값인지 판단
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
    return res.status(404).send({ message: '객체를 찾을 수 없음' });
  } else if (e.name === 'StructError') {
    console.log(e);
    return res.status(400).send({ message: '전달 사항을 조건에 맞춰 수정해주세요' });
  } else {
    console.log(e);
    return res.status(500).send({ message: '네트워크 오류 발생' });
  }
}
