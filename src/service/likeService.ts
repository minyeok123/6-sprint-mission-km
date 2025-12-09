import { number } from 'superstruct';
import { LikeRepository } from '../repository/likeRepository';
import { User } from '@prisma/client';

export class LikeService {
  constructor(private likeRepository: LikeRepository) {}

  async toggleProductLike(id: number, user: User) {
    const productId = id;
    const userId = user.id;
    const isLikedProductOptions = {
      where: {
        userId: userId,
        productId: productId,
        articleId: null,
      },
    };
    const isLikedProduct = await this.likeRepository.findFirst(isLikedProductOptions);
    if (isLikedProduct) {
      await this.likeRepository.delete({
        where: { id: isLikedProduct.id },
      });
      return { created: false, message: '좋아요가 취소되었습니다.' };
    } else {
      const newLike = await this.likeRepository.create({
        data: {
          user: { connect: { id: userId } },
          product: { connect: { id: productId } },
        },
      });
      return { created: true, message: '좋아요를 눌렀습니다.', data: newLike };
    }
  }
  async toggleArticleLike(id: number, user: User) {
    const articleId = id;
    const userId = user.id;
    const isLikedArticleOptions = {
      where: {
        userId: user.id,
        productId: null,
        articleId: articleId,
      },
    };
    const isLikedArticle = await this.likeRepository.findFirst(isLikedArticleOptions);
    if (isLikedArticle) {
      await this.likeRepository.delete({ where: { id: isLikedArticle.id } });
      return { created: false, message: '좋아요가 취소되었습니다.' };
    } else {
      const newLike = await this.likeRepository.create({
        data: {
          user: { connect: { id: userId } },
          article: { connect: { id: articleId } },
        },
      });
      return { created: true, message: '좋아요를 눌렀습니다.', data: newLike };
    }
  }
}
