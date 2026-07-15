import { describe, expect, it } from 'vitest';

import { Conversation } from './conversation';
import { Message } from './message';

const message = Message.create({
  id: 'message-1',
  conversationId: 'conversation-1',
  sender: {
    id: 'buyer-1',
    username: 'nadir-cronal',
    displayName: 'Nadir Cronal',
  },
  content: '¿Sigue apuntando hacia decisiones no tomadas?',
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  readAt: null,
});

const conversationInput = {
  id: 'conversation-1',
  listing: {
    id: 'listing-1',
    slug: 'brujula-de-decisiones-no-tomadas',
    seller: {
      id: 'seller-1',
      username: 'lyra-oraculo',
      displayName: 'Lyra del Oraculo',
    },
    dimension: {
      id: 'dimension-1',
      slug: 'oraculo-norte',
      name: 'Oraculo Norte',
    },
    title: 'Brujula de decisiones no tomadas',
    price: {
      amount: 180,
      currencyCode: 'AUR',
    },
    rarity: 'RARE' as const,
    status: 'PUBLISHED' as const,
  },
  buyer: {
    id: 'buyer-1',
    username: 'nadir-cronal',
    displayName: 'Nadir Cronal',
  },
  seller: {
    id: 'seller-1',
    username: 'lyra-oraculo',
    displayName: 'Lyra del Oraculo',
  },
  lastMessage: message,
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
};

describe('Conversation', () => {
  it('creates a conversation accessible only by participants', () => {
    const conversation = Conversation.create(conversationInput);

    expect(conversation.id.toString()).toBe('conversation-1');
    expect(conversation.canBeAccessedBy('buyer-1')).toBe(true);
    expect(conversation.canBeAccessedBy('seller-1')).toBe(true);
    expect(conversation.canBeAccessedBy('stranger-1')).toBe(false);
    expect(conversation.lastMessage?.content).toBe('¿Sigue apuntando hacia decisiones no tomadas?');
  });

  it('rejects conversations with the same buyer and seller', () => {
    expect(() =>
      Conversation.create({
        ...conversationInput,
        seller: conversationInput.buyer,
      }),
    ).toThrow('Conversation participants must be different users.');
  });
});

describe('Message', () => {
  it('trims message content', () => {
    const createdMessage = Message.create({
      ...message,
      id: 'message-2',
      content: '  Mensaje desde el borde del portal  ',
    });

    expect(createdMessage.content).toBe('Mensaje desde el borde del portal');
  });

  it('rejects empty message content', () => {
    expect(() =>
      Message.create({
        ...message,
        id: 'message-3',
        content: '   ',
      }),
    ).toThrow('Message content cannot be empty.');
  });
});
