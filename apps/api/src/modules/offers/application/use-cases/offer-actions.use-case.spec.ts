import { describe, expect, it } from 'vitest';

import type { NotificationPublisher } from '../../../notifications/application/services/notification-publisher';
import type { Offer } from '../../domain/entities/offer';
import type { OfferRepository } from '../../domain/repositories/offer.repository';
import { AcceptOfferUseCase } from './accept-offer.use-case';
import { CancelOfferUseCase } from './cancel-offer.use-case';
import { RejectOfferUseCase } from './reject-offer.use-case';

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
  status: 'ACCEPTED',
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
} as Offer;

function createRepository(): OfferRepository {
  return {
    findById: async () => offer,
    findByBuyerId: async () => [],
    findByListingSlugForSeller: async () => [],
    create: async () => offer,
    accept: async () => offer,
    reject: async () =>
      ({
        ...offer,
        status: 'REJECTED',
      }) as Offer,
    cancel: async () =>
      ({
        ...offer,
        status: 'CANCELLED',
      }) as Offer,
  };
}

function createNotificationPublisher() {
  const published: unknown[] = [];

  return {
    published,
    publisher: {
      publish: async (input: unknown) => {
        published.push(input);
        return {};
      },
    } as NotificationPublisher,
  };
}

describe('Offer action use cases', () => {
  it('accepts an offer and notifies the buyer', async () => {
    const { published, publisher } = createNotificationPublisher();
    const useCase = new AcceptOfferUseCase(createRepository(), publisher);

    await expect(useCase.execute('seller-1', 'offer-1')).resolves.toEqual(
      expect.objectContaining({
        id: 'offer-1',
        status: 'ACCEPTED',
      }),
    );
    expect(published).toEqual([
      {
        userId: 'buyer-1',
        type: 'OFFER_ACCEPTED',
        title: 'Oferta aceptada',
        message: 'Tu oferta por "Brujula de decisiones no tomadas" ha sido aceptada.',
        linkPath: '/listings/brujula-de-decisiones-no-tomadas',
      },
    ]);
  });

  it('rejects an offer and notifies the buyer', async () => {
    const { published, publisher } = createNotificationPublisher();
    const useCase = new RejectOfferUseCase(createRepository(), publisher);

    await expect(useCase.execute('seller-1', 'offer-1')).resolves.toEqual(
      expect.objectContaining({
        id: 'offer-1',
        status: 'REJECTED',
      }),
    );
    expect(published).toEqual([
      {
        userId: 'buyer-1',
        type: 'OFFER_REJECTED',
        title: 'Oferta rechazada',
        message: 'Tu oferta por "Brujula de decisiones no tomadas" ha sido rechazada.',
        linkPath: '/listings/brujula-de-decisiones-no-tomadas',
      },
    ]);
  });

  it('cancels an offer without publishing a seller notification', async () => {
    const repository = createRepository();
    const useCase = new CancelOfferUseCase(repository);

    await expect(useCase.execute('buyer-1', 'offer-1')).resolves.toEqual(
      expect.objectContaining({
        id: 'offer-1',
        status: 'CANCELLED',
      }),
    );
  });
});
