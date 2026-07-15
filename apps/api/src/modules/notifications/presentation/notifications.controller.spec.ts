import { HttpException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import type {
  AuthTokenPayload,
  TokenService,
} from '../../identity/application/ports/token-service';
import type { NotificationDto } from '../application/dto/notification.dto';
import { NotificationsController } from './notifications.controller';

const notification: NotificationDto = {
  id: 'notification-1',
  userId: 'user-1',
  type: 'OFFER_RECEIVED',
  title: 'Nueva oferta recibida',
  message: 'Alguien ha ofertado por tu objeto.',
  linkPath: '/listings/brujula',
  readAt: null,
  createdAt: '2026-07-09T12:00:00.000Z',
};

const tokenPayload: AuthTokenPayload = {
  sub: 'user-1',
  username: 'lyra-oraculo',
  role: 'USER',
  kind: 'access',
};

const tokenService: TokenService = {
  issueAccessToken: () => 'access-token',
  issueRefreshToken: () => 'refresh-token',
  verify: () => tokenPayload,
  hashRefreshToken: () => 'refresh-token-hash',
};

describe('NotificationsController', () => {
  it('lists notifications for the authenticated user', async () => {
    let receivedUserId: string | null = null;
    const controller = new NotificationsController(
      {
        execute: async (userId) => {
          receivedUserId = userId;
          return [notification];
        },
      },
      {
        execute: async () => ({ unreadCount: 1 }),
      },
      {
        execute: async () => notification,
      },
      {
        execute: async () => [notification],
      },
      tokenService,
    );

    await expect(controller.listMyNotifications('Bearer access-token')).resolves.toEqual([
      notification,
    ]);
    expect(receivedUserId).toBe('user-1');
  });

  it('marks notifications as read for the authenticated user', async () => {
    let received: { userId: string; notificationId: string } | null = null;
    const controller = new NotificationsController(
      {
        execute: async () => [],
      },
      {
        execute: async () => ({ unreadCount: 1 }),
      },
      {
        execute: async (userId, notificationId) => {
          received = { userId, notificationId };
          return {
            ...notification,
            readAt: '2026-07-09T12:30:00.000Z',
          };
        },
      },
      {
        execute: async () => [],
      },
      tokenService,
    );

    await expect(
      controller.markNotificationAsRead('Bearer access-token', 'notification-1'),
    ).resolves.toMatchObject({
      readAt: '2026-07-09T12:30:00.000Z',
    });
    expect(received).toEqual({
      userId: 'user-1',
      notificationId: 'notification-1',
    });
  });

  it('rejects requests without authorization', async () => {
    const controller = new NotificationsController(
      {
        execute: async () => [],
      },
      {
        execute: async () => ({ unreadCount: 0 }),
      },
      {
        execute: async () => notification,
      },
      {
        execute: async () => [],
      },
      tokenService,
    );

    await expect(controller.listMyNotifications(undefined)).rejects.toBeInstanceOf(HttpException);
  });
});
