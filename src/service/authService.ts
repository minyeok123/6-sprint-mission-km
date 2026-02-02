import { Prisma, User } from '@prisma/client';
import { HttpError } from '../utils/errors';
import { AuthRepository } from '../repository/authRepository';
import {
  CreateUserType,
  LoginUserType,
  PatchPasswordType,
  PatchUserType,
} from '../structs/userStruct';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/token';
import { getS3Url } from '../utils/s3Handler';

interface UserInfoType {
  id: number;
  name: string;
  nickname: string;
  email: string;
  createdAt: Date;
  profileImage: {
    url: string;
  } | null;
}

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async register(data: CreateUserType) {
    const { password, receivedEmail, profileImage, ...userFields } = data;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let image;
    if (profileImage) {
      image = { create: { url: profileImage } };
    }
    const dataToSave: Prisma.UserCreateArgs = {
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
    };
    const user = await this.authRepository.create(dataToSave);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginUserType) {
    const { email, password } = data;
    const user = await this.authRepository.findUnique({ where: { email } });
    if (!user) {
      throw new HttpError(401, '존재하지 않는 이메일 입니다.');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(401, '이메일 또는 비밀번호가 일치하지 않습니다.');
    }
    // 토큰 생성
    const { accessToken, refreshToken } = generateTokens(user.id); // 토큰 생성
    return { accessToken, refreshToken, user };
  }

  async refreshToken(token: string | undefined) {
    const refreshToken = token;
    if (!refreshToken) {
      throw new HttpError(401, '잘못된 접근입니다.');
    }
    const { userId } = verifyRefreshToken(refreshToken); //클라이언트에서 넘어온 토큰이 우리 서버에서 내려준 토큰과 일치하는지 검증
    const user = await this.authRepository.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpError(401, '유효하지않은 이메일 입니다.');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
    return { accessToken, newRefreshToken };
  }

  async userInfo(id: number, user: User) {
    const userId = id;
    const getInfoOption = {
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
    };
    const userInfo = (await this.authRepository.findUnique(
      getInfoOption,
    )) as unknown as UserInfoType | null;
    if (!userInfo) {
      throw new HttpError(404, '회원 정보를 찾을수 없습니다.');
    }
    if (userInfo.id !== user.id) {
      throw new HttpError(403, '자신의 정보만 조회할 수 있습니다.');
    }

    if (userInfo.profileImage) {
      userInfo.profileImage.url = getS3Url(userInfo.profileImage.url);
    }

    return userInfo;
  }

  async patchInfo(id: number, data: PatchUserType, user: User) {
    if (id !== user.id) {
      throw new HttpError(403, '정보를 수정할 권한이 없습니다.');
    }
    const { receivedEmail, profileImage, ...userFields } = data;

    let imageUpdate;
    if (profileImage) {
      imageUpdate = {
        upsert: {
          create: { url: profileImage },
          update: { url: profileImage },
        },
      };
    }

    const updateOption: Prisma.UserUpdateArgs = {
      where: { id: id },
      data: {
        ...userFields,
        userPreference: { update: { receivedEmail } },
        profileImage: imageUpdate,
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
    };
    const updatedUser = (await this.authRepository.update(updateOption)) as unknown as UserInfoType;
    /* 
    레포지토리가 반환하는 타입이 Prisma의 기본 User 타입(프로필 이미지가 없는 상태)으로 추론되는데,
    실제로는 select 옵션을 통해 profileImage를 포함해서 가져오고 있으므로
    타입 어설션(as unknown as UserInfoType)을 사용하여 올바른 타입으로 지정합니다.
    */
    if (updatedUser.profileImage) {
      updatedUser.profileImage.url = getS3Url(updatedUser.profileImage.url);
    }
    return updatedUser;
  }

  async updatePassword(id: number, data: PatchPasswordType, user: User) {
    if (id !== user.id) {
      throw new HttpError(403, '정보를 수정할 권한이 없습니다.');
    }
    const userId = id;
    const { password, newPassword } = data;
    if (!password) {
      throw new HttpError(401, '비밀번호를 입력해주세요.');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(401, '아이디또는 비밀번호가 일치하지 않습니다.');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatePasswordOption = {
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    };

    await this.authRepository.update(updatePasswordOption);
  }

  async deleteAccount(id: number, user: User) {
    const userId = id;
    if (userId !== user.id) {
      throw new HttpError(403, '계정 삭제 권한이 없습니다.');
    }
    await this.authRepository.delete({ where: { id: userId } });
  }
}
