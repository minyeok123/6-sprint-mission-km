import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prismaClient';

const agent = request.agent(app);

describe('인증이 필요하지 않은 상품 API 테스트', () => {
  beforeAll(async () => {
    await prisma.product.deleteMany();
    const product = await prisma.product.create({
      data: {
        id: 1,
        productName: '테스트1',
        description: '테스트1',
        price: 999,
        stock: 10,
        userId: 1,
      },
    });
    await prisma.product.create({
      data: {
        id: 2,
        productName: '테스트2',
        description: '테스트2',
        price: 999,
        stock: 10,
        userId: 2,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('상품 목록 조회 API 테스트', () => {
    test('목록 조회 요청이 성공했을시 200 코드와 배열을 반환', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    test('페이지네이션 테스트 ', async () => {
      const response = await request(app).get('/products').query({ page: 1, limit: 1 });
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });

    test('검색어 테스트', async () => {
      const response = await request(app).get('/products').query({ search: '테스트1' });
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].productName).toBe('테스트1');
    });

    test('oldest 정렬 테스트', async () => {
      const response = await request(app).get('/products').query({ order: 'oldest' });
      expect(response.status).toBe(200);
      expect(response.body[0].productName).toBe('테스트1');
    });

    test('recent 정렬 테스트 ', async () => {
      const response = await request(app).get('/products').query({ order: 'recent' });
      expect(response.status).toBe(200);
      expect(response.body[0].productName).toBe('테스트2');
    });
  });

  describe('상품 상세 조회 API 테스트', () => {
    test('상품 상제 조회 요청시 성공 > 200코드,데이터 반환', async () => {
      const productId = 1;
      const response = await request(app).get(`/products/${productId}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        productName: '테스트1',
        description: '테스트1',
        price: 999,
        stock: 10,
      });
    });
    test('잘못된 파라미터로 요청 > 404코드,에러 메세지 반환', async () => {
      const productId = 4;
      const response = await request(app).get(`/products/${productId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('정보를 찾을 수 없음');
    });
  });
});
