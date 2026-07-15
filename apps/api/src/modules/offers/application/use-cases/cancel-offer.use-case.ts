import { Inject, Injectable } from '@nestjs/common';

import { OFFER_REPOSITORY, type OfferRepository } from '../../domain/repositories/offer.repository';
import type { OfferDto } from '../dto/offer.dto';
import { OfferMapper } from '../mappers/offer.mapper';

@Injectable()
export class CancelOfferUseCase {
  constructor(@Inject(OFFER_REPOSITORY) private readonly offerRepository: OfferRepository) {}

  async execute(buyerId: string, offerId: string): Promise<OfferDto> {
    const offer = await this.offerRepository.cancel(offerId, buyerId);

    return OfferMapper.toDto(offer);
  }
}
