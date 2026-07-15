import { Inject, Injectable } from '@nestjs/common';

import { OFFER_REPOSITORY, type OfferRepository } from '../../domain/repositories/offer.repository';
import type { OfferDto } from '../dto/offer.dto';
import { OfferMapper } from '../mappers/offer.mapper';

@Injectable()
export class ListMyOffersUseCase {
  constructor(@Inject(OFFER_REPOSITORY) private readonly offerRepository: OfferRepository) {}

  async execute(buyerId: string): Promise<OfferDto[]> {
    const offers = await this.offerRepository.findByBuyerId(buyerId);

    return offers.map((offer) => OfferMapper.toDto(offer));
  }
}
