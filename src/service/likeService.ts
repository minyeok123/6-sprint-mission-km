import { number } from 'superstruct';
import { LikeRepository } from '../repository/likeRepository';
import { Prisma, User } from '@prisma/client';

export class LikeService {
  constructor(private likeRepository: LikeRepository) {}

  async toggleProductLike(id: number, user: User) {
    const productId = id;
    const userId = user.id;
    const findOptions = { where: { userId, productId } };
    
    const existingLike = await this.likeRepository.findFirstProductLike(findOptions);

    if (existingLike) {
      await this.likeRepository.deleteProductLike({ where: { id: existingLike.id } });
      return { created: false, message: '좋아요가 취소되었습니다.' };
    } else {
      await this.likeRepository.createProductLike({
        data: {
          user: { connect: { id: userId } },
          product: { connect: { id: productId } },
        },
      });
      return { created: true, message: '좋아요를 눌렀습니다.' };
    }
  }

  async toggleArticleLike(id: number, user: User) {
    const articleId = id;
    const userId = user.id;
    const findOptions = { where: { userId, articleId } };

    const existingLike = await this.likeRepository.findFirstArticleLike(findOptions);

    if (existingLike) {
      await this.likeRepository.deleteArticleLike({ where: { id: existingLike.id } });
      return { created: false, message: '좋아요가 취소되었습니다.' };
    } else {
      await this.likeRepository.createArticleLike({
        data: {
          user: { connect: { id: userId } },
          article: { connect: { id: articleId } },
        },
      });
      return { created: true, message: '좋아요를 눌렀습니다.' };
    }
  }
}
