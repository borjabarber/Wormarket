import { describe, expect, it } from 'vitest';

import type { ListingRepository } from '../../domain/repositories/listing.repository';
import { GetListingUseCase } from './get-listing.use-case';

describe('GetListingUseCase', () => {
  it('returns null when the listing does not exist', async () => {
    const repository: ListingRepository = {
      findAll: async () => [],
      findBySlug: async () => null,
      create: async () => {
        throw new Error('Not used.');
      },
    };
    const useCase = new GetListingUseCase(repository);

    await expect(useCase.execute('missing-listing')).resolves.toBeNull();
  });
});
