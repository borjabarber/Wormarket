import { describe, expect, it } from 'vitest';

import { Listing } from '../../domain/entities/listing';
import type { ListingRepository } from '../../domain/repositories/listing.repository';
import { CreateListingUseCase } from './create-listing.use-case';

const listing = Listing.create({
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

describe('CreateListingUseCase', () => {
  it('creates a listing for the authenticated seller', async () => {
    let sellerId: string | null = null;
    const repository: ListingRepository = {
      findAll: async () => [],
      findBySlug: async () => null,
      create: async (input) => {
        sellerId = input.sellerId;
        return listing;
      },
      update: async () => listing,
    };
    const useCase = new CreateListingUseCase(repository);

    const result = await useCase.execute('user-1', {
      dimensionSlug: 'oraculo-norte',
      title: 'Brujula de decisiones no tomadas',
      description: 'Instrumento de bolsillo que apunta hacia alternativas improbables.',
      price: 180,
      rarity: 'RARE',
      imageUrls: [],
    });

    expect(sellerId).toBe('user-1');
    expect(result.slug).toBe('brujula-de-decisiones-no-tomadas');
  });
});
