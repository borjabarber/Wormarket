import { describe, expect, it } from 'vitest';

import { Transaction } from './transaction';

const transactionInput = {
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
    rarity: 'RARE' as const,
    status: 'RESERVED' as const,
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
  amount: 165,
  currencyCode: 'AUR',
  status: 'PENDING_DELIVERY' as const,
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
  completedAt: null,
};

describe('Transaction', () => {
  it('creates a pending transaction viewable by buyer and seller', () => {
    const transaction = Transaction.create(transactionInput);

    expect(transaction.id.toString()).toBe('transaction-1');
    expect(transaction.amount.amount).toBe(165);
    expect(transaction.canBeViewedBy('buyer-1')).toBe(true);
    expect(transaction.canBeViewedBy('seller-1')).toBe(true);
    expect(transaction.canBeCompletedBy('buyer-1')).toBe(true);
    expect(transaction.canBeCompletedBy('stranger-1')).toBe(false);
  });

  it('rejects unsupported statuses', () => {
    expect(() =>
      Transaction.create({
        ...transactionInput,
        status: 'UNKNOWN',
      } as never),
    ).toThrow('Transaction status is not supported.');
  });

  it('does not allow completion dates before completion', () => {
    expect(() =>
      Transaction.create({
        ...transactionInput,
        completedAt: new Date('2026-07-09T01:00:00.000Z'),
      }),
    ).toThrow('Only completed transactions can have a completion date.');
  });
});
