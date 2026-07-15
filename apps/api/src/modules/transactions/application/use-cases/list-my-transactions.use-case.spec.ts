import { describe, expect, it } from 'vitest';

import type { Transaction } from '../../domain/entities/transaction';
import type { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { ListMyTransactionsUseCase } from './list-my-transactions.use-case';

const transaction = {
  id: {
    toString: () => 'transaction-1',
  },
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
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
  completedAt: null,
} as Transaction;

describe('ListMyTransactionsUseCase', () => {
  it('lists transactions for the authenticated participant', async () => {
    let receivedUserId = '';
    const repository: TransactionRepository = {
      findById: async () => transaction,
      findByParticipantId: async (userId) => {
        receivedUserId = userId;
        return [transaction];
      },
      createFromAcceptedOffer: async () => transaction,
      complete: async () => transaction,
    };
    const useCase = new ListMyTransactionsUseCase(repository);

    await expect(useCase.execute('buyer-1')).resolves.toEqual([
      expect.objectContaining({
        id: 'transaction-1',
        status: 'PENDING_DELIVERY',
      }),
    ]);
    expect(receivedUserId).toBe('buyer-1');
  });
});
