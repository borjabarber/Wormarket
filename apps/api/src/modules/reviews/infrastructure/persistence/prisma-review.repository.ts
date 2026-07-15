import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { ReviewError } from '../../application/errors/review-error';
import type { Review } from '../../domain/entities/review';
import type {
  CreateReviewInput,
  ReviewRepository,
} from '../../domain/repositories/review.repository';
import { PrismaReviewMapper } from './prisma-review.mapper';

const reviewInclude = {
  reviewer: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
  reviewee: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
  transaction: {
    select: {
      id: true,
      completedAt: true,
      listing: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
    },
  },
} as const;

@Injectable()
export class PrismaReviewRepository implements ReviewRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(input: CreateReviewInput): Promise<Review> {
    const normalizedTransactionId = input.transactionId.trim();
    const normalizedComment = input.comment?.trim() || null;

    if (!normalizedTransactionId) {
      throw new ReviewError(
        'INVALID_TRANSACTION_ID',
        'La transaccion de la valoracion es obligatoria.',
        400,
      );
    }

    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
      throw new ReviewError(
        'INVALID_REVIEW_RATING',
        'La valoracion debe ser un numero entero entre 1 y 5.',
        400,
      );
    }

    if (normalizedComment && normalizedComment.length > 1000) {
      throw new ReviewError(
        'INVALID_REVIEW_COMMENT',
        'El comentario de la valoracion no puede superar 1000 caracteres.',
        400,
      );
    }

    const [reviewer, transaction] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: input.reviewerId,
        },
        select: {
          id: true,
        },
      }),
      this.prisma.transaction.findUnique({
        where: {
          id: normalizedTransactionId,
        },
        select: {
          id: true,
          buyerId: true,
          sellerId: true,
          status: true,
        },
      }),
    ]);

    if (!reviewer) {
      throw new ReviewError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    if (!transaction) {
      throw new ReviewError('TRANSACTION_NOT_FOUND', 'La transaccion no existe.', 404);
    }

    if (transaction.status !== 'COMPLETED') {
      throw new ReviewError(
        'TRANSACTION_NOT_COMPLETED',
        'Solo puedes valorar una transaccion completada.',
        409,
      );
    }

    const revieweeId = this.resolveRevieweeId(
      transaction.buyerId,
      transaction.sellerId,
      reviewer.id,
    );

    const existingReview = await this.prisma.review.findUnique({
      where: {
        transactionId_reviewerId: {
          transactionId: transaction.id,
          reviewerId: reviewer.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingReview) {
      throw new ReviewError('REVIEW_ALREADY_EXISTS', 'Ya has valorado esta transaccion.', 409);
    }

    const createdReview = await this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          transactionId: transaction.id,
          reviewerId: reviewer.id,
          revieweeId,
          rating: input.rating,
          comment: normalizedComment,
        },
        include: reviewInclude,
      });

      await this.updateUserReputation(tx, revieweeId);

      return review;
    });

    return PrismaReviewMapper.toDomain(createdReview);
  }

  async findByRevieweeUsername(username: string): Promise<Review[]> {
    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
      throw new ReviewError('INVALID_USERNAME', 'El nombre de usuario es obligatorio.', 400);
    }

    const reviewee = await this.prisma.user.findUnique({
      where: {
        username: normalizedUsername,
      },
      select: {
        id: true,
      },
    });

    if (!reviewee) {
      throw new ReviewError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        revieweeId: reviewee.id,
      },
      include: reviewInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map((review) => PrismaReviewMapper.toDomain(review));
  }

  async calculateUserReputation(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new ReviewError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    return this.updateUserReputation(this.prisma, user.id);
  }

  private resolveRevieweeId(buyerId: string, sellerId: string, reviewerId: string): string {
    if (reviewerId === buyerId) {
      return sellerId;
    }

    if (reviewerId === sellerId) {
      return buyerId;
    }

    throw new ReviewError(
      'REVIEWER_NOT_PARTICIPANT',
      'Solo los participantes pueden valorar esta transaccion.',
      403,
    );
  }

  private async updateUserReputation(
    client: Pick<PrismaService, 'review' | 'user'>,
    userId: string,
  ): Promise<number> {
    const aggregate = await client.review.aggregate({
      where: {
        revieweeId: userId,
      },
      _avg: {
        rating: true,
      },
    });

    const reputation = Math.round((aggregate._avg.rating ?? 0) * 20);

    await client.user.update({
      where: {
        id: userId,
      },
      data: {
        reputation,
      },
    });

    return reputation;
  }
}
