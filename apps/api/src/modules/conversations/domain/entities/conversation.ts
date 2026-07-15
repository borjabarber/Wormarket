import type {
  ListingDimension,
  ListingRarity,
  ListingSeller,
  ListingStatus,
} from '../../../listings/domain/entities/listing';
import type { OfferBuyer } from '../../../offers/domain/entities/offer';
import { ConversationId } from '../value-objects/conversation-id';
import type { Message } from './message';

export type ConversationListing = {
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

type ConversationProperties = {
  id: ConversationId;
  listing: ConversationListing;
  buyer: OfferBuyer;
  seller: ListingSeller;
  lastMessage: Message | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateConversationInput = Omit<ConversationProperties, 'id'> & {
  id: string;
};

export class Conversation {
  private constructor(private readonly properties: ConversationProperties) {}

  static create(input: CreateConversationInput): Conversation {
    if (input.buyer.id === input.seller.id) {
      throw new Error('Conversation participants must be different users.');
    }

    return new Conversation({
      ...input,
      id: ConversationId.create(input.id),
      listing: {
        ...input.listing,
        seller: { ...input.listing.seller },
        dimension: { ...input.listing.dimension },
        price: { ...input.listing.price },
      },
      buyer: { ...input.buyer },
      seller: { ...input.seller },
    });
  }

  canBeAccessedBy(userId: string): boolean {
    return this.properties.buyer.id === userId || this.properties.seller.id === userId;
  }

  get id(): ConversationId {
    return this.properties.id;
  }

  get listing(): ConversationListing {
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

  get lastMessage(): Message | null {
    return this.properties.lastMessage;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
