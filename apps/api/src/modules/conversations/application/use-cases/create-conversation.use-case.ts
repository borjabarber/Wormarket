import { Inject, Injectable } from '@nestjs/common';

import {
  CONVERSATION_REPOSITORY,
  type ConversationRepository,
} from '../../domain/repositories/conversation.repository';
import type { ConversationDto } from '../dto/conversation.dto';
import type { CreateConversationDto } from '../dto/create-conversation.dto';
import { ConversationMapper } from '../mappers/conversation.mapper';

@Injectable()
export class CreateConversationUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(participantId: string, input: CreateConversationDto): Promise<ConversationDto> {
    const conversation = await this.conversationRepository.create({
      listingSlug: input.listingSlug,
      participantId,
    });

    return ConversationMapper.toDto(conversation);
  }
}
