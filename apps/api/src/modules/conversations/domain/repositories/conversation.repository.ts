import type { Conversation } from '../entities/conversation';
import type { Message } from '../entities/message';

export const CONVERSATION_REPOSITORY = Symbol('CONVERSATION_REPOSITORY');

export type CreateConversationInput = {
  listingSlug: string;
  participantId: string;
};

export interface ConversationRepository {
  findById(id: string): Promise<Conversation | null>;
  findByParticipantId(userId: string): Promise<Conversation[]>;
  create(input: CreateConversationInput): Promise<Conversation>;
  findMessages(conversationId: string, participantId: string): Promise<Message[]>;
  sendMessage(conversationId: string, senderId: string, content: string): Promise<Message>;
  markMessagesAsRead(conversationId: string, readerId: string): Promise<Message[]>;
}
