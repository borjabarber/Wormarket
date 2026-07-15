import { describe, expect, it } from 'vitest';

import { Listing } from './listing';

const validListingInput = {
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
  currencyCode: 'aur',
  rarity: 'RARE' as const,
  status: 'PUBLISHED' as const,
  imageUrls: ['/images/demo/brujula-decisiones.png'],
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
};

describe('Listing', () => {
  it('creates a valid listing and normalizes currency code', () => {
    const listing = Listing.create(validListingInput);

    expect(listing.id.toString()).toBe('listing-1');
    expect(listing.price.currencyCode).toBe('AUR');
    expect(listing.seller.username).toBe('lyra-oraculo');
  });

  it('rejects non-positive prices', () => {
    expect(() =>
      Listing.create({
        ...validListingInput,
        price: 0,
      }),
    ).toThrow('Listing price must be greater than zero.');
  });

  it('rejects invalid slugs', () => {
    expect(() =>
      Listing.create({
        ...validListingInput,
        slug: 'Brujula rara',
      }),
    ).toThrow('Listing slug must be URL friendly.');
  });
});
