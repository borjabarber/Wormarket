import { Inject, Injectable, Optional } from '@nestjs/common';

import type { NotificationType } from '../../domain/entities/notification';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../../domain/repositories/notification.repository';
import type { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';
import {
  NOTIFICATION_REALTIME_PORT,
  type NotificationRealtimePort,
} from '../ports/notification-realtime-port';

export type PublishNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkPath?: string | null;
};

@Injectable()
export class NotificationPublisher {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
    @Optional()
    @Inject(NOTIFICATION_REALTIME_PORT)
    private readonly notificationRealtimePort?: NotificationRealtimePort,
  ) {}

  async publish(input: PublishNotificationInput): Promise<NotificationDto> {
    const notification = await this.notificationRepository.create(input);
    const notificationDto = NotificationMapper.toDto(notification);

    this.notificationRealtimePort?.emitNotification(notificationDto);

    return notificationDto;
  }
}
