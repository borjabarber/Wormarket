import { Inject, Injectable } from '@nestjs/common';

import {
  REVIEW_REPOSITORY,
  type ReviewRepository,
} from '../../domain/repositories/review.repository';
import type { ReviewDto } from '../dto/review.dto';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class ListUserReviewsUseCase {
  constructor(@Inject(REVIEW_REPOSITORY) private readonly reviewRepository: ReviewRepository) {}

  async execute(username: string): Promise<ReviewDto[]> {
    const reviews = await this.reviewRepository.findByRevieweeUsername(username);

    return reviews.map((review) => ReviewMapper.toDto(review));
  }
}
