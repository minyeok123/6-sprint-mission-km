import { PrismaClient } from '@prisma/client';
import { Faker, ko, en } from '@faker-js/faker';
import { USERS, ARTICLES, PRODUCTS, COMMENTS, ORDERS } from './mock.js';
const prisma = new PrismaClient();
// 한국어 로케일만 사용하도록 설정합니다.
const faker = new Faker({
  locale: [ko],
});

async function main() {
  console.log('기존 데이터를 삭제합니다...');
  // 참조 관계의 하위 모델부터 순서대로 삭제합니다.
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.userPreference.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('모든 데이터가 삭제되었습니다.');

  for (const user of USERS) {
    const { userPreference, ...userData } = user;
    const createData = {
      ...userData,
    };

    if (userPreference) {
      createData.userPreference = {
        create: {
          receivedEmail: userPreference.receivedEmail,
        },
      };
    }
    await prisma.user.create({ data: createData });
  }

  console.log('상품 데이터를 시딩합니다...');
  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });

  console.log('게시글 데이터를 시딩합니다...');
  await prisma.article.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  });

  console.log('댓글 데이터를 시딩합니다...');
  await prisma.comment.createMany({
    data: COMMENTS,
    skipDuplicates: true,
  });

  console.log('주문 데이터를 시딩합니다...');
  for (const order of ORDERS) {
    const { orderItems, ...orderData } = order;
    await prisma.order.create({
      data: {
        ...orderData,
        orderItems: { create: orderItems },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('시딩 작업이 완료되었습니다.');
  });

// 시간이 없어서 ai 활용
