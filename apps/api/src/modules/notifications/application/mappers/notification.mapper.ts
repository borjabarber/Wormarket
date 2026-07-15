import type { Notification } from '../../domain/entities/notification';
import type { NotificationDto } from '../dto/notification.dto';

export class NotificationMapper {
  static toDto(notification: Notification): NotificationDto {
    return {
      id: notification.id.toString(),
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      linkPath: notification.linkPath,
      readAt: notification.readAt?.toISOString() ?? null,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
