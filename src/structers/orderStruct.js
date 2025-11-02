import * as s from 'superstruct';
import { PrismaClient } from '@prisma/client';

const STATUS = ['PENDING', 'COMPLETE'];

export const CreateOrder = s.object({
  user: s.object({
    userId: s.define('Uuid', (value) => isUuid.v4(value)),
  }),
  orderitem: s.array(
    s.object({
      quantity: s.min(s.integer(), 1),
      unitPrice: s.min(s.number(), 0),
      product: s.object({
        productId: s.define('Uuid', (value) => isUuid.v4(value)),
      }),
    }),
  ),
});

export const PatchOrder = s.object({
  status: s.enums(STATUS),
});
