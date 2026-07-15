import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  Inject,
  Param,
  Post,
} from '@nestjs/common';

import { IdentityError } from '../../identity/application/errors/identity-error';
import { TOKEN_SERVICE, type TokenService } from '../../identity/application/ports/token-service';
import type { ConversationDto, MessageDto } from '../application/dto/conversation.dto';
import type { CreateConversationDto } from '../application/dto/create-conversation.dto';
import type { SendMessageDto } from '../application/dto/send-message.dto';
import { ConversationError } from '../application/errors/conversation-error';
import { CreateConversationUseCase } from '../application/use-cases/create-conversation.use-case';
import { GetConversationUseCase } from '../application/use-cases/get-conversation.use-case';
import { ListMessagesUseCase } from '../application/use-cases/list-messages.use-case';
import { ListMyConversationsUseCase } from '../application/use-cases/list-my-conversations.use-case';
import { MarkMessagesAsReadUseCase } from '../application/use-cases/mark-messages-as-read.use-case';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';

@Controller('conversations')
export class ConversationsController {
  constructor(
    @Inject(CreateConversationUseCase)
    private readonly createConversationUseCase: CreateConversationUseCase,
    @Inject(ListMyConversationsUseCase)
    private readonly listMyConversationsUseCase: ListMyConversationsUseCase,
    @Inject(GetConversationUseCase)
    private readonly getConversationUseCase: GetConversationUseCase,
    @Inject(ListMessagesUseCase)
    private readonly listMessagesUseCase: ListMessagesUseCase,
    @Inject(SendMessageUseCase)
    private readonly sendMessageUseCase: SendMessageUseCase,
    @Inject(MarkMessagesAsReadUseCase)
    private readonly markMessagesAsReadUseCase: MarkMessagesAsReadUseCase,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  async listMyConversations(
    @Headers('authorization') authorization: string | undefined,
  ): Promise<ConversationDto[]> {
    return this.mapConversationErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.listMyConversationsUseCase.execute(user.sub);
    });
  }

  @Get(':conversationId')
  async getConversation(
    @Headers('authorization') authorization: string | undefined,
    @Param('conversationId') conversationId: string,
  ): Promise<ConversationDto> {
    return this.mapConversationErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.getConversationUseCase.execute(user.sub, conversationId);
    });
  }

  @Post()
  async createConversation(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: unknown,
  ): Promise<ConversationDto> {
    return this.mapConversationErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.createConversationUseCase.execute(
        user.sub,
        this.parseCreateConversationBody(body),
      );
    });
  }

  @Get(':conversationId/messages')
  async listMessages(
    @Headers('authorization') authorization: string | undefined,
    @Param('conversationId') conversationId: string,
  ): Promise<MessageDto[]> {
    return this.mapConversationErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.listMessagesUseCase.execute(user.sub, conversationId);
    });
  }

  @Post(':conversationId/messages')
  async sendMessage(
    @Headers('authorization') authorization: string | undefined,
    @Param('conversationId') conversationId: string,
    @Body() body: unknown,
  ): Promise<MessageDto> {
    return this.mapConversationErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.sendMessageUseCase.execute(
        user.sub,
        conversationId,
        this.parseSendMessageBody(body),
      );
    });
  }

  @Post(':conversationId/read')
  @HttpCode(200)
  async markMessagesAsRead(
    @Headers('authorization') authorization: string | undefined,
    @Param('conversationId') conversationId: string,
  ): Promise<MessageDto[]> {
    return this.mapConversationErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.markMessagesAsReadUseCase.execute(user.sub, conversationId);
    });
  }

  private parseCreateConversationBody(body: unknown): CreateConversationDto {
    if (!this.isRecord(body) || typeof body['listingSlug'] !== 'string') {
      throw this.invalidBodyError();
    }

    return {
      listingSlug: body['listingSlug'],
    };
  }

  private parseSendMessageBody(body: unknown): SendMessageDto {
    if (!this.isRecord(body) || typeof body['content'] !== 'string') {
      throw this.invalidBodyError();
    }

    return {
      content: body['content'],
    };
  }

  private parseBearerToken(authorization: string | undefined): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new ConversationError(
        'INVALID_AUTHORIZATION_HEADER',
        'La cabecera de autorizacion no es valida.',
        401,
      );
    }

    return authorization.slice('Bearer '.length).trim();
  }

  private async mapConversationErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof ConversationError) {
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
          },
          error.statusCode,
        );
      }

      if (error instanceof IdentityError) {
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
          },
          error.statusCode,
        );
      }

      throw error;
    }
  }

  private invalidBodyError(): ConversationError {
    return new ConversationError('INVALID_CONVERSATION_BODY', 'La solicitud no es valida.', 400);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }
}
