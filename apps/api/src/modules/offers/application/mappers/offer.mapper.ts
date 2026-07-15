import type { Offer } from '../../domain/entities/offer';
import type { OfferDto } from '../dto/offer.dto';

export class OfferMapper {
  static toDto(offer: Offer): OfferDto {
    return {
      id: offer.id.toString(),
      listing: offer.listing,
      buyer: offer.buyer,
      amount: {
        amount: offer.amount.amount,
        currencyCode: offer.amount.currencyCode,
      },
      message: offer.message,
      status: offer.status,
      createdAt: offer.createdAt.toISOString(),
      updatedAt: offer.updatedAt.toISOString(),
    };
  }
}
