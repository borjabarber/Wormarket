import { Inject, Injectable } from '@nestjs/common';

import {
  CONVERSATION_REPOSITORY,
  type ConversationRepository,
} from '../../domain/repositories/conversation.repository';
import type { MessageDto } from '../dto/conversation.dto';
import { ConversationMapper } from '../mappers/conversation.mapper';

@Injectable()
export class ListMessagesUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(participantId: string, conversationId: string): Promise<MessageDto[]> {
    const messages = await this.conversationRepository.findMessages(conversationId, participantId);

    return messages.map((message) => ConversationMapper.messageToDto(message));
  }
}
