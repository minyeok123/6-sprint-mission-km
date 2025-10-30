import * as s from 'superstruct';
import isUuid from 'is-uuid';
import isEmail from 'is-email';

export const CreateProductComment = s.object({
  content: s.size(s.string(), 1, 50),
  user: s.object({
    userId: s.define('Uuid', (value) => isUuid.v4(value)),
  }),
  product: s.object({
    productId: s.define('Uuid', (value) => isUuid.v4(value)),
  }),
});

export const CreateAricleComment = s.object({
  content: s.size(s.string(), 1, 50),
  user: s.object({
    userId: s.define('Uuid', (value) => isUuid.v4(value)),
  }),
  article: s.object({
    articleId: s.define('Uuid', (value) => isUuid.v4(value)),
  }),
});

export const PatchComment = s.object({
  content: s.size(s.string(), 1, 50),
});
