import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

import { getAllowedFrontendOrigins } from '../../../config/frontend-origins';
import { TOKEN_SERVICE, type TokenService } from '../../identity/application/ports/token-service';
import type { NotificationDto } from '../application/dto/notification.dto';
import { NotificationError } from '../application/errors/notification-error';
import type { NotificationRealtimePort } from '../application/ports/notification-realtime-port';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: getAllowedFrontendOrigins(),
  },
})
export class NotificationsGateway implements NotificationRealtimePort {
  @WebSocketServer()
  private server!: Server;

  constructor(@Inject(TOKEN_SERVICE) private readonly tokenService: TokenService) {}

  @SubscribeMessage('notifications:join')
  async joinNotifications(
    @ConnectedSocket() client: Socket,
  ): Promise<{ event: 'notifications:joined'; data: { userId: string } }> {
    return this.mapGatewayErrors(async () => {
      const user = this.tokenService.verify(this.parseClientToken(client), 'access');

      await client.join(this.userRoom(user.sub));

      return {
        event: 'notifications:joined',
        data: {
          userId: user.sub,
        },
      };
    });
  }

  emitNotification(notification: NotificationDto): void {
    this.server.to(this.userRoom(notification.userId)).emit('notification:new', notification);
  }

  private parseClientToken(client: Socket): string {
    const authToken = client.handshake.auth['token'];

    if (typeof authToken === 'string' && authToken.trim()) {
      return authToken.trim();
    }

    const authorization = client.handshake.headers['authorization'];

    if (typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
      return authorization.slice('Bearer '.length).trim();
    }

    throw new NotificationError(
      'INVALID_AUTHORIZATION_HEADER',
      'La cabecera de autorizacion no es valida.',
      401,
    );
  }

  private async mapGatewayErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof NotificationError) {
        throw new WsException({
          code: error.code,
          message: error.message,
        });
      }

      throw error;
    }
  }

  private userRoom(userId: string): string {
    return `user:${userId}`;
  }
}
