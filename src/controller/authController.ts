import { clearTokenCookies, setTokenCookies } from '../utils/cookies';
import { REFRESH_TOKEN_COOKIE_NAME } from '../utils/constants';
import { Request, Response } from 'express';
import {
  CreateUserType,
  LoginUserType,
  PatchPasswordType,
  PatchUserType,
  UserIdParamsType,
} from '../structs/userStruct';
import { ValidatedParamsRequest } from '../middleware/validate';
import { AuthService } from '../service/authService';
import { AuthRepository } from '../repository/authRepository';
import { User } from '@prisma/client';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export class AuthController {
  //회원가입
  static register = async (req: Request, res: Response) => {
    const data = req.body as CreateUserType;
    const userWithoutPassword = await authService.register(data);

    res.status(201).send(userWithoutPassword);
  };

  // 로그인
  static login = async (req: Request, res: Response) => {
    const data = req.body as LoginUserType;
    const { accessToken, refreshToken, user } = await authService.login(data);
    setTokenCookies(res, accessToken, refreshToken); // set-cookie 헤더에 토큰을 담아 Http형식으로 브라우저에 전송//res객체는 비지니스 로직으로 넘기지 않는다.
    res.status(200).send({ message: `${user.name}님 로그인이 성공적으로 완료 됐습니다.` });
  };

  //토큰 재발급
  static refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string | undefined;
    const { accessToken, newRefreshToken } = await authService.refreshToken(refreshToken);
    setTokenCookies(res, accessToken, newRefreshToken);
    res.status(200).send({ message: '토큰 재발급 성공' });
  };

  //로그아웃
  static logout = async (req: Request, res: Response) => {
    clearTokenCookies(res);
    res.status(200).send({ message: '로그아웃이 완료 됐습니다.' });
  };

  // 유저 정보 상세조회
  static userInfo = async (req: Request, res: Response) => {
    const { userId } = (req as ValidatedParamsRequest<UserIdParamsType>).validatedParams;
    const user = req.user as User;
    const userInfo = await authService.userInfo(userId, user);
    res.status(200).send(userInfo);
  };

  //유저 정보 수정
  static patchInfo = async (req: Request, res: Response) => {
    const { userId } = (req as ValidatedParamsRequest<UserIdParamsType>).validatedParams;
    const data = req.body as PatchUserType;
    const user = req.user as User;
    const patchUser = await authService.patchInfo(userId, data, user);
    res.status(201).send(patchUser);
  };

  //비밀번호 변경
  static updatePassword = async (req: Request, res: Response) => {
    const { userId } = (req as ValidatedParamsRequest<UserIdParamsType>).validatedParams;
    const data = req.body as PatchPasswordType;
    const user = req.user as User;
    await authService.updatePassword(userId, data, user);

    res.status(201).send({ message: '비밀번호 변경이 완료 되었습니다.' });
  };

  //회원 탈퇴
  static deleteAccount = async (req: Request, res: Response) => {
    const { userId } = (req as ValidatedParamsRequest<UserIdParamsType>).validatedParams;
    const user = req.user as User;
    await authService.deleteAccount(userId, user);
    res.sendStatus(204);
  };
}
