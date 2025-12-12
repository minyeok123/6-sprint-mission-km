import * as s from 'superstruct';
import type { Infer } from 'superstruct';

//PageNation쿼리 정의 및 타입 정의
export const PaginationQuery = s.object({
  page: s.optional(s.coerce(s.min(s.integer(), 1), s.string(), (val) => parseInt(val, 10))),
  limit: s.optional(s.coerce(s.min(s.integer(), 1), s.string(), (val) => parseInt(val, 10))),
});
export type PaginationType = Infer<typeof PaginationQuery>;

//search쿼리 정의 및 타입 정의
export const SearchQuery = s.object({
  search: s.optional(s.size(s.string(), 1, 50)),
});

export type SearchType = Infer<typeof SearchQuery>;

export const OrderQuery = s.object({
  order: s.optional(s.enums(['recent', 'oldest'])),
});
export type OrderType = Infer<typeof OrderQuery>;
