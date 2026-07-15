import type {
  ListingDimension,
  ListingRarity,
  ListingSeller,
  ListingStatus,
} from '../../../listings/domain/entities/listing';
import { FavoriteId } from '../value-objects/favorite-id';

export type FavoriteUser = {
  id: string;
  username: string;
  displayName: string;
};

export type FavoriteListing = {
  id: string;
  slug: string;
  seller: ListingSeller;
  dimension: ListingDimension;
  title: string;
  description: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  rarity: ListingRarity;
  status: ListingStatus;
  imageUrls: string[];
  createdAt: Date;
};

type FavoriteProperties = {
  id: FavoriteId;
  user: FavoriteUser;
  listing: FavoriteListing;
  createdAt: Date;
};

type CreateFavoriteInput = Omit<FavoriteProperties, 'id'> & {
  id: string;
};

export class Favorite {
  private constructor(private readonly properties: FavoriteProperties) {}

  static create(input: CreateFavoriteInput): Favorite {
    if (!input.user.id.trim()) {
      throw new Error('Favorite user id cannot be empty.');
    }

    if (!input.listing.id.trim()) {
      throw new Error('Favorite listing id cannot be empty.');
    }

    return new Favorite({
      ...input,
      id: FavoriteId.create(input.id),
      user: { ...input.user },
      listing: {
        ...input.listing,
        seller: { ...input.listing.seller },
        dimension: { ...input.listing.dimension },
        price: { ...input.listing.price },
        imageUrls: [...input.listing.imageUrls],
      },
    });
  }

  get id(): FavoriteId {
    return this.properties.id;
  }

  get user(): FavoriteUser {
    return { ...this.properties.user };
  }

  get listing(): FavoriteListing {
    return {
      ...this.properties.listing,
      seller: { ...this.properties.listing.seller },
      dimension: { ...this.properties.listing.dimension },
      price: { ...this.properties.listing.price },
      imageUrls: [...this.properties.listing.imageUrls],
    };
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }
}
