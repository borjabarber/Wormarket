import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

import { getAllowedFrontendOrigins } from '../../../config/frontend-origins';
import { TOKEN_SERVICE, type TokenService } from '../../identity/application/ports/token-service';
import { ConversationError } from '../application/errors/conversation-error';
import { GetConversationUseCase } from '../application/use-cases/get-conversation.use-case';
import { MarkMessagesAsReadUseCase } from '../application/use-cases/mark-messages-as-read.use-case';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';

@WebSocketGateway({
  namespace: 'conversations',
  cors: {
    origin: getAllowedFrontendOrigins(),
  },
})
export class ConversationsGateway {
  @WebSocketServer()
  private server!: Server;

  constructor(
    @Inject(GetConversationUseCase)
    private readonly getConversationUseCase: GetConversationUseCase,
    @Inject(SendMessageUseCase)
    private readonly sendMessageUseCase: SendMessageUseCase,
    @Inject(MarkMessagesAsReadUseCase)
    private readonly markMessagesAsReadUseCase: MarkMessagesAsReadUseCase,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  @SubscribeMessage('conversation:join')
  async joinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown,
  ): Promise<{ event: 'conversation:joined'; data: unknown }> {
    return this.mapGatewayErrors(async () => {
      const user = this.tokenService.verify(this.parseClientToken(client), 'access');
      const conversationId = this.parseConversationId(body);
      const conversation = await this.getConversationUseCase.execute(user.sub, conversationId);

      await client.join(this.conversationRoom(conversationId));

      return {
        event: 'conversation:joined',
        data: conversation,
      };
    });
  }

  @SubscribeMessage('message:send')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown,
  ): Promise<{ event: 'message:sent'; data: unknown }> {
    return this.mapGatewayErrors(async () => {
      const user = this.tokenService.verify(this.parseClientToken(client), 'access');
      const payload = this.parseSendMessageBody(body);
      const message = await this.sendMessageUseCase.execute(user.sub, payload.conversationId, {
        content: payload.content,
      });

      this.server.to(this.conversationRoom(payload.conversationId)).emit('message:sent', message);

      return {
        event: 'message:sent',
        data: message,
      };
    });
  }

  @SubscribeMessage('message:read')
  async markMessagesAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown,
  ): Promise<{ event: 'message:read'; data: unknown }> {
    return this.mapGatewayErrors(async () => {
      const user = this.tokenService.verify(this.parseClientToken(client), 'access');
      const conversationId = this.parseConversationId(body);
      const messages = await this.markMessagesAsReadUseCase.execute(user.sub, conversationId);

      this.server.to(this.conversationRoom(conversationId)).emit('message:read', {
        conversationId,
        readerId: user.sub,
      });

      return {
        event: 'message:read',
        data: messages,
      };
    });
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

    throw new ConversationError(
      'INVALID_AUTHORIZATION_HEADER',
      'La cabecera de autorizacion no es valida.',
      401,
    );
  }

  private parseConversationId(body: unknown): string {
    if (!this.isRecord(body) || typeof body['conversationId'] !== 'string') {
      throw new ConversationError('INVALID_CONVERSATION_BODY', 'La solicitud no es valida.', 400);
    }

    return body['conversationId'];
  }

  private parseSendMessageBody(body: unknown): { conversationId: string; content: string } {
    if (
      !this.isRecord(body) ||
      typeof body['conversationId'] !== 'string' ||
      typeof body['content'] !== 'string'
    ) {
      throw new ConversationError('INVALID_CONVERSATION_BODY', 'La solicitud no es valida.', 400);
    }

    return {
      conversationId: body['conversationId'],
      content: body['content'],
    };
  }

  private async mapGatewayErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof ConversationError) {
        throw new WsException({
          code: error.code,
          message: error.message,
        });
      }

      throw error;
    }
  }

  private conversationRoom(conversationId: string): string {
    return `conversation:${conversationId}`;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }
}
