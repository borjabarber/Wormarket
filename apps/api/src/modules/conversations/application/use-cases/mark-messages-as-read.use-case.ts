import { Inject, Injectable } from '@nestjs/common';

import {
  CONVERSATION_REPOSITORY,
  type ConversationRepository,
} from '../../domain/repositories/conversation.repository';
import type { MessageDto } from '../dto/conversation.dto';
import { ConversationMapper } from '../mappers/conversation.mapper';

@Injectable()
export class MarkMessagesAsReadUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(readerId: string, conversationId: string): Promise<MessageDto[]> {
    const messages = await this.conversationRepository.markMessagesAsRead(conversationId, readerId);

    return messages.map((message) => ConversationMapper.messageToDto(message));
  }
}
