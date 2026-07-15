import type { ConversationSummary, ConversationUser } from './conversation-types';

export function formatConversationDate(value: string): string {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(new Date(value));
}

export function getOtherParticipant(
  conversation: ConversationSummary,
  currentUserId: string | undefined,
): ConversationUser {
  return conversation.buyer.id === currentUserId ? conversation.seller : conversation.buyer;
}

export function hasUnreadMessages(
  conversation: ConversationSummary,
  currentUserId: string | undefined,
): boolean {
  return Boolean(
    conversation.lastMessage &&
    conversation.lastMessage.sender.id !== currentUserId &&
    !conversation.lastMessage.readAt,
  );
}
