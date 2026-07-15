import { Inject, Injectable, Optional } from '@nestjs/common';

import { NotificationPublisher } from '../../../notifications/application/services/notification-publisher';
import {
  REVIEW_REPOSITORY,
  type ReviewRepository,
} from '../../domain/repositories/review.repository';
import type { CreateReviewDto } from '../dto/create-review.dto';
import type { ReviewDto } from '../dto/review.dto';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY) private readonly reviewRepository: ReviewRepository,
    @Optional()
    @Inject(NotificationPublisher)
    private readonly notificationPublisher?: NotificationPublisher,
  ) {}

  async execute(reviewerId: string, input: CreateReviewDto): Promise<ReviewDto> {
    const review = await this.reviewRepository.create({
      transactionId: input.transactionId,
      reviewerId,
      rating: input.rating,
      ...(input.comment !== undefined ? { comment: input.comment } : {}),
    });
    const reviewDto = ReviewMapper.toDto(review);

    await this.notificationPublisher?.publish({
      userId: reviewDto.reviewee.id,
      type: 'REVIEW_RECEIVED',
      title: 'Nueva valoracion recibida',
      message: `${reviewDto.reviewer.displayName} te ha valorado con ${reviewDto.rating} estrellas por "${reviewDto.transaction.listing.title}".`,
      linkPath: `/users/${reviewDto.reviewee.username}/reviews`,
    });

    return reviewDto;
  }
}
