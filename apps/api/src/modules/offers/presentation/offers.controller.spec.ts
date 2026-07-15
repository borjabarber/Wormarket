import { HttpException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import type {
  AuthTokenPayload,
  TokenService,
} from '../../identity/application/ports/token-service';
import type { OfferDto } from '../application/dto/offer.dto';
import { OffersController } from './offers.controller';

const offer: OfferDto = {
  id: 'offer-1',
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
  createdAt: '2026-07-09T00:00:00.000Z',
  updatedAt: '2026-07-09T00:00:00.000Z',
};

const tokenPayload: AuthTokenPayload = {
  sub: 'buyer-1',
  username: 'nadir-cronal',
  role: 'USER',
  kind: 'access',
};

const tokenService: TokenService = {
  issueAccessToken: () => 'access-token',
  issueRefreshToken: () => 'refresh-token',
  verify: () => tokenPayload,
  hashRefreshToken: () => 'refresh-token-hash',
};

describe('OffersController', () => {
  it('creates offers using the authenticated buyer id', async () => {
    let received: { buyerId: string; listingSlug: string; amount: number } | null = null;
    const controller = new OffersController(
      {
        execute: async (buyerId, input) => {
          received = {
            buyerId,
            listingSlug: input.listingSlug,
            amount: input.amount,
          };
          return offer;
        },
      },
      {
        execute: async () => [],
      },
      {
        execute: async () => [],
      },
      {
        execute: async () => offer,
      },
      {
        execute: async () => offer,
      },
      {
        execute: async () => offer,
      },
      tokenService,
    );

    await expect(
      controller.createOffer('Bearer access-token', {
        listingSlug: 'brujula-de-decisiones-no-tomadas',
        amount: 165,
        message: 'Oferta de prueba',
      }),
    ).resolves.toEqual(offer);
    expect(received).toEqual({
      buyerId: 'buyer-1',
      listingSlug: 'brujula-de-decisiones-no-tomadas',
      amount: 165,
    });
  });

  it('rejects requests without authorization', async () => {
    const controller = new OffersController(
      {
        execute: async () => offer,
      },
      {
        execute: async () => [],
      },
      {
        execute: async () => [],
      },
      {
        execute: async () => offer,
      },
      {
        execute: async () => offer,
      },
      {
        execute: async () => offer,
      },
      tokenService,
    );

    await expect(controller.listMyOffers(undefined)).rejects.toBeInstanceOf(HttpException);
  });
});
