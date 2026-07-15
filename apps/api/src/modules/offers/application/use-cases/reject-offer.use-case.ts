import { Inject, Injectable, Optional } from '@nestjs/common';

import { NotificationPublisher } from '../../../notifications/application/services/notification-publisher';
import { OFFER_REPOSITORY, type OfferRepository } from '../../domain/repositories/offer.repository';
import type { OfferDto } from '../dto/offer.dto';
import { OfferMapper } from '../mappers/offer.mapper';

@Injectable()
export class RejectOfferUseCase {
  constructor(
    @Inject(OFFER_REPOSITORY) private readonly offerRepository: OfferRepository,
    @Optional()
    @Inject(NotificationPublisher)
    private readonly notificationPublisher?: NotificationPublisher,
  ) {}

  async execute(sellerId: string, offerId: string): Promise<OfferDto> {
    const offer = await this.offerRepository.reject(offerId, sellerId);
    const offerDto = OfferMapper.toDto(offer);

    await this.notificationPublisher?.publish({
      userId: offerDto.buyer.id,
      type: 'OFFER_REJECTED',
      title: 'Oferta rechazada',
      message: `Tu oferta por "${offerDto.listing.title}" ha sido rechazada.`,
      linkPath: `/listings/${offerDto.listing.slug}`,
    });

    return offerDto;
  }
}
