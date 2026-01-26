import { NotificationRepository } from '../repository/notificationRepository';
import { getIO } from '../socket';
import { NotificationType } from '@prisma/client';

export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async notifyPriceChange(userIds: number[], product: { id: number; productName: string }) {
    const io = getIO();
    for (const userId of userIds) {
      const notification = await this.notificationRepository.create({
        data: {
          userId,
          type: NotificationType.PRICE_CHANGE,
          message: `관심 상품 '${product.productName}'의 가격이 변동되었습니다.`,
          productId: product.id,
        },
      });
      io.to(String(userId)).emit('notification', { message: notification.message });
    }
  }

  async getNotifications(userId: number) {
    return this.notificationRepository.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(userId: number) {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(notificationId: number) {
    const notification = await this.notificationRepository.findUniqueOrThrow({
      where: { id: notificationId },
    });

    if (notification.isRead) {
      return notification;
    }

    return this.notificationRepository.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }
}
