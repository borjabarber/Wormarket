import { Inject, Injectable } from '@nestjs/common';

import {
  LISTING_REPOSITORY,
  type ListingRepository,
} from '../../domain/repositories/listing.repository';
import type { ListingDto } from '../dto/listing.dto';
import { ListingMapper } from '../mappers/listing.mapper';

@Injectable()
export class ListListingsUseCase {
  constructor(@Inject(LISTING_REPOSITORY) private readonly listingRepository: ListingRepository) {}

  async execute(): Promise<ListingDto[]> {
    const listings = await this.listingRepository.findAll();

    return listings.map((listing) => ListingMapper.toDto(listing));
  }
}
