import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants';
interface customJwtPayload extends JwtPayload {
  id: number;
}

export const generateTokens = (userId: number): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
    issuer: 'sprint-Mission4',
  } as SignOptions);
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '6h',
    issuer: 'sprint-Mission4',
  } as SignOptions);
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as customJwtPayload;
  return { userId: decoded.id };
};

export const verifyRefreshToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as customJwtPayload;
  return { userId: decoded.id };
};
