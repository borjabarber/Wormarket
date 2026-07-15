import { Inject, Injectable } from '@nestjs/common';

import {
  LISTING_REPOSITORY,
  type ListingRepository,
} from '../../domain/repositories/listing.repository';
import type { CreateListingDto } from '../dto/create-listing.dto';
import type { ListingDto } from '../dto/listing.dto';
import { ListingMapper } from '../mappers/listing.mapper';

@Injectable()
export class CreateListingUseCase {
  constructor(@Inject(LISTING_REPOSITORY) private readonly listingRepository: ListingRepository) {}

  async execute(sellerId: string, input: CreateListingDto): Promise<ListingDto> {
    const listing = await this.listingRepository.create({
      sellerId,
      ...input,
    });

    return ListingMapper.toDto(listing);
  }
}
