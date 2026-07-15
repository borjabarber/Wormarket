import type { Notification as PrismaNotification } from '../../../../generated/prisma/client';
import { Notification } from '../../domain/entities/notification';

export class PrismaNotificationMapper {
  static toDomain(record: PrismaNotification): Notification {
    return Notification.create({
      id: record.id,
      userId: record.userId,
      type: record.type,
      title: record.title,
      message: record.message,
      linkPath: record.linkPath,
      readAt: record.readAt,
      createdAt: record.createdAt,
    });
  }
}
