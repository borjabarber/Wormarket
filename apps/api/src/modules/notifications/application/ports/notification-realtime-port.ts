import type { NotificationDto } from '../dto/notification.dto';

export const NOTIFICATION_REALTIME_PORT = Symbol('NOTIFICATION_REALTIME_PORT');

export interface NotificationRealtimePort {
  emitNotification(notification: NotificationDto): void;
}
