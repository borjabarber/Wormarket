import type { NotificationType } from '../../domain/entities/notification';

export type NotificationDto = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkPath: string | null;
  readAt: string | null;
  createdAt: string;
};

export type UnreadNotificationCountDto = {
  unreadCount: number;
};
