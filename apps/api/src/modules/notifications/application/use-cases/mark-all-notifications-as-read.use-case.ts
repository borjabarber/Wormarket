import { Inject, Injectable } from '@nestjs/common';

import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../../domain/repositories/notification.repository';
import type { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';

@Injectable()
export class MarkAllNotificationsAsReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string): Promise<NotificationDto[]> {
    const notifications = await this.notificationRepository.markAllAsRead(userId);

    return notifications.map((notification) => NotificationMapper.toDto(notification));
  }
}
