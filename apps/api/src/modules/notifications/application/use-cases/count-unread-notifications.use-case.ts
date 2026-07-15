import { Inject, Injectable } from '@nestjs/common';

import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../../domain/repositories/notification.repository';
import type { UnreadNotificationCountDto } from '../dto/notification.dto';

@Injectable()
export class CountUnreadNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string): Promise<UnreadNotificationCountDto> {
    return {
      unreadCount: await this.notificationRepository.countUnreadByUserId(userId),
    };
  }
}
