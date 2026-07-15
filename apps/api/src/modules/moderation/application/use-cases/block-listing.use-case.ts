import { Inject, Injectable } from '@nestjs/common';

import {
  MODERATION_REPOSITORY,
  type ModerationRepository,
} from '../../domain/repositories/moderation.repository';
import { ModerationError } from '../errors/moderation-error';

export type BlockListingResultDto = {
  slug: string;
  status: 'BLOCKED';
};

@Injectable()
export class BlockListingUseCase {
  constructor(
    @Inject(MODERATION_REPOSITORY) private readonly moderationRepository: ModerationRepository,
  ) {}

  async execute(slug: string): Promise<BlockListingResultDto> {
    const blocked = await this.moderationRepository.blockListing(slug);

    if (!blocked) {
      throw new ModerationError('LISTING_NOT_FOUND', 'El anuncio no existe.', 404);
    }

    return {
      slug,
      status: 'BLOCKED',
    };
  }
}
