import { io, type Socket } from 'socket.io-client';

import { getApiBaseUrl } from '../../../shared/api/api-config';
import type { NotificationSummary } from '../model/notification-types';

type ServerToClientEvents = {
  'notification:new': (notification: NotificationSummary) => void;
};

type ClientToServerEvents = {
  'notifications:join': () => void;
};

export type NotificationSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createNotificationSocket(accessToken: string): NotificationSocket {
  return io(`${getApiBaseUrl()}/notifications`, {
    auth: {
      token: accessToken,
    },
    transports: ['websocket'],
  });
}
