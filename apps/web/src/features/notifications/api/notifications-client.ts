import { getApiBaseUrl } from '../../../shared/api/api-config';
import type { NotificationSummary, UnreadNotificationCount } from '../model/notification-types';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export class NotificationsApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'NotificationsApiError';
  }
}

async function parseError(response: Response): Promise<NotificationsApiError> {
  let body: ApiErrorResponse = {};

  try {
    body = (await response.json()) as ApiErrorResponse;
  } catch {
    body = {};
  }

  return new NotificationsApiError(
    body.code ?? 'UNKNOWN_API_ERROR',
    body.message ?? 'No se pudieron cargar las notificaciones.',
    response.status,
  );
}

async function request<TResponse>(
  path: string,
  accessToken: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${accessToken}`);

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new NotificationsApiError(
      'NETWORK_ERROR',
      'No se pudo conectar con la API local de Wormarket.',
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export const notificationsClient = {
  countUnread(accessToken: string): Promise<UnreadNotificationCount> {
    return request<UnreadNotificationCount>('/notifications/unread-count', accessToken);
  },
  list(accessToken: string): Promise<NotificationSummary[]> {
    return request<NotificationSummary[]>('/notifications', accessToken);
  },
  markAllAsRead(accessToken: string): Promise<NotificationSummary[]> {
    return request<NotificationSummary[]>('/notifications/read-all', accessToken, {
      method: 'POST',
    });
  },
  markAsRead(notificationId: string, accessToken: string): Promise<NotificationSummary> {
    return request<NotificationSummary>(
      `/notifications/${encodeURIComponent(notificationId)}/read`,
      accessToken,
      { method: 'POST' },
    );
  },
};
