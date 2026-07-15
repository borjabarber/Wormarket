import { describe, expect, it } from 'vitest';

import type { Conversation } from '../../domain/entities/conversation';
import type { Message } from '../../domain/entities/message';
import type { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { SendMessageUseCase } from './send-message.use-case';

const message = {
  id: {
    toString: () => 'message-1',
  },
  conversationId: 'conversation-1',
  sender: {
    id: 'buyer-1',
    username: 'nadir-cronal',
    displayName: 'Nadir Cronal',
  },
  content: 'Mensaje de prueba',
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  readAt: null,
} as Message;

describe('SendMessageUseCase', () => {
  it('sends a message using the authenticated sender id', async () => {
    let received: unknown = null;
    const repository: ConversationRepository = {
      findById: async () => null,
      findByParticipantId: async () => [],
      create: async () => ({}) as Conversation,
      findMessages: async () => [],
      sendMessage: async (conversationId, senderId, content) => {
        received = { conversationId, senderId, content };
        return message;
      },
      markMessagesAsRead: async () => [],
    };
    const useCase = new SendMessageUseCase(repository);

    await expect(
      useCase.execute('buyer-1', 'conversation-1', {
        content: 'Mensaje de prueba',
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'message-1',
        conversationId: 'conversation-1',
        content: 'Mensaje de prueba',
      }),
    );
    expect(received).toEqual({
      conversationId: 'conversation-1',
      senderId: 'buyer-1',
      content: 'Mensaje de prueba',
    });
  });
});
