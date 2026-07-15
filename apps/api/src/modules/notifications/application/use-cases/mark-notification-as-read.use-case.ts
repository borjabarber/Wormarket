import { Inject, Injectable } from '@nestjs/common';

import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../../domain/repositories/notification.repository';
import type { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string, notificationId: string): Promise<NotificationDto> {
    const notification = await this.notificationRepository.markAsRead(notificationId, userId);

    return NotificationMapper.toDto(notification);
  }
}
