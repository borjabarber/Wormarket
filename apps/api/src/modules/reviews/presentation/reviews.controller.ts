import { Body, Controller, Get, Headers, HttpException, Inject, Param, Post } from '@nestjs/common';

import { IdentityError } from '../../identity/application/errors/identity-error';
import { TOKEN_SERVICE, type TokenService } from '../../identity/application/ports/token-service';
import type { CreateReviewDto } from '../application/dto/create-review.dto';
import type { ReviewDto } from '../application/dto/review.dto';
import { ReviewError } from '../application/errors/review-error';
import { CreateReviewUseCase } from '../application/use-cases/create-review.use-case';
import { ListUserReviewsUseCase } from '../application/use-cases/list-user-reviews.use-case';

@Controller()
export class ReviewsController {
  constructor(
    @Inject(CreateReviewUseCase) private readonly createReviewUseCase: CreateReviewUseCase,
    @Inject(ListUserReviewsUseCase) private readonly listUserReviewsUseCase: ListUserReviewsUseCase,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
  ) {}

  @Post('reviews')
  async createReview(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: CreateReviewDto,
  ): Promise<ReviewDto> {
    return this.mapReviewErrors(() => {
      const reviewer = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.createReviewUseCase.execute(reviewer.sub, body);
    });
  }

  @Get('users/:username/reviews')
  async listUserReviews(@Param('username') username: string): Promise<ReviewDto[]> {
    return this.mapReviewErrors(() => this.listUserReviewsUseCase.execute(username));
  }

  private parseBearerToken(authorization: string | undefined): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new ReviewError(
        'INVALID_AUTHORIZATION_HEADER',
        'La cabecera de autorizacion no es valida.',
        401,
      );
    }

    return authorization.slice('Bearer '.length).trim();
  }

  private async mapReviewErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof ReviewError) {
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
          },
          error.statusCode,
        );
      }

      if (error instanceof IdentityError) {
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
          },
          error.statusCode,
        );
      }

      throw error;
    }
  }
}
