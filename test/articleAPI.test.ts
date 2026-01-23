import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prismaClient';

describe('인증이 필요하지 않은 게시글 API에 대한 통합 테스트', () => {
  beforeAll(async () => {
    await prisma.article.deleteMany();
    await prisma.article.create({
      data: {
        id: 1,
        title: '테스트 아티클1',
        content: '테스트 아티클1',
        userId: 1,
      },
    });
    await prisma.article.create({
      data: {
        id: 2,
        title: '테스트 아티클2',
        content: '테스트 아티클2',
        userId: 2,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
  describe('아티클 목록 조회 API 테스트', () => {
    test('목록 조회 요청 성공 > 200코드와 배열 반환', async () => {
      const response = await request(app).get('/articles');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
    test('페이지 네이션 테스트', async () => {
      const response = await request(app).get('/articles').query({ page: 1, limit: 1 });
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
    test('검색어 테스트', async () => {
      const response = await request(app).get('/articles').query({ search: '아티클2' });
      expect(response.status).toBe(200);
      expect(response.body[0].title).toBe('테스트 아티클2');
    });
    test('oldest 정렬 테스트', async () => {
      const response = await request(app).get('/articles').query({ order: 'oldest' });

      expect(response.status).toBe(200);
      expect(response.body[0].title).toBe('테스트 아티클1');
    });
    test('recent 정렬 테스트', async () => {
      const response = await request(app).get('/articles').query({ order: 'recent' });

      expect(response.status).toBe(200);
      expect(response.body[0].title).toBe('테스트 아티클2');
    });
  });

  describe('아티클 상세 조회 API 테스트', () => {
    test('상세 조회 요청 성공 > 200코드와 객체 반환', async () => {
      const articleId = 1;
      const response = await request(app).get(`/articles/${articleId}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        title: '테스트 아티클1',
        content: '테스트 아티클1',
      });
    });
    test('잘못된 파라미터로 요청 > 404코드,에러 메세지 반환', async () => {
      const articleId = 4;
      const response = await request(app).get(`/articles/${articleId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('정보를 찾을 수 없음');
    });
  });
});
