'use client';

import { useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button, EmptyState, Skeleton } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { notificationsClient } from '../api/notifications-client';
import { formatNotificationDate, notificationTypeLabels } from '../model/notification-formatters';
import type { NotificationSummary, UnreadNotificationCount } from '../model/notification-types';
import { createNotificationSocket } from '../realtime/notification-socket';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudieron cargar tus notificaciones.';
}

function upsertNotification(
  notifications: NotificationSummary[] | undefined,
  notification: NotificationSummary,
): NotificationSummary[] {
  const currentNotifications = notifications ?? [];

  if (
    currentNotifications.some((currentNotification) => currentNotification.id === notification.id)
  ) {
    return currentNotifications.map((currentNotification) =>
      currentNotification.id === notification.id ? notification : currentNotification,
    );
  }

  return [notification, ...currentNotifications];
}

function NotificationItem({
  isBusy,
  notification,
  onMarkAsRead,
}: {
  isBusy: boolean;
  notification: NotificationSummary;
  onMarkAsRead: (notificationId: string) => void;
}) {
  const isUnread = notification.readAt === null;

  return (
    <li className={isUnread ? 'notification-item notification-item-unread' : 'notification-item'}>
      <article aria-label={notification.title}>
        <div className="notification-item-header">
          <div>
            <p className="notification-type">{notificationTypeLabels[notification.type]}</p>
            <h2>{notification.title}</h2>
          </div>
          <span className="listing-status-badge">{isUnread ? 'Sin leer' : 'Leida'}</span>
        </div>
        <p>{notification.message}</p>
        <p className="notification-meta">{formatNotificationDate(notification.createdAt)}</p>
        <div className="notification-actions">
          {notification.linkPath ? (
            <Button href={notification.linkPath} size="sm" variant="secondary">
              Abrir enlace
            </Button>
          ) : null}
          {isUnread ? (
            <Button
              disabled={isBusy}
              onClick={() => onMarkAsRead(notification.id)}
              size="sm"
              variant="ghost"
            >
              Marcar como leida
            </Button>
          ) : null}
        </div>
      </article>
    </li>
  );
}

export function NotificationsPage() {
  const { session } = useAuth();
  const accessToken = session?.accessToken;
  const queryClient = useQueryClient();
  const userId = session?.user.id;
  const notificationListQueryKey = useMemo(
    () => ['notifications', userId, 'list'] as const,
    [userId],
  );
  const unreadCountQueryKey = useMemo(
    () => ['notifications', userId, 'unread-count'] as const,
    [userId],
  );

  const notificationsQuery = useQuery({
    enabled: Boolean(accessToken),
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      return notificationsClient.list(accessToken);
    },
    queryKey: notificationListQueryKey,
  });

  const unreadCountQuery = useQuery({
    enabled: Boolean(accessToken),
    queryFn: async () => {
      if (!accessToken) {
        return { unreadCount: 0 };
      }

      return notificationsClient.countUnread(accessToken);
    },
    queryKey: unreadCountQueryKey,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return notificationsClient.markAsRead(notificationId, accessToken);
    },
    onSuccess: async (notification) => {
      queryClient.setQueryData<NotificationSummary[]>(notificationListQueryKey, (notifications) =>
        upsertNotification(notifications, notification),
      );
      await queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return notificationsClient.markAllAsRead(accessToken);
    },
    onSuccess: async (notifications) => {
      queryClient.setQueryData<NotificationSummary[]>(notificationListQueryKey, notifications);
      queryClient.setQueryData<UnreadNotificationCount>(unreadCountQueryKey, {
        unreadCount: 0,
      });
      await queryClient.invalidateQueries({ queryKey: notificationListQueryKey });
    },
  });

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const socket = createNotificationSocket(accessToken);

    socket.emit('notifications:join');
    socket.on('notification:new', (notification) => {
      queryClient.setQueryData<NotificationSummary[]>(notificationListQueryKey, (notifications) =>
        upsertNotification(notifications, notification),
      );
      if (notification.readAt === null) {
        queryClient.setQueryData<UnreadNotificationCount>(unreadCountQueryKey, (currentCount) => ({
          unreadCount: (currentCount?.unreadCount ?? 0) + 1,
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, notificationListQueryKey, queryClient, unreadCountQueryKey]);

  if (!accessToken) {
    return (
      <section className="notifications-page" aria-labelledby="notifications-title">
        <div className="notifications-intro">
          <p className="eyebrow">Area personal</p>
          <h1 id="notifications-title">Notificaciones</h1>
        </div>
        <EmptyState
          action={{ children: 'Iniciar sesion', href: '/auth', variant: 'secondary' }}
          title="Necesitas una identidad dimensional"
        >
          Inicia sesion para revisar ofertas, mensajes, transacciones y valoraciones recientes.
        </EmptyState>
      </section>
    );
  }

  if (notificationsQuery.isPending || unreadCountQuery.isPending) {
    return (
      <section className="notifications-page" aria-busy="true" aria-label="Cargando notificaciones">
        <Skeleton label="Cargando notificaciones" />
        <Skeleton />
      </section>
    );
  }

  if (notificationsQuery.isError || unreadCountQuery.isError) {
    const error = notificationsQuery.error ?? unreadCountQuery.error;

    return (
      <section className="notifications-page">
        <div className="explorer-error" role="alert">
          <h1>No se pudieron abrir tus notificaciones</h1>
          <p>{getErrorMessage(error)}</p>
          <button
            className="wm-button wm-button-secondary"
            onClick={() => {
              void notificationsQuery.refetch();
              void unreadCountQuery.refetch();
            }}
          >
            Reintentar carga
          </button>
        </div>
      </section>
    );
  }

  const notifications = notificationsQuery.data;
  const unreadCount = unreadCountQuery.data.unreadCount;
  const hasUnreadNotifications = unreadCount > 0;

  return (
    <section className="notifications-page" aria-labelledby="notifications-title">
      <div className="notifications-intro">
        <p className="eyebrow">Area personal</p>
        <h1 id="notifications-title">Notificaciones</h1>
        <p>
          Revisa actividad reciente del mercado: ofertas, mensajes, transacciones y valoraciones que
          requieren tu atencion.
        </p>
      </div>

      <div className="notifications-toolbar">
        <p className="explorer-count" aria-live="polite">
          {unreadCount === 1 ? '1 notificacion sin leer' : `${unreadCount} notificaciones sin leer`}
        </p>
        <Button
          disabled={!hasUnreadNotifications || markAllAsReadMutation.isPending}
          onClick={() => markAllAsReadMutation.mutate()}
          variant="secondary"
        >
          Marcar todas como leidas
        </Button>
      </div>

      {markAsReadMutation.isError || markAllAsReadMutation.isError ? (
        <p className="auth-error" role="alert">
          No se pudieron actualizar las notificaciones.
        </p>
      ) : null}

      {notifications.length > 0 ? (
        <ol className="notification-list" aria-label="Notificaciones">
          {notifications.map((notification) => (
            <NotificationItem
              isBusy={markAsReadMutation.isPending || markAllAsReadMutation.isPending}
              key={notification.id}
              notification={notification}
              onMarkAsRead={(notificationId) => markAsReadMutation.mutate(notificationId)}
            />
          ))}
        </ol>
      ) : (
        <EmptyState title="No hay notificaciones">
          Cuando recibas ofertas, mensajes o valoraciones, apareceran aqui sin tener que perseguir
          ecos por todo el mercado.
        </EmptyState>
      )}
    </section>
  );
}
