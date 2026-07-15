import type { Conversation } from '../../domain/entities/conversation';
import type { Message } from '../../domain/entities/message';
import type { ConversationDto, MessageDto } from '../dto/conversation.dto';

export class ConversationMapper {
  static toDto(conversation: Conversation): ConversationDto {
    return {
      id: conversation.id.toString(),
      listing: conversation.listing,
      buyer: conversation.buyer,
      seller: conversation.seller,
      lastMessage: conversation.lastMessage
        ? ConversationMapper.messageToDto(conversation.lastMessage)
        : null,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    };
  }

  static messageToDto(message: Message): MessageDto {
    return {
      id: message.id.toString(),
      conversationId: message.conversationId,
      sender: message.sender,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      readAt: message.readAt?.toISOString() ?? null,
    };
  }
}
