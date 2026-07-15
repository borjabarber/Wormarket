import { HttpException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import type {
  AuthTokenPayload,
  TokenService,
} from '../../identity/application/ports/token-service';
import type { ConversationDto, MessageDto } from '../application/dto/conversation.dto';
import { ConversationsController } from './conversations.controller';

const conversation: ConversationDto = {
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
    rarity: 'RARE',
    status: 'PUBLISHED',
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
  lastMessage: null,
  createdAt: '2026-07-09T00:00:00.000Z',
  updatedAt: '2026-07-09T00:00:00.000Z',
};

const message: MessageDto = {
  id: 'message-1',
  conversationId: 'conversation-1',
  sender: conversation.buyer,
  content: 'Mensaje de prueba',
  createdAt: '2026-07-09T00:00:00.000Z',
  readAt: null,
};

const tokenPayload: AuthTokenPayload = {
  sub: 'buyer-1',
  username: 'nadir-cronal',
  role: 'USER',
  kind: 'access',
};

const tokenService: TokenService = {
  issueAccessToken: () => 'access-token',
  issueRefreshToken: () => 'refresh-token',
  verify: () => tokenPayload,
  hashRefreshToken: () => 'refresh-token-hash',
};

describe('ConversationsController', () => {
  it('creates conversations using the authenticated participant id', async () => {
    let received: { participantId: string; listingSlug: string } | null = null;
    const controller = new ConversationsController(
      {
        execute: async (participantId, input) => {
          received = { participantId, listingSlug: input.listingSlug };
          return conversation;
        },
      },
      { execute: async () => [] },
      { execute: async () => conversation },
      { execute: async () => [] },
      { execute: async () => message },
      { execute: async () => [message] },
      tokenService,
    );

    await expect(
      controller.createConversation('Bearer access-token', {
        listingSlug: 'brujula-de-decisiones-no-tomadas',
      }),
    ).resolves.toEqual(conversation);
    expect(received).toEqual({
      participantId: 'buyer-1',
      listingSlug: 'brujula-de-decisiones-no-tomadas',
    });
  });

  it('rejects requests without authorization', async () => {
    const controller = new ConversationsController(
      { execute: async () => conversation },
      { execute: async () => [] },
      { execute: async () => conversation },
      { execute: async () => [] },
      { execute: async () => message },
      { execute: async () => [message] },
      tokenService,
    );

    await expect(controller.listMyConversations(undefined)).rejects.toBeInstanceOf(HttpException);
  });
});
