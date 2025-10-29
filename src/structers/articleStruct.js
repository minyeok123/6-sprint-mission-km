import * as s from 'superstruct';
import isUuid from 'is-uuid';
import isEmail from 'is-email';

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 100),
});

export const PatchArticle = s.partial(CreateArticle);
