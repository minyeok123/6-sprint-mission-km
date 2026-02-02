import * as s from 'superstruct';
import type { Infer } from 'superstruct';
import { PaginationQuery, SearchQuery, OrderQuery } from './commonStruct';
import { NumberFromString } from './commonStruct';
export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 100),
  imageUrls: s.optional(s.array(s.string())), // 이미지 URL 목록 (JSON 배열)
});
export type CreateArticleType = Infer<typeof CreateArticle>;

export const PatchArticle = s.partial(CreateArticle);
export type PatchArticleType = Infer<typeof PatchArticle>;

export const ArticleIdParams = s.object({
  articleId: NumberFromString,
});
export type ArticleIdParamsType = Infer<typeof ArticleIdParams>;

export const GetArticlesQuery = s.assign(PaginationQuery, s.assign(SearchQuery, OrderQuery));
export type GetArticlesQueryType = Infer<typeof GetArticlesQuery>;
