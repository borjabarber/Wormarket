import { Inject, Injectable } from '@nestjs/common';

import {
  FAVORITE_REPOSITORY,
  type FavoriteRepository,
} from '../../domain/repositories/favorite.repository';

@Injectable()
export class RemoveFavoriteUseCase {
  constructor(
    @Inject(FAVORITE_REPOSITORY) private readonly favoriteRepository: FavoriteRepository,
  ) {}

  async execute(userId: string, listingSlug: string): Promise<void> {
    await this.favoriteRepository.remove(userId, listingSlug);
  }
}
