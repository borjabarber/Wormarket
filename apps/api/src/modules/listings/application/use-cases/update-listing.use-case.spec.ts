import { describe, expect, it } from 'vitest';

import { Listing } from '../../domain/entities/listing';
import type { ListingRepository } from '../../domain/repositories/listing.repository';
import { UpdateListingUseCase } from './update-listing.use-case';

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
  title: 'Brujula afinada de decisiones no tomadas',
  description: 'Instrumento de bolsillo que apunta hacia alternativas improbables.',
  price: 190,
  currencyCode: 'AUR',
  rarity: 'RARE',
  status: 'PUBLISHED',
  imageUrls: [],
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
});

describe('UpdateListingUseCase', () => {
  it('updates a listing for the authenticated seller', async () => {
    let sellerId: string | null = null;
    let slug: string | null = null;
    const repository: ListingRepository = {
      findAll: async () => [],
      findBySlug: async () => null,
      create: async () => listing,
      update: async (inputSlug, input) => {
        slug = inputSlug;
        sellerId = input.sellerId;
        return listing;
      },
    };
    const useCase = new UpdateListingUseCase(repository);

    const result = await useCase.execute('brujula-de-decisiones-no-tomadas', 'user-1', {
      dimensionSlug: 'oraculo-norte',
      title: 'Brujula afinada de decisiones no tomadas',
      description: 'Instrumento de bolsillo que apunta hacia alternativas improbables.',
      price: 190,
      rarity: 'RARE',
      imageUrls: [],
    });

    expect(slug).toBe('brujula-de-decisiones-no-tomadas');
    expect(sellerId).toBe('user-1');
    expect(result.title).toBe('Brujula afinada de decisiones no tomadas');
  });
});
