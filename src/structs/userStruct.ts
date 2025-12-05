import * as s from 'superstruct';
import isEmail from 'is-email';
import type { Infer } from 'superstruct';
import { IdParam, PaginationQuery, OrderQuery } from './commonStruct.js';

const emailValidator = (value: unknown): boolean => {
  return typeof value === 'string' && isEmail(value);
};
export const CreateUser = s.object({
  email: s.define('Email', emailValidator), //s.define(<> ,...) <> =검사에서 실패했을 때 에러메시지에 사용
  password: s.size(s.string(), 8, 20),
  nickname: s.size(s.string(), 2, 10),
  name: s.size(s.string(), 1, 10),
  receivedEmail: s.optional(s.boolean()),
});
export type CreateUserType = Infer<typeof CreateUser>;

export const PatchUser = s.partial(s.omit(CreateUser, ['password']));
export type PatchUserType = Infer<typeof PatchUser>;

export const LoginUser = s.object({
  email: s.define('Email', emailValidator),
  password: s.size(s.string(), 8, 20),
});
export type LoginUserType = Infer<typeof LoginUser>;

export const PatchPassword = s.object({
  password: s.size(s.string(), 8, 20),
  newPassword: s.size(s.string(), 8, 20),
});
export type PatchPasswordType = Infer<typeof PatchPassword>;

export const UserIdParams = IdParam('userId');
export type UserIdParamsType = Infer<typeof UserIdParams>;

export const GetUserQuery = s.intersection([PaginationQuery, OrderQuery]);
export type GetUserQueryType = Infer<typeof GetUserQuery>;
