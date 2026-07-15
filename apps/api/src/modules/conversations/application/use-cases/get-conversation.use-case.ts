import { Inject, Injectable } from '@nestjs/common';

import {
  CONVERSATION_REPOSITORY,
  type ConversationRepository,
} from '../../domain/repositories/conversation.repository';
import type { ConversationDto } from '../dto/conversation.dto';
import { ConversationError } from '../errors/conversation-error';
import { ConversationMapper } from '../mappers/conversation.mapper';

@Injectable()
export class GetConversationUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(userId: string, conversationId: string): Promise<ConversationDto> {
    const conversation = await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new ConversationError('CONVERSATION_NOT_FOUND', 'La conversacion no existe.', 404);
    }

    if (!conversation.canBeAccessedBy(userId)) {
      throw new ConversationError(
        'CONVERSATION_NOT_ACCESSIBLE',
        'No puedes acceder a esta conversacion.',
        403,
      );
    }

    return ConversationMapper.toDto(conversation);
  }
}
