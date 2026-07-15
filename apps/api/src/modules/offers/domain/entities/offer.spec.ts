import { describe, expect, it } from 'vitest';

import { Offer } from './offer';

const offerInput = {
  id: 'offer-1',
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
  amount: 165,
  currencyCode: 'AUR',
  message: 'Oferta de prueba',
  status: 'PENDING' as const,
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
};

describe('Offer', () => {
  it('creates a pending offer with money and message', () => {
    const offer = Offer.create(offerInput);

    expect(offer.id.toString()).toBe('offer-1');
    expect(offer.amount.amount).toBe(165);
    expect(offer.message).toBe('Oferta de prueba');
    expect(offer.canBeAcceptedBy('seller-1')).toBe(true);
    expect(offer.canBeCancelledBy('buyer-1')).toBe(true);
  });

  it('rejects unsupported statuses', () => {
    expect(() =>
      Offer.create({
        ...offerInput,
        status: 'UNKNOWN',
      } as never),
    ).toThrow('Offer status is not supported.');
  });

  it('does not allow transitions from non pending offers', () => {
    const offer = Offer.create({
      ...offerInput,
      status: 'ACCEPTED',
    });

    expect(offer.canBeAcceptedBy('seller-1')).toBe(false);
    expect(offer.canBeCancelledBy('buyer-1')).toBe(false);
  });
});
