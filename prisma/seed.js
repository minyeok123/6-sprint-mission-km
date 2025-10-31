import { PrismaClient } from '@prisma/client';
import { Faker, ko, en } from '@faker-js/faker';
const prisma = new PrismaClient();
// 한국어 로케일만 사용하도록 설정합니다.
const faker = new Faker({
  locale: [ko],
});

async function deleteSeed() {
  console.log('기존 데이터를 삭제합니다...');
  // 참조 관계의 하위 모델부터 순서대로 삭제합니다.
  await prisma.comment.deleteMany({});
  await prisma.userPreference.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('모든 데이터가 삭제되었습니다.');
}

deleteSeed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('시딩 작업이 완료되었습니다.');
  });
