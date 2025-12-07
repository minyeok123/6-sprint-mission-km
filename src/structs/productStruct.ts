import * as s from 'superstruct';
import type { Infer } from 'superstruct';
import { IdParam, PaginationQuery, SearchQuery, OrderQuery } from './commonStruct.js';
const TAGS = ['FASHION', 'ELECTRONICS', 'KITCHENWARE'];

export const CreateProduct = s.object({
  productName: s.size(s.string(), 1, 30),
  description: s.string(),
  price: s.min(s.integer(), 0),
  tag: s.enums(TAGS),
  stock: s.min(s.integer(), 1),
});
export type CreateProductType = Infer<typeof CreateProduct>;

export const PatchProduct = s.partial(CreateProduct);
export type PatchProductType = Infer<typeof PatchProduct>;

export const ProductIdParams = IdParam('productId');
export type ProductParamsType = Infer<typeof ProductIdParams>;

export const GetProductsQuery = s.intersection([PaginationQuery, SearchQuery, OrderQuery]);
export type GetProductsQueryType = Infer<typeof GetProductsQuery>;
