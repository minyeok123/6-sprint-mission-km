import { prisma } from '../utils/prismaClient.js';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/token.js';
import { clearTokenCookies, setTokenCookies } from '../utils/cookies.js';
import { JWT_ACCESS_TOKEN_SECRET, REFRESH_TOKEN_COOKIE_NAME } from '../utils/constants.js';
import { Request, Response, NextFunction } from 'express';
import {
  CreateUserType,
  LoginUserType,
  PatchPasswordType,
  UserIdParams,
} from '../structs/userStruct.js';
import { HttpError } from '../utils/errors.js';
export class AuthController {
  //회원가입
  static register = async (req: Request, res: Response) => {
    const { receivedEmail, password, ...userFields } = req.body as CreateUserType;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const profileImage = req.file;

    let image;
    if (profileImage) {
      image = { create: { url: `/files/user-profiles/${profileImage.filename}` } };
    }

    const user = await prisma.user.create({
      data: {
        ...userFields,
        password: hashedPassword,
        userPreference: {
          create: {
            receivedEmail,
          },
        },
        profileImage: image,
      },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).send(userWithoutPassword);
  };

  // 로그인
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginUserType;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(401, '비밀번호가 일치하지 않습니다.');
    }
    const { accessToken, refreshToken } = generateTokens(user.id); // 토큰 생성
    setTokenCookies(res, accessToken, refreshToken); // set-cookie 헤더에 토큰을 담아 Http형식으로 브라우저에 전송
    res.status(200).send({ message: `${user.name}님 로그인이 성공적으로 완료 됐습니다.` });
  };

  //토큰 재발급
  static refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }

    const { userId } = verifyRefreshToken(refreshToken); //클라이언트에서 넘어온 토큰이 우리 서버에서 내려준 토큰과 일치하는지 검증

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpError(401, '유효하지않은 이메일 입니다.');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

    setTokenCookies(res, accessToken, newRefreshToken);

    res.status(200).send({ message: '토큰 재발급 성공' });
  };

  //로그아웃
  static logout = async (req: Request, res: Response) => {
    clearTokenCookies(res);
    res.status(200).send({ message: '로그아웃이 완료 됐습니다.' });
  };

  // 유저 정보 상세조회
  static getInfo = async (req: Request, res: Response) => {
    const { userId } = UserIdParams.create(req.params);
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }
    const userInfo = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        nickname: true,
        email: true,
        createdAt: true,
        profileImage: {
          select: {
            url: true,
          },
        },
      },
    });
    if (!userInfo) {
      throw new HttpError(401, '회원 정보를 찾을수 없습니다.');
    }
    if (userInfo.id !== user.id) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }
    res.status(200).send(userInfo);
  };

  //유저 정보 수정
  static patchInfo = async (req: Request, res: Response) => {
    const { userId } = UserIdParams.create(req.params);
    const { receivedEmail, ...userFields } = req.body;
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }

    const patchedUser = await prisma.$transaction(async (tx) => {
      const foundUser = await tx.user.findUnique({ where: { id: userId } });
      if (!foundUser) {
        throw new HttpError(401, '잘못된 접근입니다.');
      }
      if (foundUser.id !== user.id) {
        throw new HttpError(401, '잘못된 접근입니다.');
      }
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          ...userFields,
          userPreference: { update: { receivedEmail } },
        },
        select: {
          id: true,
          name: true,
          nickname: true,
          email: true,
          createdAt: true,
          profileImage: {
            select: {
              url: true,
            },
          },
        },
      });
      return updatedUser;
    });

    res.status(201).send(patchedUser);
  };

  //비밀번호 변경
  static updatePassword = async (req: Request, res: Response) => {
    const { userId } = UserIdParams.create(req.params);
    const { password, newPassword } = req.body as PatchPasswordType;
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }
    if (!password) {
      throw new HttpError(401, '비밀번호를 입력해주세요.');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(401, '아이디또는 비밀번호가 일치하지 않습니다.');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const patchedPassword = await prisma.$transaction(async (tx) => {
      const foundUser = await tx.user.findUnique({ where: { id: userId } });
      if (!foundUser) {
        throw new HttpError(401, '이용자를 찾을 수 없습니다.');
      }
      if (foundUser.id !== user.id) {
        throw new HttpError(401, '잘못된 접근입니다.');
      }
      await tx.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });
    });
    res.status(201).send({ message: '비밀번호 변경이 완료 되었습니다.' });
  };

  //게시 상품 조회
  static getCreatedProduct = async (req: Request, res: Response) => {
    const { userId } = UserIdParams.create(req.params);
    const user = req.user;
    if (!user) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }

    const product = await prisma.$transaction(async (tx) => {
      const foundUser = await tx.user.findUnique({ where: { id: userId } });
      if (!foundUser) {
        throw new HttpError(401, '회원을 찾을 수 없습니다.');
      }
      if (foundUser.id !== user.id) {
        throw new HttpError(401, '잘못된 접근입니다.');
      }
      const createdProduct = await tx.product.findMany({
        where: { userId: userId },
      });
      if (!createdProduct) {
        throw new HttpError(401, '등록된 상품을 찾을 수 없습니다.');
      }
      return createdProduct;
    });
    res.status(200).send(product);
  };

  //좋아요 상품 조회
  static getLikedProduct = async (req: Request, res: Response) => {
    const { userId } = UserIdParams.create(req.params);
    const user = req.user;
    if (!user) {
      return res.status(401).send({ message: '잘못된 접근입니다.' });
    }
    if (userId !== user.id) {
      return res.status(401).send({ message: '접근 권한이 없습니다.' });
    }

    const likedProduct = await prisma.product.findMany({
      where: { like: { some: { userId: userId } } },
    });
    res.status(200).send(likedProduct);
  };
}
