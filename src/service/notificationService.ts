import { User } from '@prisma/client';
import { NotificationRepository } from '../repository/notificationRepository';
import type { GetNotificationsQueryType } from '../structs/notificationStruct';
import { HttpError } from '../utils/errors';
import { Prisma } from '@prisma/client';

export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async getNotifications(query: GetNotificationsQueryType, user: User) {
    const { page = 1, limit = 10 } = query;
    const userId = user.id;

    return this.notificationRepository.findMany({ where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        message: true,
        isRead: true,
        type: true,
        createdAt: true,
        productId: true,
        articleId: true,
      },});
  }

  async getUnreadCount(user: User) {
    const userId = user.id;
    const count = await this.notificationRepository.count({
      where: { userId: userId, isRead: false },
    });
    return { count };
  }

  async readNotification(notificationId: number, user: User) {
    const userId = user.id;

    const notification = await this.notificationRepository.findUniqueOrThrow({
      where: { id: notificationId },
      select: { userId: true },
    });

    if (notification.userId !== userId) {
      throw new HttpError(403, '알림을 읽을 권한이 없습니다.');
    }

    return this.notificationRepository.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }
}
