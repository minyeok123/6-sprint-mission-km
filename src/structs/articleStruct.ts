import * as s from 'superstruct';
import type { Infer } from 'superstruct';
import { IdParam, PaginationQuery, SearchQuery, OrderQuery } from './commonStruct';

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 30),
  content: s.size(s.string(), 1, 100),
});
export type CreateArticleType = Infer<typeof CreateArticle>;

export const PatchArticle = s.partial(CreateArticle);
export type PatchArticleType = Infer<typeof PatchArticle>;

export const ArticleIdParams = IdParam('articleId');
export type ArticleIdParamsType = Infer<typeof ArticleIdParams>;

export const GetArticlesQuery = s.intersection([PaginationQuery, SearchQuery, OrderQuery]);
export type GetArticlesQueryType = Infer<typeof GetArticlesQuery>;
