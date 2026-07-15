import type {
  ListingDimension,
  ListingRarity,
  ListingSeller,
  ListingStatus,
} from '../../../listings/domain/entities/listing';
import { Money } from '../../../listings/domain/value-objects/money';
import { OfferId } from '../value-objects/offer-id';

export const offerStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'] as const;

export type OfferStatus = (typeof offerStatuses)[number];

export type OfferBuyer = {
  id: string;
  username: string;
  displayName: string;
};

export type OfferListing = {
  id: string;
  slug: string;
  seller: ListingSeller;
  dimension: ListingDimension;
  title: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  rarity: ListingRarity;
  status: ListingStatus;
};

type OfferProperties = {
  id: OfferId;
  listing: OfferListing;
  buyer: OfferBuyer;
  amount: Money;
  message: string | null;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
};

type CreateOfferInput = Omit<OfferProperties, 'id' | 'amount'> & {
  id: string;
  amount: number;
  currencyCode: string;
};

export class Offer {
  private constructor(private readonly properties: OfferProperties) {}

  static create(input: CreateOfferInput): Offer {
    if (!offerStatuses.includes(input.status)) {
      throw new Error('Offer status is not supported.');
    }

    const message = input.message?.trim() || null;

    if (message && message.length > 500) {
      throw new Error('Offer message cannot be longer than 500 characters.');
    }

    return new Offer({
      ...input,
      id: OfferId.create(input.id),
      listing: {
        ...input.listing,
        seller: { ...input.listing.seller },
        dimension: { ...input.listing.dimension },
        price: { ...input.listing.price },
      },
      buyer: { ...input.buyer },
      amount: Money.create(input.amount, input.currencyCode),
      message,
    });
  }

  canBeAcceptedBy(userId: string): boolean {
    return this.properties.status === 'PENDING' && this.properties.listing.seller.id === userId;
  }

  canBeRejectedBy(userId: string): boolean {
    return this.canBeAcceptedBy(userId);
  }

  canBeCancelledBy(userId: string): boolean {
    return this.properties.status === 'PENDING' && this.properties.buyer.id === userId;
  }

  get id(): OfferId {
    return this.properties.id;
  }

  get listing(): OfferListing {
    return {
      ...this.properties.listing,
      seller: { ...this.properties.listing.seller },
      dimension: { ...this.properties.listing.dimension },
      price: { ...this.properties.listing.price },
    };
  }

  get buyer(): OfferBuyer {
    return { ...this.properties.buyer };
  }

  get amount(): Money {
    return this.properties.amount;
  }

  get message(): string | null {
    return this.properties.message;
  }

  get status(): OfferStatus {
    return this.properties.status;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
