import { Inject, Injectable } from '@nestjs/common';

import {
  LISTING_REPOSITORY,
  type ListingRepository,
} from '../../domain/repositories/listing.repository';
import type { ListingDto } from '../dto/listing.dto';
import { ListingMapper } from '../mappers/listing.mapper';

@Injectable()
export class GetListingUseCase {
  constructor(@Inject(LISTING_REPOSITORY) private readonly listingRepository: ListingRepository) {}

  async execute(slug: string): Promise<ListingDto | null> {
    const listing = await this.listingRepository.findBySlug(slug);

    return listing ? ListingMapper.toDto(listing) : null;
  }
}
