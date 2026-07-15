import type { Favorite } from '../entities/favorite';

export const FAVORITE_REPOSITORY = Symbol('FAVORITE_REPOSITORY');

export interface FavoriteRepository {
  findByUserId(userId: string): Promise<Favorite[]>;
  add(userId: string, listingSlug: string): Promise<Favorite>;
  remove(userId: string, listingSlug: string): Promise<void>;
}
