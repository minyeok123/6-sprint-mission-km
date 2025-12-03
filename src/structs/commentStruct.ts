import * as s from 'superstruct';

export const CreateProductComment = s.object({
  content: s.size(s.string(), 1, 50),
});

export const CreateArticleComment = s.object({
  content: s.size(s.string(), 1, 50),
});

export const PatchComment = s.object({
  content: s.size(s.string(), 1, 50),
});
