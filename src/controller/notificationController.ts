import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { NotificationRepository } from '../repository/notificationRepository';
import { NotificationService } from '../service/notificationService';
import { ValidatedParamsRequest } from '../middleware/validate';
import { GetNotificationsQueryType, NotificationIdParamsType } from '../structs/notificationStruct';

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);

export class NotificationController {
  // 알림 목록 조회
  static getNotifications = async (req: Request, res: Response) => {
    const query = req.query as GetNotificationsQueryType;
    const user = req.user as User;
    const notifications = await notificationService.getNotifications(user.id);
    res.status(200).send(notifications);
  };

  // 안 읽은 알림 개수 조회
  static getUnreadCount = async (req: Request, res: Response) => {
    const user = req.user as User;
    const count = await notificationService.getUnreadCount(user.id);
    res.status(200).send(count);
  };

  // 알림 읽음 처리
  static readNotification = async (req: Request, res: Response) => {
    const { notificationId } = (req as ValidatedParamsRequest<NotificationIdParamsType>)
      .validatedParams;
    const user = req.user as User;
    const notification = await notificationService.markAsRead(notificationId);
    res.status(200).send(notification);
  };
}
