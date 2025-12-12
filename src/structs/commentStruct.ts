import * as s from 'superstruct';
import type { Infer } from 'superstruct';
import { NumberFromString } from './commonStruct';
export const CreateProductComment = s.object({
  content: s.size(s.string(), 1, 50),
});
export type CreateProductCommentType = Infer<typeof CreateProductComment>;

export const CreateArticleComment = s.object({
  content: s.size(s.string(), 1, 50),
});
export type CreateArticleCommentType = Infer<typeof CreateArticleComment>;

export const PatchComment = s.object({
  content: s.size(s.string(), 1, 50),
});
export type PatchCommentType = Infer<typeof PatchComment>;

export const CommentIdParams = s.object({
  commentId: NumberFromString,
});
export type CommentIdParamsType = Infer<typeof CommentIdParams>;

export const GetCommentQuery = s.object({
  limit: s.optional(s.coerce(s.min(s.integer(), 1), s.string(), (val) => parseInt(val, 10))),
  cursorId: s.optional(s.coerce(s.integer(), s.string(), (val) => parseInt(val, 10))),
});
export type GetCommentQueryType = Infer<typeof GetCommentQuery>;
