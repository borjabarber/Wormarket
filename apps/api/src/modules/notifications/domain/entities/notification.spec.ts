import { describe, expect, it } from 'vitest';

import { Notification } from './notification';

const input = {
  id: 'notification-1',
  userId: 'user-1',
  type: 'OFFER_RECEIVED' as const,
  title: '  Nueva oferta recibida  ',
  message: '  Alguien ha ofertado por tu objeto.  ',
  linkPath: '  /listings/brujula  ',
  readAt: null,
  createdAt: new Date('2026-07-09T12:00:00.000Z'),
};

describe('Notification', () => {
  it('creates valid notifications and normalizes text fields', () => {
    const notification = Notification.create(input);

    expect(notification.id.toString()).toBe('notification-1');
    expect(notification.title).toBe('Nueva oferta recibida');
    expect(notification.message).toBe('Alguien ha ofertado por tu objeto.');
    expect(notification.linkPath).toBe('/listings/brujula');
  });

  it('rejects empty titles', () => {
    expect(() =>
      Notification.create({
        ...input,
        title: ' ',
      }),
    ).toThrow('Notification title cannot be empty.');
  });

  it('rejects unsupported types', () => {
    expect(() =>
      Notification.create({
        ...input,
        type: 'UNKNOWN' as never,
      }),
    ).toThrow('Notification type is not supported.');
  });
});
