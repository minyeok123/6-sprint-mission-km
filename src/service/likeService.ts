import { number } from 'superstruct';
import { LikeRepository } from '../repository/likeRepository';
import { Prisma, User } from '@prisma/client';

export class LikeService {
  constructor(private likeRepository: LikeRepository) {}

  private async toggleLike(
    findOptions: Prisma.LikeFindFirstArgs,
    createOptions: Prisma.LikeCreateArgs,
  ) {
    const existingLike = await this.likeRepository.findFirst(findOptions);

    if (existingLike) {
      await this.likeRepository.delete({ where: { id: existingLike.id } });
      return { created: false, message: '좋아요가 취소되었습니다.' };
    } else {
      const newLike = await this.likeRepository.create(createOptions);
      return { created: true, message: '좋아요를 눌렀습니다.', data: newLike };
    }
  }

  async toggleProductLike(id: number, user: User) {
    const productId = id;
    const userId = user.id;
    const findOptions = { where: { id: productId } };
    const createOptions = {
      data: {
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
      },
    };
    return this.toggleLike(findOptions, createOptions);
  }
  async toggleArticleLike(id: number, user: User) {
    const articleId = id;
    const userId = user.id;
    const findOptions = { where: { id: articleId } };
    const createOptions = {
      data: {
        user: { connect: { id: userId } },
        article: { connect: { id: articleId } },
      },
    };
    return this.toggleLike(findOptions, createOptions);
  }
}
