import { prisma } from '../utils/prismaClient.js';
import { verifyAccessToken } from '../utils/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../utils/constants.js';
import { Request, Response, NextFunction } from 'express';
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      return res.status(401).send({ message: '유효하지 않은 접근입니다.' });
    }
    const { userId: userIdString } = verifyAccessToken(accessToken);
    const userId = parseInt(userIdString, 10);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).send({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).send({ message: '유효하지 않은 접근입니다.' });
  }
};
