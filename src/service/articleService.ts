import { Prisma, User } from '@prisma/client';
import { prisma } from '../utils/prismaClient';
import type {
  ArticleIdParamsType,
  CreateArticleType,
  GetArticlesQueryType,
  PatchArticleType,
} from '../structs/articleStruct';
import { ArticleRepository } from '../repository/articleRepository';
import { HttpError } from '../utils/errors';

export class ArticleService {
  constructor(private articleRepository: ArticleRepository) {}
  async getArticles(query: GetArticlesQueryType) {
    const { page = 1, limit = 10, order, search } = query;

    const orderByOption = {
      recent: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
    } as const;

    const findManyOptions: Prisma.ArticleFindManyArgs = {
      where: search
        ? { OR: [{ title: { contains: search } }, { content: { contains: search } }] }
        : undefined,
      orderBy:
        order && (order === 'recent' || order === 'oldest')
          ? orderByOption[order]
          : orderByOption['recent'],
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, title: true, content: true, createdAt: true },
    };
    return this.articleRepository.findMany(findManyOptions);
  }

  async createArticle(data: CreateArticleType, user: User, file?: Express.Multer.File[]) {
    const { title, content } = data;
    const userId = user.id;
    let image;
    if (Array.isArray(file) && file.length > 0) {
      image = {
        create: file.map((file) => ({
          url: `/files/article-image/${file.filename}`,
        })),
      };
    }
    const dataToSave: Prisma.ArticleCreateArgs = {
      data: {
        title: title,
        content: content,
        user: { connect: { id: userId } },
        articleImages: image,
      },
    };
    return this.articleRepository.create(dataToSave);
  }

  async getArticleDetail(id: number) {
    const articleId = id;
    const findUniqueOption = {
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        _count: { select: { like: true } },
      },
    } as const;

    const article = await this.articleRepository.findUniqueOrThrow(findUniqueOption);

    return { ...article, isLiked: article._count.like > 0 };
  }

  async patchArticle(id: number, body: PatchArticleType, user: User) {
    const articleId = id;
    const { content, title } = body;
    const dataToUpdate = {
      where: { id: articleId },
      data: {
        title,
        content,
      },
    };
    const articleToUpdate = await this.articleRepository.findUniqueOrThrow({
      where: { id: articleId },
      select: { userId: true },
    });

    if (articleToUpdate.userId !== user.id) {
      throw new HttpError(403, '게시글을 수정할 권한이 없습니다.');
    }

    return this.articleRepository.update(dataToUpdate);
  }

  async deleteArticle(id: number, user: User) {
    const articleId = id;
    const articleToDelete = await this.articleRepository.findUniqueOrThrow({
      where: { id: articleId },
      select: { userId: true },
    });
    if (articleToDelete.userId !== user.id) {
      throw new HttpError(403, '게시글을 삭제할 권한이 없습니다.');
    }
    return this.articleRepository.delete({ where: { id: articleId } });
  }
}
