import type { Offer } from '../entities/offer';

export const OFFER_REPOSITORY = Symbol('OFFER_REPOSITORY');

export type CreateOfferInput = {
  buyerId: string;
  listingSlug: string;
  amount: number;
  message: string | null;
};

export interface OfferRepository {
  findById(id: string): Promise<Offer | null>;
  findByBuyerId(buyerId: string): Promise<Offer[]>;
  findByListingSlugForSeller(listingSlug: string, sellerId: string): Promise<Offer[]>;
  create(input: CreateOfferInput): Promise<Offer>;
  accept(id: string, sellerId: string): Promise<Offer>;
  reject(id: string, sellerId: string): Promise<Offer>;
  cancel(id: string, buyerId: string): Promise<Offer>;
}
