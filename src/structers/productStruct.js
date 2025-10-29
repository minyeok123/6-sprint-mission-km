import * as s from 'superstruct';
import isEmail from 'is-email';
import isUuid from 'is-uuid';

export const CreateUser = s.object({
  email: s.define('Email', isEmail), //s.define(<> ,...) <> =검사에서 실패했을 때 에러메시지에 사용
  name: s.size(s.string(), 1, 10),
  userPreference: s.object({
    receiveEmail: s.boolean(),
  }),
});

export const PatchUser = s.partial(CreateUser);

const TAGS = ['FASHION', 'ELECTRONICS', 'KITCHENWARE'];

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 30),
  description: s.string(),
  price: s.integer(),
  tag: s.enums(TAGS),
});

export const PatchProduct = s.partial(CreateProduct);
