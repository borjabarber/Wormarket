import { describe, expect, it } from 'vitest';

import { Listing } from '../../domain/entities/listing';
import type { ListingRepository } from '../../domain/repositories/listing.repository';
import { ListListingsUseCase } from './list-listings.use-case';

function createListing(): Listing {
  return Listing.create({
    id: 'listing-1',
    slug: 'brujula-de-decisiones-no-tomadas',
    seller: {
      id: 'user-1',
      username: 'lyra-oraculo',
      displayName: 'Lyra del Oraculo',
    },
    dimension: {
      id: 'dimension-1',
      slug: 'oraculo-norte',
      name: 'Oraculo Norte',
    },
    title: 'Brujula de decisiones no tomadas',
    description: 'Instrumento de bolsillo que apunta hacia alternativas improbables.',
    price: 180,
    currencyCode: 'AUR',
    rarity: 'RARE',
    status: 'PUBLISHED',
    imageUrls: [],
    createdAt: new Date('2026-07-09T00:00:00.000Z'),
    updatedAt: new Date('2026-07-09T00:00:00.000Z'),
  });
}

describe('ListListingsUseCase', () => {
  it('returns listings as DTOs', async () => {
    const repository: ListingRepository = {
      findAll: async () => [createListing()],
      findBySlug: async () => null,
      create: async () => createListing(),
    };
    const useCase = new ListListingsUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual([
      {
        id: 'listing-1',
        slug: 'brujula-de-decisiones-no-tomadas',
        seller: {
          id: 'user-1',
          username: 'lyra-oraculo',
          displayName: 'Lyra del Oraculo',
        },
        dimension: {
          id: 'dimension-1',
          slug: 'oraculo-norte',
          name: 'Oraculo Norte',
        },
        title: 'Brujula de decisiones no tomadas',
        description: 'Instrumento de bolsillo que apunta hacia alternativas improbables.',
        price: {
          amount: 180,
          currencyCode: 'AUR',
        },
        rarity: 'RARE',
        status: 'PUBLISHED',
        imageUrls: [],
        createdAt: '2026-07-09T00:00:00.000Z',
      },
    ]);
  });
});
