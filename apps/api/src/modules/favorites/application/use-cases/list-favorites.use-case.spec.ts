import { describe, expect, it } from 'vitest';

import type { Favorite } from '../../domain/entities/favorite';
import type { FavoriteRepository } from '../../domain/repositories/favorite.repository';
import { ListFavoritesUseCase } from './list-favorites.use-case';

const favorite = {
  id: {
    toString: () => 'favorite-1',
  },
  user: {
    id: 'user-1',
    username: 'lyra-oraculo',
    displayName: 'Lyra del Oraculo',
  },
  listing: {
    id: 'listing-1',
    slug: 'brujula-de-decisiones-no-tomadas',
    seller: {
      id: 'user-2',
      username: 'nadir-cronal',
      displayName: 'Nadir Cronal',
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
    createdAt: new Date('2026-07-09T00:00:00.000Z'),
  },
  createdAt: new Date('2026-07-09T01:00:00.000Z'),
} as Favorite;

describe('ListFavoritesUseCase', () => {
  it('lists favorite DTOs for a user', async () => {
    let receivedUserId: string | null = null;
    const repository: FavoriteRepository = {
      findByUserId: async (userId) => {
        receivedUserId = userId;
        return [favorite];
      },
      add: async () => favorite,
      remove: async () => undefined,
    };
    const useCase = new ListFavoritesUseCase(repository);

    await expect(useCase.execute('user-1')).resolves.toEqual([
      expect.objectContaining({
        id: 'favorite-1',
        listing: expect.objectContaining({
          slug: 'brujula-de-decisiones-no-tomadas',
        }),
      }),
    ]);
    expect(receivedUserId).toBe('user-1');
  });
});
