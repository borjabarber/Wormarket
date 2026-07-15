import { Module } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TOKEN_SERVICE } from '../identity/application/ports/token-service';
import { HmacTokenService } from '../identity/infrastructure/crypto/hmac-token.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { CreateConversationUseCase } from './application/use-cases/create-conversation.use-case';
import { GetConversationUseCase } from './application/use-cases/get-conversation.use-case';
import { ListMessagesUseCase } from './application/use-cases/list-messages.use-case';
import { ListMyConversationsUseCase } from './application/use-cases/list-my-conversations.use-case';
import { MarkMessagesAsReadUseCase } from './application/use-cases/mark-messages-as-read.use-case';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { CONVERSATION_REPOSITORY } from './domain/repositories/conversation.repository';
import { PrismaConversationRepository } from './infrastructure/persistence/prisma-conversation.repository';
import { ConversationsController } from './presentation/conversations.controller';
import { ConversationsGateway } from './presentation/conversations.gateway';

@Module({
  imports: [NotificationsModule],
  controllers: [ConversationsController],
  providers: [
    PrismaService,
    CreateConversationUseCase,
    ListMyConversationsUseCase,
    GetConversationUseCase,
    ListMessagesUseCase,
    SendMessageUseCase,
    MarkMessagesAsReadUseCase,
    ConversationsGateway,
    {
      provide: CONVERSATION_REPOSITORY,
      useClass: PrismaConversationRepository,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: HmacTokenService,
    },
  ],
})
export class ConversationsModule {}
