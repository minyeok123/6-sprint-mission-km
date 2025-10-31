import * as s from 'superstruct';
import isUuid from 'is-uuid';
import isEmail from 'is-email';

export const CreateUser = s.object({
  email: s.define('Email', isEmail), //s.define(<> ,...) <> =검사에서 실패했을 때 에러메시지에 사용
  name: s.size(s.string(), 1, 10),
  userPreference: s.optional(
    s.object({
      receivedEmail: s.boolean(),
    }),
  ),
});

export const PatchUser = s.partial(CreateUser);
