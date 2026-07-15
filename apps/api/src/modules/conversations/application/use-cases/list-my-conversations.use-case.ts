import { Inject, Injectable } from '@nestjs/common';

import {
  CONVERSATION_REPOSITORY,
  type ConversationRepository,
} from '../../domain/repositories/conversation.repository';
import type { ConversationDto } from '../dto/conversation.dto';
import { ConversationMapper } from '../mappers/conversation.mapper';

@Injectable()
export class ListMyConversationsUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(userId: string): Promise<ConversationDto[]> {
    const conversations = await this.conversationRepository.findByParticipantId(userId);

    return conversations.map((conversation) => ConversationMapper.toDto(conversation));
  }
}
