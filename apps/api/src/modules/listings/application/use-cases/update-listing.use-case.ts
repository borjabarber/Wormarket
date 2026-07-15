import { Inject, Injectable } from '@nestjs/common';

import {
  LISTING_REPOSITORY,
  type ListingRepository,
} from '../../domain/repositories/listing.repository';
import type { ListingDto } from '../dto/listing.dto';
import type { UpdateListingDto } from '../dto/update-listing.dto';
import { ListingMapper } from '../mappers/listing.mapper';

@Injectable()
export class UpdateListingUseCase {
  constructor(@Inject(LISTING_REPOSITORY) private readonly listingRepository: ListingRepository) {}

  async execute(slug: string, sellerId: string, input: UpdateListingDto): Promise<ListingDto> {
    const listing = await this.listingRepository.update(slug, {
      sellerId,
      ...input,
    });

    return ListingMapper.toDto(listing);
  }
}
