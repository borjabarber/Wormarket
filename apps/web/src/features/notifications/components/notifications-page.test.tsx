import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { NotificationSummary } from '../model/notification-types';
import { NotificationsPage } from './notifications-page';

const socketDisconnectMock = vi.fn();
const socketEmitMock = vi.fn();
const socketOnMock = vi.fn();
const socketHandlers: Partial<
  Record<'notification:new', (notification: NotificationSummary) => void>
> = {};

vi.mock('../realtime/notification-socket', () => ({
  createNotificationSocket: () => ({
    disconnect: socketDisconnectMock,
    emit: socketEmitMock,
    on: socketOnMock,
  }),
}));

const userSession = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    displayName: 'Lyra del Oraculo',
    id: 'user-1',
    role: 'USER' as const,
    username: 'lyra-oraculo',
  },
};

const unreadNotification: NotificationSummary = {
  createdAt: '2026-07-14T10:00:00.000Z',
  id: 'notification-1',
  linkPath: '/offers',
  message: 'Nadir Cronal ha enviado una oferta por tu brujula.',
  readAt: null,
  title: 'Nueva oferta recibida',
  type: 'OFFER_RECEIVED',
  userId: userSession.user.id,
};

const readNotification: NotificationSummary = {
  createdAt: '2026-07-14T11:00:00.000Z',
  id: 'notification-2',
  linkPath: '/users/lyra-oraculo/reviews',
  message: 'Has recibido una valoracion nueva.',
  readAt: '2026-07-14T11:05:00.000Z',
  title: 'Nueva valoracion recibida',
  type: 'REVIEW_RECEIVED',
  userId: userSession.user.id,
};

const realtimeNotification: NotificationSummary = {
  createdAt: '2026-07-14T12:00:00.000Z',
  id: 'notification-3',
  linkPath: '/conversations/conversation-1',
  message: 'Io Horizonte ha escrito un mensaje nuevo.',
  readAt: null,
  title: 'Mensaje recibido',
  type: 'MESSAGE_RECEIVED',
  userId: userSession.user.id,
};

function renderNotificationsPage() {
  return render(
    <AppProviders>
      <NotificationsPage />
    </AppProviders>,
  );
}

describe('NotificationsPage', () => {
  beforeEach(() => {
    socketDisconnectMock.mockClear();
    socketEmitMock.mockClear();
    socketOnMock.mockClear();
    Object.keys(socketHandlers).forEach((key) => {
      delete socketHandlers[key as keyof typeof socketHandlers];
    });
    socketOnMock.mockImplementation(
      (event: 'notification:new', handler: (notification: NotificationSummary) => void) => {
        socketHandlers[event] = handler;
      },
    );
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks for authentication before listing notifications', () => {
    renderNotificationsPage();

    expect(screen.getByText('Necesitas una identidad dimensional')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Iniciar sesion' })).toBeTruthy();
  });

  it('lists notifications and marks one as read', async () => {
    storeSession(userSession);
    let notifications = [unreadNotification, readNotification];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/notifications/unread-count')) {
        return Response.json({
          unreadCount: notifications.filter((notification) => notification.readAt === null).length,
        });
      }

      if (url.endsWith('/notifications') && init?.method !== 'POST') {
        return Response.json(notifications);
      }

      if (url.endsWith('/notifications/notification-1/read') && init?.method === 'POST') {
        const updatedNotification = {
          ...unreadNotification,
          readAt: '2026-07-14T10:05:00.000Z',
        };
        notifications = [updatedNotification, readNotification];
        return Response.json(updatedNotification);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderNotificationsPage();

    expect(await screen.findByText('Nueva oferta recibida')).toBeTruthy();
    expect(screen.getByText('Nueva valoracion recibida')).toBeTruthy();
    expect(screen.getByText('1 notificacion sin leer')).toBeTruthy();
    expect(socketEmitMock).toHaveBeenCalledWith('notifications:join');

    await user.click(screen.getByRole('button', { name: 'Marcar como leida' }));

    await waitFor(() => {
      expect(screen.getByText('0 notificaciones sin leer')).toBeTruthy();
    });
    expect(
      fetchMock.mock.calls.some(([url, init]) => {
        const headers = new Headers(init?.headers);

        return (
          String(url).endsWith('/notifications/notification-1/read') &&
          init?.method === 'POST' &&
          headers.get('Authorization') === 'Bearer access-token'
        );
      }),
    ).toBe(true);
  });

  it('marks every notification as read', async () => {
    storeSession(userSession);
    let notifications = [unreadNotification, { ...readNotification, readAt: null }];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/notifications/unread-count')) {
        return Response.json({
          unreadCount: notifications.filter((notification) => notification.readAt === null).length,
        });
      }

      if (url.endsWith('/notifications') && init?.method !== 'POST') {
        return Response.json(notifications);
      }

      if (url.endsWith('/notifications/read-all') && init?.method === 'POST') {
        notifications = notifications.map((notification) => ({
          ...notification,
          readAt: notification.readAt ?? '2026-07-14T12:05:00.000Z',
        }));
        return Response.json(notifications);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderNotificationsPage();

    expect(await screen.findByText('2 notificaciones sin leer')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Marcar todas como leidas' }));

    await waitFor(() => {
      expect(screen.getByText('0 notificaciones sin leer')).toBeTruthy();
    });
    expect(
      fetchMock.mock.calls.some(([url, init]) => {
        const headers = new Headers(init?.headers);

        return (
          String(url).endsWith('/notifications/read-all') &&
          init?.method === 'POST' &&
          headers.get('Authorization') === 'Bearer access-token'
        );
      }),
    ).toBe(true);
  });

  it('adds realtime notifications from the socket', async () => {
    storeSession(userSession);
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.endsWith('/identity/me')) {
          return Response.json({ user: userSession.user });
        }

        if (url.endsWith('/notifications/unread-count')) {
          return Response.json({ unreadCount: 0 });
        }

        if (url.endsWith('/notifications')) {
          return Response.json([]);
        }

        return Response.json(
          { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
          { status: 404 },
        );
      }),
    );

    renderNotificationsPage();

    expect(await screen.findByText('No hay notificaciones')).toBeTruthy();

    await act(async () => {
      socketHandlers['notification:new']?.(realtimeNotification);
    });

    expect(await screen.findByText('Mensaje recibido')).toBeTruthy();
    expect(screen.getByText('1 notificacion sin leer')).toBeTruthy();
  });
});
