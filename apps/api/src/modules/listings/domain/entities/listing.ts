import { ListingId } from '../value-objects/listing-id';
import { Money } from '../value-objects/money';

export const listingRarities = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'FORBIDDEN'] as const;
export const listingStatuses = [
  'DRAFT',
  'PUBLISHED',
  'RESERVED',
  'SOLD',
  'CANCELLED',
  'BLOCKED',
] as const;

export type ListingRarity = (typeof listingRarities)[number];
export type ListingStatus = (typeof listingStatuses)[number];

export type ListingSeller = {
  id: string;
  username: string;
  displayName: string;
};

export type ListingDimension = {
  id: string;
  slug: string;
  name: string;
};

type ListingProperties = {
  id: ListingId;
  slug: string;
  seller: ListingSeller;
  dimension: ListingDimension;
  title: string;
  description: string;
  price: Money;
  rarity: ListingRarity;
  status: ListingStatus;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
};

type CreateListingInput = Omit<ListingProperties, 'id' | 'price'> & {
  id: string;
  price: number;
  currencyCode: string;
};

export class Listing {
  private constructor(private readonly properties: ListingProperties) {}

  static create(input: CreateListingInput): Listing {
    const title = input.title.trim();
    const description = input.description.trim();
    const slug = input.slug.trim().toLowerCase();

    if (title.length < 3 || title.length > 120) {
      throw new Error('Listing title must contain between 3 and 120 characters.');
    }

    if (description.length < 10 || description.length > 2000) {
      throw new Error('Listing description must contain between 10 and 2000 characters.');
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error('Listing slug must be URL friendly.');
    }

    if (!listingRarities.includes(input.rarity)) {
      throw new Error('Listing rarity is not supported.');
    }

    if (!listingStatuses.includes(input.status)) {
      throw new Error('Listing status is not supported.');
    }

    return new Listing({
      ...input,
      id: ListingId.create(input.id),
      slug,
      title,
      description,
      price: Money.create(input.price, input.currencyCode),
      seller: { ...input.seller },
      dimension: { ...input.dimension },
      imageUrls: [...input.imageUrls],
    });
  }

  get id(): ListingId {
    return this.properties.id;
  }

  get slug(): string {
    return this.properties.slug;
  }

  get seller(): ListingSeller {
    return { ...this.properties.seller };
  }

  get dimension(): ListingDimension {
    return { ...this.properties.dimension };
  }

  get title(): string {
    return this.properties.title;
  }

  get description(): string {
    return this.properties.description;
  }

  get price(): Money {
    return this.properties.price;
  }

  get rarity(): ListingRarity {
    return this.properties.rarity;
  }

  get status(): ListingStatus {
    return this.properties.status;
  }

  get imageUrls(): string[] {
    return [...this.properties.imageUrls];
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
