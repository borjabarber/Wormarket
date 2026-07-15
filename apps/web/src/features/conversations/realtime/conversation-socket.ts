import { io, type Socket } from 'socket.io-client';

import { getApiBaseUrl } from '../../../shared/api/api-config';
import type { ConversationMessage } from '../model/conversation-types';

type ServerToClientEvents = {
  'message:read': (payload: { conversationId: string; readerId: string }) => void;
  'message:sent': (message: ConversationMessage) => void;
};

type ClientToServerEvents = {
  'conversation:join': (payload: { conversationId: string }) => void;
};

export type ConversationSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createConversationSocket(accessToken: string): ConversationSocket {
  return io(`${getApiBaseUrl()}/conversations`, {
    auth: {
      token: accessToken,
    },
    transports: ['websocket'],
  });
}
