import type { Notification, NotificationType } from '../entities/notification';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkPath?: string | null;
};

export interface NotificationRepository {
  create(input: CreateNotificationInput): Promise<Notification>;
  findByUserId(userId: string): Promise<Notification[]>;
  countUnreadByUserId(userId: string): Promise<number>;
  markAsRead(notificationId: string, userId: string): Promise<Notification>;
  markAllAsRead(userId: string): Promise<Notification[]>;
}
