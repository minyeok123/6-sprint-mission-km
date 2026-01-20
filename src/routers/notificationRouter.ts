import express from 'express';
import { validate } from '../middleware/validate';
import {
  GetNotificationsQuery,
  NotificationIdParams,
} from '../structs/notificationStruct';
import { tryCatchHandler } from '../middleware/errorhandler';
import { NotificationController } from '../controller/notificationController';
import { authenticate } from '../middleware/authenticate';

const notificationRouter = express.Router();

notificationRouter.use(authenticate);

notificationRouter
  .route('/')
  .get(
    validate(GetNotificationsQuery, 'query'),
    tryCatchHandler(NotificationController.getNotifications),
  );

notificationRouter.get(
  '/unread-count',
  tryCatchHandler(NotificationController.getUnreadCount),
);

notificationRouter.patch(
  '/:notificationId/read',
  validate(NotificationIdParams, 'params'),
  tryCatchHandler(NotificationController.readNotification),
);

export default notificationRouter;
