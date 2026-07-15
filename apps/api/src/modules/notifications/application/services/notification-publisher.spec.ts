import { describe, expect, it } from 'vitest';

import type { Notification } from '../../domain/entities/notification';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationPublisher } from './notification-publisher';

const notification = {
  id: {
    toString: () => 'notification-1',
  },
  userId: 'user-1',
  type: 'OFFER_RECEIVED',
  title: 'Nueva oferta recibida',
  message: 'Alguien ha ofertado por tu objeto.',
  linkPath: '/listings/brujula',
  readAt: null,
  createdAt: new Date('2026-07-09T12:00:00.000Z'),
} as Notification;

describe('NotificationPublisher', () => {
  it('persists and emits notifications', async () => {
    let emitted: unknown = null;
    const repository: NotificationRepository = {
      create: async () => notification,
      findByUserId: async () => [],
      countUnreadByUserId: async () => 0,
      markAsRead: async () => notification,
      markAllAsRead: async () => [],
    };
    const publisher = new NotificationPublisher(repository, {
      emitNotification: (payload) => {
        emitted = payload;
      },
    });

    await expect(
      publisher.publish({
        userId: 'user-1',
        type: 'OFFER_RECEIVED',
        title: 'Nueva oferta recibida',
        message: 'Alguien ha ofertado por tu objeto.',
        linkPath: '/listings/brujula',
      }),
    ).resolves.toMatchObject({
      id: 'notification-1',
      userId: 'user-1',
    });

    expect(emitted).toMatchObject({
      id: 'notification-1',
      type: 'OFFER_RECEIVED',
    });
  });
});
