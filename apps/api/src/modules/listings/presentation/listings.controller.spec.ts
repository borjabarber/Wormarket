import { HttpException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import type {
  AuthTokenPayload,
  TokenService,
} from '../../identity/application/ports/token-service';
import type { ListingDto } from '../application/dto/listing.dto';
import { ListingsController } from './listings.controller';

const listing: ListingDto = {
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
};

const tokenPayload: AuthTokenPayload = {
  sub: 'user-1',
  username: 'lyra-oraculo',
  role: 'USER',
  kind: 'access',
};

const tokenService: TokenService = {
  issueAccessToken: () => 'access-token',
  issueRefreshToken: () => 'refresh-token',
  verify: () => tokenPayload,
  hashRefreshToken: () => 'refresh-token-hash',
};

describe('ListingsController', () => {
  it('lists listings through the use case', async () => {
    const controller = new ListingsController(
      {
        execute: async () => [listing],
      },
      {
        execute: async () => null,
      },
      {
        execute: async () => listing,
      },
      {
        execute: async () => listing,
      },
      tokenService,
    );

    await expect(controller.listListings()).resolves.toEqual([listing]);
  });

  it('creates listings using the authenticated seller id', async () => {
    let sellerId: string | null = null;
    const controller = new ListingsController(
      {
        execute: async () => [],
      },
      {
        execute: async () => null,
      },
      {
        execute: async (inputSellerId) => {
          sellerId = inputSellerId;
          return listing;
        },
      },
      {
        execute: async () => listing,
      },
      tokenService,
    );

    await expect(
      controller.createListing('Bearer access-token', {
        dimensionSlug: 'oraculo-norte',
        title: 'Brujula de decisiones no tomadas',
        description: 'Instrumento de bolsillo que apunta hacia alternativas improbables.',
        price: 180,
        rarity: 'RARE',
        imageUrls: [],
      }),
    ).resolves.toEqual(listing);
    expect(sellerId).toBe('user-1');
  });

  it('updates listings using the authenticated seller id', async () => {
    let sellerId: string | null = null;
    let slug: string | null = null;
    const controller = new ListingsController(
      {
        execute: async () => [],
      },
      {
        execute: async () => null,
      },
      {
        execute: async () => listing,
      },
      {
        execute: async (inputSlug, inputSellerId) => {
          slug = inputSlug;
          sellerId = inputSellerId;
          return listing;
        },
      },
      tokenService,
    );

    await expect(
      controller.updateListing('Bearer access-token', 'brujula-de-decisiones-no-tomadas', {
        dimensionSlug: 'oraculo-norte',
        title: 'Brujula de decisiones no tomadas',
        description: 'Instrumento de bolsillo que apunta hacia alternativas improbables.',
        price: 180,
        rarity: 'RARE',
        imageUrls: [],
      }),
    ).resolves.toEqual(listing);
    expect(slug).toBe('brujula-de-decisiones-no-tomadas');
    expect(sellerId).toBe('user-1');
  });

  it('rejects create requests without authorization', async () => {
    const controller = new ListingsController(
      {
        execute: async () => [],
      },
      {
        execute: async () => null,
      },
      {
        execute: async () => listing,
      },
      {
        execute: async () => listing,
      },
      tokenService,
    );

    await expect(controller.createListing(undefined, {})).rejects.toBeInstanceOf(HttpException);
  });
});
