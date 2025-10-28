import { prismaClient } from '@prisma/prismaClient';
import { USERS, PRODUCTS } from './mock';
import { PrismaClient } from '@prisma/client/extension';

const Prisma = new PrismaClient();

async function main() {
  await Prisma.user.createMany({
    data: USERS,
    skipDuplicates: true,
  }),
    await Prisma.PRODUCTS.createMany({
      data: PRODUCTS,
      skipDuplicates: true,
    });
}
