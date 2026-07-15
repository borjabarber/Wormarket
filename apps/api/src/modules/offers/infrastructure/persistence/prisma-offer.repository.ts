import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { OfferError } from '../../application/errors/offer-error';
import type { Offer } from '../../domain/entities/offer';
import type { CreateOfferInput, OfferRepository } from '../../domain/repositories/offer.repository';
import { PrismaOfferMapper } from './prisma-offer.mapper';

const offerInclude = {
  buyer: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
  listing: {
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          displayName: true,
        },
      },
      dimension: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  },
};

@Injectable()
export class PrismaOfferRepository implements OfferRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Offer | null> {
    const offer = await this.prisma.offer.findUnique({
      where: {
        id,
      },
      include: offerInclude,
    });

    return offer ? PrismaOfferMapper.toDomain(offer) : null;
  }

  async findByBuyerId(buyerId: string): Promise<Offer[]> {
    const buyer = await this.prisma.user.findUnique({
      where: {
        id: buyerId,
      },
      select: {
        id: true,
      },
    });

    if (!buyer) {
      throw new OfferError('BUYER_NOT_FOUND', 'El comprador no existe.', 404);
    }

    const offers = await this.prisma.offer.findMany({
      where: {
        buyerId,
      },
      include: offerInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return offers.map((offer) => PrismaOfferMapper.toDomain(offer));
  }

  async findByListingSlugForSeller(listingSlug: string, sellerId: string): Promise<Offer[]> {
    const listing = await this.prisma.listing.findUnique({
      where: {
        slug: listingSlug,
      },
      select: {
        id: true,
        sellerId: true,
      },
    });

    if (!listing) {
      throw new OfferError('LISTING_NOT_FOUND', 'El anuncio no existe.', 404);
    }

    if (listing.sellerId !== sellerId) {
      throw new OfferError(
        'SELLER_NOT_AUTHORIZED',
        'No puedes ver ofertas de un anuncio que no te pertenece.',
        403,
      );
    }

    const offers = await this.prisma.offer.findMany({
      where: {
        listingId: listing.id,
      },
      include: offerInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return offers.map((offer) => PrismaOfferMapper.toDomain(offer));
  }

  async create(input: CreateOfferInput): Promise<Offer> {
    if (input.amount <= 0) {
      throw new OfferError(
        'INVALID_OFFER_AMOUNT',
        'El importe de la oferta debe ser mayor que cero.',
        400,
      );
    }

    const message = input.message?.trim() || null;

    if (message && message.length > 500) {
      throw new OfferError(
        'INVALID_OFFER_MESSAGE',
        'El mensaje de la oferta no puede superar 500 caracteres.',
        400,
      );
    }

    const [buyer, listing] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: input.buyerId,
        },
        select: {
          id: true,
        },
      }),
      this.prisma.listing.findUnique({
        where: {
          slug: input.listingSlug,
        },
        select: {
          id: true,
          sellerId: true,
          status: true,
          currencyCode: true,
        },
      }),
    ]);

    if (!buyer) {
      throw new OfferError('BUYER_NOT_FOUND', 'El comprador no existe.', 404);
    }

    if (!listing) {
      throw new OfferError('LISTING_NOT_FOUND', 'El anuncio no existe.', 404);
    }

    if (listing.sellerId === buyer.id) {
      throw new OfferError(
        'CANNOT_OFFER_OWN_LISTING',
        'No puedes hacer una oferta por tu propio anuncio.',
        400,
      );
    }

    if (listing.status !== 'PUBLISHED') {
      throw new OfferError(
        'LISTING_NOT_OPEN_FOR_OFFERS',
        'Este anuncio no acepta ofertas en este momento.',
        409,
      );
    }

    const offer = await this.prisma.offer.create({
      data: {
        listingId: listing.id,
        buyerId: buyer.id,
        amount: input.amount,
        currencyCode: listing.currencyCode,
        message,
      },
      include: offerInclude,
    });

    return PrismaOfferMapper.toDomain(offer);
  }

  async accept(id: string, sellerId: string): Promise<Offer> {
    const existingOffer = await this.findRequiredOffer(id);

    if (!existingOffer.canBeAcceptedBy(sellerId)) {
      throw new OfferError(
        'OFFER_NOT_ACCEPTABLE',
        'No puedes aceptar esta oferta.',
        existingOffer.listing.seller.id === sellerId ? 409 : 403,
      );
    }

    if (existingOffer.listing.status !== 'PUBLISHED') {
      throw new OfferError(
        'LISTING_NOT_OPEN_FOR_OFFERS',
        'Este anuncio no acepta ofertas en este momento.',
        409,
      );
    }

    await this.prisma.$transaction([
      this.prisma.offer.update({
        where: {
          id,
        },
        data: {
          status: 'ACCEPTED',
        },
      }),
      this.prisma.offer.updateMany({
        where: {
          listingId: existingOffer.listing.id,
          id: {
            not: id,
          },
          status: 'PENDING',
        },
        data: {
          status: 'REJECTED',
        },
      }),
      this.prisma.listing.update({
        where: {
          id: existingOffer.listing.id,
        },
        data: {
          status: 'RESERVED',
        },
      }),
    ]);

    return this.findRequiredOffer(id);
  }

  async reject(id: string, sellerId: string): Promise<Offer> {
    const existingOffer = await this.findRequiredOffer(id);

    if (!existingOffer.canBeRejectedBy(sellerId)) {
      throw new OfferError(
        'OFFER_NOT_REJECTABLE',
        'No puedes rechazar esta oferta.',
        existingOffer.listing.seller.id === sellerId ? 409 : 403,
      );
    }

    const offer = await this.prisma.offer.update({
      where: {
        id,
      },
      data: {
        status: 'REJECTED',
      },
      include: offerInclude,
    });

    return PrismaOfferMapper.toDomain(offer);
  }

  async cancel(id: string, buyerId: string): Promise<Offer> {
    const existingOffer = await this.findRequiredOffer(id);

    if (!existingOffer.canBeCancelledBy(buyerId)) {
      throw new OfferError(
        'OFFER_NOT_CANCELLABLE',
        'No puedes cancelar esta oferta.',
        existingOffer.buyer.id === buyerId ? 409 : 403,
      );
    }

    const offer = await this.prisma.offer.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
      },
      include: offerInclude,
    });

    return PrismaOfferMapper.toDomain(offer);
  }

  private async findRequiredOffer(id: string): Promise<Offer> {
    const offer = await this.findById(id);

    if (!offer) {
      throw new OfferError('OFFER_NOT_FOUND', 'La oferta no existe.', 404);
    }

    return offer;
  }
}
