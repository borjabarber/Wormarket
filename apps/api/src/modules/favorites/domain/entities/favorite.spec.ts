import { describe, expect, it } from 'vitest';

import { Favorite } from './favorite';

const favoriteInput = {
  id: 'favorite-1',
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
    rarity: 'RARE' as const,
    status: 'PUBLISHED' as const,
    imageUrls: ['/images/demo/brujula-decisiones.png'],
    createdAt: new Date('2026-07-09T00:00:00.000Z'),
  },
  createdAt: new Date('2026-07-09T01:00:00.000Z'),
};

describe('Favorite', () => {
  it('creates a favorite with defensive copies', () => {
    const favorite = Favorite.create(favoriteInput);

    expect(favorite.id.toString()).toBe('favorite-1');
    expect(favorite.user.username).toBe('lyra-oraculo');
    expect(favorite.listing.slug).toBe('brujula-de-decisiones-no-tomadas');
    expect(favorite.listing.imageUrls).toEqual(['/images/demo/brujula-decisiones.png']);
  });

  it('rejects empty ids', () => {
    expect(() =>
      Favorite.create({
        ...favoriteInput,
        id: '',
      }),
    ).toThrow('Favorite id cannot be empty.');
  });
});
