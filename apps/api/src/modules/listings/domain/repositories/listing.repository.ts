import type { Listing, ListingRarity } from '../entities/listing';

export const LISTING_REPOSITORY = Symbol('LISTING_REPOSITORY');

export type CreateListingInput = {
  sellerId: string;
  dimensionSlug: string;
  title: string;
  description: string;
  price: number;
  rarity: ListingRarity;
  imageUrls: string[];
};

export type UpdateListingInput = CreateListingInput;

export interface ListingRepository {
  findAll(): Promise<Listing[]>;
  findBySlug(slug: string): Promise<Listing | null>;
  create(input: CreateListingInput): Promise<Listing>;
  update(slug: string, input: UpdateListingInput): Promise<Listing>;
}
