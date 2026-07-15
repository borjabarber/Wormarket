import { Inject, Injectable, Optional } from '@nestjs/common';

import { NotificationPublisher } from '../../../notifications/application/services/notification-publisher';
import { OFFER_REPOSITORY, type OfferRepository } from '../../domain/repositories/offer.repository';
import type { CreateOfferDto } from '../dto/create-offer.dto';
import type { OfferDto } from '../dto/offer.dto';
import { OfferMapper } from '../mappers/offer.mapper';

@Injectable()
export class CreateOfferUseCase {
  constructor(
    @Inject(OFFER_REPOSITORY) private readonly offerRepository: OfferRepository,
    @Optional()
    @Inject(NotificationPublisher)
    private readonly notificationPublisher?: NotificationPublisher,
  ) {}

  async execute(buyerId: string, input: CreateOfferDto): Promise<OfferDto> {
    const offer = await this.offerRepository.create({
      buyerId,
      listingSlug: input.listingSlug,
      amount: input.amount,
      message: input.message,
    });
    const offerDto = OfferMapper.toDto(offer);

    await this.notificationPublisher?.publish({
      userId: offerDto.listing.seller.id,
      type: 'OFFER_RECEIVED',
      title: 'Nueva oferta recibida',
      message: `${offerDto.buyer.displayName} ha ofertado ${offerDto.amount.amount} ${offerDto.amount.currencyCode} por "${offerDto.listing.title}".`,
      linkPath: `/listings/${offerDto.listing.slug}`,
    });

    return offerDto;
  }
}
