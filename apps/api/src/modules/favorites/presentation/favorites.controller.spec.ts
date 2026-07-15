import { HttpException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import type {
  AuthTokenPayload,
  TokenService,
} from '../../identity/application/ports/token-service';
import type { FavoriteDto } from '../application/dto/favorite.dto';
import { FavoritesController } from './favorites.controller';

const favorite: FavoriteDto = {
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
    rarity: 'RARE',
    status: 'PUBLISHED',
    imageUrls: [],
    createdAt: '2026-07-09T00:00:00.000Z',
  },
  createdAt: '2026-07-09T01:00:00.000Z',
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

describe('FavoritesController', () => {
  it('lists favorites using the authenticated user id', async () => {
    let userId: string | null = null;
    const controller = new FavoritesController(
      {
        execute: async (inputUserId) => {
          userId = inputUserId;
          return [favorite];
        },
      },
      {
        execute: async () => favorite,
      },
      {
        execute: async () => undefined,
      },
      tokenService,
    );

    await expect(controller.listFavorites('Bearer access-token')).resolves.toEqual([favorite]);
    expect(userId).toBe('user-1');
  });

  it('adds favorites using the authenticated user id and listing slug', async () => {
    let received: { userId: string; listingSlug: string } | null = null;
    const controller = new FavoritesController(
      {
        execute: async () => [],
      },
      {
        execute: async (userId, listingSlug) => {
          received = { userId, listingSlug };
          return favorite;
        },
      },
      {
        execute: async () => undefined,
      },
      tokenService,
    );

    await expect(
      controller.addFavorite('Bearer access-token', 'brujula-de-decisiones-no-tomadas'),
    ).resolves.toEqual(favorite);
    expect(received).toEqual({
      userId: 'user-1',
      listingSlug: 'brujula-de-decisiones-no-tomadas',
    });
  });

  it('removes favorites using the authenticated user id and listing slug', async () => {
    let received: { userId: string; listingSlug: string } | null = null;
    const controller = new FavoritesController(
      {
        execute: async () => [],
      },
      {
        execute: async () => favorite,
      },
      {
        execute: async (userId, listingSlug) => {
          received = { userId, listingSlug };
        },
      },
      tokenService,
    );

    await expect(
      controller.removeFavorite('Bearer access-token', 'brujula-de-decisiones-no-tomadas'),
    ).resolves.toBeUndefined();
    expect(received).toEqual({
      userId: 'user-1',
      listingSlug: 'brujula-de-decisiones-no-tomadas',
    });
  });

  it('rejects requests without authorization', async () => {
    const controller = new FavoritesController(
      {
        execute: async () => [],
      },
      {
        execute: async () => favorite,
      },
      {
        execute: async () => undefined,
      },
      tokenService,
    );

    await expect(controller.listFavorites(undefined)).rejects.toBeInstanceOf(HttpException);
  });
});
