import { prisma } from '../utils/prismaClient';
import { Prisma } from '@prisma/client';

export class NotificationRepository {
  async findMany(options: Prisma.NotificationFindManyArgs) {
    return prisma.notification.findMany(options);
  }
  async count(options: Prisma.NotificationCountArgs) {
    return prisma.notification.count(options);
  }
  async update(options: Prisma.NotificationUpdateArgs) {
    return prisma.notification.update(options);
  }
  async create(options: Prisma.NotificationCreateArgs) {
    return prisma.notification.create(options);
  }
  async findUniqueOrThrow<T extends Prisma.NotificationFindUniqueOrThrowArgs>(
    options: Prisma.SelectSubset<T, Prisma.NotificationFindUniqueOrThrowArgs>,
  ) {
    return prisma.notification.findUniqueOrThrow(options);
  }
}
