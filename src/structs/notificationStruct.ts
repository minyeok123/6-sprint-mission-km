import * as s from 'superstruct';
import type { Infer } from 'superstruct';
import { PaginationQuery, NumberFromString } from './commonStruct';

export const GetNotificationsQuery = s.intersection([PaginationQuery]);
export type GetNotificationsQueryType = Infer<typeof GetNotificationsQuery>;

export const NotificationIdParams = s.object({
  notificationId: NumberFromString,
});
export type NotificationIdParamsType = Infer<typeof NotificationIdParams>;
