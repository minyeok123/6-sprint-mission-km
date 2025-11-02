import * as s from 'superstruct';
import isEmail from 'is-email';
import isUuid from 'is-uuid';

const TAGS = ['FASHION', 'ELECTRONICS', 'KITCHENWARE'];

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 30),
  description: s.string(),
  price: s.min(s.integer(), 0),
  tag: s.enums(TAGS),
  stock: s.min(s.integer(), 1),
});

export const PatchProduct = s.partial(CreateProduct);
