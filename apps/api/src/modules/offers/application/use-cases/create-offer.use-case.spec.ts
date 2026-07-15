import { describe, expect, it } from 'vitest';

import type { Offer } from '../../domain/entities/offer';
import type { OfferRepository } from '../../domain/repositories/offer.repository';
import { CreateOfferUseCase } from './create-offer.use-case';

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
  message: 'Oferta de prueba',
  status: 'PENDING',
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
} as Offer;

describe('CreateOfferUseCase', () => {
  it('creates an offer using the authenticated buyer id', async () => {
    let received: unknown = null;
    const repository: OfferRepository = {
      findById: async () => offer,
      findByBuyerId: async () => [],
      findByListingSlugForSeller: async () => [],
      create: async (input) => {
        received = input;
        return offer;
      },
      accept: async () => offer,
      reject: async () => offer,
      cancel: async () => offer,
    };
    const useCase = new CreateOfferUseCase(repository);

    await expect(
      useCase.execute('buyer-1', {
        listingSlug: 'brujula-de-decisiones-no-tomadas',
        amount: 165,
        message: 'Oferta de prueba',
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'offer-1',
        status: 'PENDING',
      }),
    );
    expect(received).toEqual({
      buyerId: 'buyer-1',
      listingSlug: 'brujula-de-decisiones-no-tomadas',
      amount: 165,
      message: 'Oferta de prueba',
    });
  });
});
