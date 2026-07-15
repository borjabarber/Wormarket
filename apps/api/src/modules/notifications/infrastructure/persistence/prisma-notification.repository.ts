import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { NotificationError } from '../../application/errors/notification-error';
import type { Notification } from '../../domain/entities/notification';
import type {
  CreateNotificationInput,
  NotificationRepository,
} from '../../domain/repositories/notification.repository';
import { PrismaNotificationMapper } from './prisma-notification.mapper';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    const normalizedTitle = input.title.trim();
    const normalizedMessage = input.message.trim();
    const normalizedLinkPath = input.linkPath?.trim() || null;

    if (!normalizedTitle) {
      throw new NotificationError(
        'INVALID_NOTIFICATION_TITLE',
        'El titulo de la notificacion es obligatorio.',
        400,
      );
    }

    if (!normalizedMessage) {
      throw new NotificationError(
        'INVALID_NOTIFICATION_MESSAGE',
        'El mensaje de la notificacion es obligatorio.',
        400,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotificationError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: normalizedTitle,
        message: normalizedMessage,
        linkPath: normalizedLinkPath,
      },
    });

    return PrismaNotificationMapper.toDomain(notification);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    await this.ensureUserExists(userId);

    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications.map((notification) => PrismaNotificationMapper.toDomain(notification));
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    await this.ensureUserExists(userId);

    return this.prisma.notification.count({
      where: {
        userId,
        readAt: null,
      },
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const existingNotification = await this.prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
      select: {
        id: true,
        userId: true,
        readAt: true,
      },
    });

    if (!existingNotification) {
      throw new NotificationError('NOTIFICATION_NOT_FOUND', 'La notificacion no existe.', 404);
    }

    if (existingNotification.userId !== userId) {
      throw new NotificationError(
        'NOTIFICATION_NOT_ACCESSIBLE',
        'No puedes acceder a esta notificacion.',
        403,
      );
    }

    const notification = await this.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        readAt: existingNotification.readAt ?? new Date(),
      },
    });

    return PrismaNotificationMapper.toDomain(notification);
  }

  async markAllAsRead(userId: string): Promise<Notification[]> {
    await this.ensureUserExists(userId);

    await this.prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return this.findByUserId(userId);
  }

  private async ensureUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotificationError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }
  }
}
