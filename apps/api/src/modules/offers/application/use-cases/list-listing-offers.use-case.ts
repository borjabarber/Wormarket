import { Inject, Injectable } from '@nestjs/common';

import { OFFER_REPOSITORY, type OfferRepository } from '../../domain/repositories/offer.repository';
import type { OfferDto } from '../dto/offer.dto';
import { OfferMapper } from '../mappers/offer.mapper';

@Injectable()
export class ListListingOffersUseCase {
  constructor(@Inject(OFFER_REPOSITORY) private readonly offerRepository: OfferRepository) {}

  async execute(sellerId: string, listingSlug: string): Promise<OfferDto[]> {
    const offers = await this.offerRepository.findByListingSlugForSeller(listingSlug, sellerId);

    return offers.map((offer) => OfferMapper.toDto(offer));
  }
}
