import type {
  ListingDimension,
  ListingRarity,
  ListingSeller,
  ListingStatus,
} from '../../../listings/domain/entities/listing';
import { Money } from '../../../listings/domain/value-objects/money';
import type { OfferBuyer } from '../../../offers/domain/entities/offer';
import { TransactionId } from '../value-objects/transaction-id';

export const transactionStatuses = ['PENDING_DELIVERY', 'COMPLETED', 'CANCELLED'] as const;

export type TransactionStatus = (typeof transactionStatuses)[number];

export type TransactionListing = {
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

type TransactionProperties = {
  id: TransactionId;
  offerId: string;
  listing: TransactionListing;
  buyer: OfferBuyer;
  seller: ListingSeller;
  amount: Money;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
};

type CreateTransactionInput = Omit<TransactionProperties, 'id' | 'amount'> & {
  id: string;
  amount: number;
  currencyCode: string;
};

export class Transaction {
  private constructor(private readonly properties: TransactionProperties) {}

  static create(input: CreateTransactionInput): Transaction {
    if (!transactionStatuses.includes(input.status)) {
      throw new Error('Transaction status is not supported.');
    }

    if (input.completedAt && input.status !== 'COMPLETED') {
      throw new Error('Only completed transactions can have a completion date.');
    }

    return new Transaction({
      ...input,
      id: TransactionId.create(input.id),
      listing: {
        ...input.listing,
        seller: { ...input.listing.seller },
        dimension: { ...input.listing.dimension },
        price: { ...input.listing.price },
      },
      buyer: { ...input.buyer },
      seller: { ...input.seller },
      amount: Money.create(input.amount, input.currencyCode),
    });
  }

  canBeViewedBy(userId: string): boolean {
    return this.properties.buyer.id === userId || this.properties.seller.id === userId;
  }

  canBeCompletedBy(userId: string): boolean {
    return this.properties.status === 'PENDING_DELIVERY' && this.canBeViewedBy(userId);
  }

  get id(): TransactionId {
    return this.properties.id;
  }

  get offerId(): string {
    return this.properties.offerId;
  }

  get listing(): TransactionListing {
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

  get seller(): ListingSeller {
    return { ...this.properties.seller };
  }

  get amount(): Money {
    return this.properties.amount;
  }

  get status(): TransactionStatus {
    return this.properties.status;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }

  get completedAt(): Date | null {
    return this.properties.completedAt;
  }
}
