import * as s from 'superstruct';
import type { Infer } from 'superstruct';
import { PaginationQuery, SearchQuery, OrderQuery } from './commonStruct';
import { NumberFromString } from './commonStruct';

export const CreateProduct = s.object({
  productName: s.size(s.string(), 1, 30),
  description: s.string(),
  price: s.min(s.integer(), 0),
  tag: s.size(s.string(), 1, 10),
  stock: s.min(s.integer(), 1),
  imageUrls: s.optional(s.array(s.string())),
});
export type CreateProductType = Infer<typeof CreateProduct>;

export const PatchProduct = s.assign(
  s.partial(CreateProduct),
  s.object({
    newImages: s.optional(s.array(s.string())),
    deleteImageIds: s.optional(s.array(s.number())),
  }),
);
export type PatchProductType = Infer<typeof PatchProduct>;

export const ProductIdParams = s.object({
  productId: NumberFromString,
});
export type ProductIdParamsType = Infer<typeof ProductIdParams>;

export const GetProductsQuery = s.assign(PaginationQuery, s.assign(SearchQuery, OrderQuery));
export type GetProductsQueryType = Infer<typeof GetProductsQuery>;
