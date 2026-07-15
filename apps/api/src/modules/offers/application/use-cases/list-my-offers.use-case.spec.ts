import { describe, expect, it } from 'vitest';

import type { Offer } from '../../domain/entities/offer';
import type { OfferRepository } from '../../domain/repositories/offer.repository';
import { ListMyOffersUseCase } from './list-my-offers.use-case';

const offer = {
  id: {
    toString: () => 'offer-1',
  },
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
  amount: {
    amount: 165,
    currencyCode: 'AUR',
  },
  message: null,
  status: 'PENDING',
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
} as Offer;

describe('ListMyOffersUseCase', () => {
  it('lists offers for the authenticated buyer', async () => {
    let buyerId: string | null = null;
    const repository: OfferRepository = {
      findById: async () => offer,
      findByBuyerId: async (inputBuyerId) => {
        buyerId = inputBuyerId;
        return [offer];
      },
      findByListingSlugForSeller: async () => [],
      create: async () => offer,
      accept: async () => offer,
      reject: async () => offer,
      cancel: async () => offer,
    };
    const useCase = new ListMyOffersUseCase(repository);

    await expect(useCase.execute('buyer-1')).resolves.toEqual([
      expect.objectContaining({
        id: 'offer-1',
      }),
    ]);
    expect(buyerId).toBe('buyer-1');
  });
});
