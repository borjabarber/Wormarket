import { Inject, Injectable, Optional } from '@nestjs/common';

import { NotificationPublisher } from '../../../notifications/application/services/notification-publisher';
import {
  CONVERSATION_REPOSITORY,
  type ConversationRepository,
} from '../../domain/repositories/conversation.repository';
import type { MessageDto } from '../dto/conversation.dto';
import type { SendMessageDto } from '../dto/send-message.dto';
import { ConversationMapper } from '../mappers/conversation.mapper';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    @Optional()
    @Inject(NotificationPublisher)
    private readonly notificationPublisher?: NotificationPublisher,
  ) {}

  async execute(
    senderId: string,
    conversationId: string,
    input: SendMessageDto,
  ): Promise<MessageDto> {
    const message = await this.conversationRepository.sendMessage(
      conversationId,
      senderId,
      input.content,
    );
    const messageDto = ConversationMapper.messageToDto(message);
    const conversation = await this.conversationRepository.findById(conversationId);
    const recipient =
      conversation?.buyer.id === senderId ? conversation.seller : conversation?.buyer;

    if (recipient) {
      await this.notificationPublisher?.publish({
        userId: recipient.id,
        type: 'MESSAGE_RECEIVED',
        title: 'Nuevo mensaje',
        message: `${messageDto.sender.displayName} te ha enviado un mensaje sobre "${conversation?.listing.title}".`,
        linkPath: `/conversations/${conversationId}`,
      });
    }

    return messageDto;
  }
}
