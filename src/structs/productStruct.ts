import * as s from 'superstruct';

const TAGS = ['FASHION', 'ELECTRONICS', 'KITCHENWARE'];
export const CreateProduct = s.object({
  productName: s.size(s.string(), 1, 30),
  description: s.string(),
  price: s.min(s.integer(), 0),
  tag: s.enums(TAGS),
  stock: s.min(s.integer(), 1),
});

export const PatchProduct = s.partial(CreateProduct);
