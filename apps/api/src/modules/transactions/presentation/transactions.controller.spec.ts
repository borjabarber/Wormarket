import { HttpException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import type {
  AuthTokenPayload,
  TokenService,
} from '../../identity/application/ports/token-service';
import type { TransactionDto } from '../application/dto/transaction.dto';
import { TransactionsController } from './transactions.controller';

const transaction: TransactionDto = {
  id: 'transaction-1',
  offerId: 'offer-1',
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
    status: 'RESERVED',
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
  amount: {
    amount: 165,
    currencyCode: 'AUR',
  },
  status: 'PENDING_DELIVERY',
  createdAt: '2026-07-09T00:00:00.000Z',
  updatedAt: '2026-07-09T00:00:00.000Z',
  completedAt: null,
};

const tokenPayload: AuthTokenPayload = {
  sub: 'seller-1',
  username: 'lyra-oraculo',
  role: 'USER',
  kind: 'access',
};

const tokenService: TokenService = {
  issueAccessToken: () => 'access-token',
  issueRefreshToken: () => 'refresh-token',
  verify: () => tokenPayload,
  hashRefreshToken: () => 'refresh-token-hash',
};

describe('TransactionsController', () => {
  it('creates transactions from offers using the authenticated seller id', async () => {
    let received: { sellerId: string; offerId: string } | null = null;
    const controller = new TransactionsController(
      {
        execute: async (sellerId, offerId) => {
          received = { sellerId, offerId };
          return transaction;
        },
      },
      {
        execute: async () => [],
      },
      {
        execute: async () => transaction,
      },
      {
        execute: async () => transaction,
      },
      tokenService,
    );

    await expect(controller.createFromOffer('Bearer access-token', 'offer-1')).resolves.toEqual(
      transaction,
    );
    expect(received).toEqual({
      sellerId: 'seller-1',
      offerId: 'offer-1',
    });
  });

  it('rejects requests without authorization', async () => {
    const controller = new TransactionsController(
      {
        execute: async () => transaction,
      },
      {
        execute: async () => [],
      },
      {
        execute: async () => transaction,
      },
      {
        execute: async () => transaction,
      },
      tokenService,
    );

    await expect(controller.listMyTransactions(undefined)).rejects.toBeInstanceOf(HttpException);
  });
});
