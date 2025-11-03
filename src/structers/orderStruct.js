import * as s from 'superstruct';
import { PrismaClient } from '@prisma/client';
import isUuid from 'is-uuid';

const STATUS = ['PENDING', 'COMPLETE'];

export const CreateOrder = s.object({
  user: s.object({
    userId: s.define('Uuid', (value) => isUuid.v4(value)),
  }),
  orderItems: s.array(
    s.object({
      quantity: s.min(s.integer(), 1),
      // unitPrice: s.min(s.number(), 0),
      //클라이언트로부터 받으면 안됨
      product: s.object({
        productId: s.define('Uuid', (value) => isUuid.v4(value)),
      }),
    }),
  ),
});

export const PatchOrder = s.object({
  status: s.enums(STATUS),
});
