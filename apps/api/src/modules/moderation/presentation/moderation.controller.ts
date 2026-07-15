import { Body, Controller, Get, Headers, HttpException, Inject, Param, Post } from '@nestjs/common';

import { IdentityError } from '../../identity/application/errors/identity-error';
import { TOKEN_SERVICE, type TokenService } from '../../identity/application/ports/token-service';
import type { AuthTokenPayload } from '../../identity/application/ports/token-service';
import type { ReportReason, ReportStatus } from '../domain/entities/report';
import { reportReasons } from '../domain/entities/report';
import type { ReportDto } from '../application/dto/report.dto';
import { ModerationError } from '../application/errors/moderation-error';
import {
  BlockListingUseCase,
  type BlockListingResultDto,
} from '../application/use-cases/block-listing.use-case';
import {
  BlockUserUseCase,
  type BlockUserResultDto,
} from '../application/use-cases/block-user.use-case';
import { ListReportsUseCase } from '../application/use-cases/list-reports.use-case';
import { ReportListingUseCase } from '../application/use-cases/report-listing.use-case';
import { ReportUserUseCase } from '../application/use-cases/report-user.use-case';
import { ResolveReportUseCase } from '../application/use-cases/resolve-report.use-case';

type ReportBody = {
  reason: ReportReason;
  description: string;
};

type ResolveReportBody = {
  status: Extract<ReportStatus, 'RESOLVED' | 'DISMISSED'>;
  resolution: string;
};

@Controller('moderation')
export class ModerationController {
  constructor(
    @Inject(ReportListingUseCase)
    private readonly reportListingUseCase: ReportListingUseCase,
    @Inject(ReportUserUseCase)
    private readonly reportUserUseCase: ReportUserUseCase,
    @Inject(ListReportsUseCase)
    private readonly listReportsUseCase: ListReportsUseCase,
    @Inject(ResolveReportUseCase)
    private readonly resolveReportUseCase: ResolveReportUseCase,
    @Inject(BlockListingUseCase)
    private readonly blockListingUseCase: BlockListingUseCase,
    @Inject(BlockUserUseCase)
    private readonly blockUserUseCase: BlockUserUseCase,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  @Post('reports/listings/:slug')
  async reportListing(
    @Headers('authorization') authorization: string | undefined,
    @Param('slug') slug: string,
    @Body() body: unknown,
  ): Promise<ReportDto> {
    return this.mapModerationErrors(() => {
      const user = this.authenticate(authorization);
      const parsedBody = this.parseReportBody(body);

      return this.reportListingUseCase.execute(user.sub, {
        listingSlug: slug,
        ...parsedBody,
      });
    });
  }

  @Post('reports/users/:username')
  async reportUser(
    @Headers('authorization') authorization: string | undefined,
    @Param('username') username: string,
    @Body() body: unknown,
  ): Promise<ReportDto> {
    return this.mapModerationErrors(() => {
      const user = this.authenticate(authorization);
      const parsedBody = this.parseReportBody(body);

      return this.reportUserUseCase.execute(user.sub, {
        username,
        ...parsedBody,
      });
    });
  }

  @Get('reports')
  async listReports(
    @Headers('authorization') authorization: string | undefined,
  ): Promise<ReportDto[]> {
    return this.mapModerationErrors(() => {
      this.requireModerator(this.authenticate(authorization));

      return this.listReportsUseCase.execute();
    });
  }

  @Post('reports/:reportId/resolve')
  async resolveReport(
    @Headers('authorization') authorization: string | undefined,
    @Param('reportId') reportId: string,
    @Body() body: unknown,
  ): Promise<ReportDto> {
    return this.mapModerationErrors(() => {
      const user = this.authenticate(authorization);
      this.requireModerator(user);
      const parsedBody = this.parseResolveReportBody(body);

      return this.resolveReportUseCase.execute({
        reportId,
        moderatorId: user.sub,
        ...parsedBody,
      });
    });
  }

  @Post('listings/:slug/block')
  async blockListing(
    @Headers('authorization') authorization: string | undefined,
    @Param('slug') slug: string,
  ): Promise<BlockListingResultDto> {
    return this.mapModerationErrors(() => {
      this.requireModerator(this.authenticate(authorization));

      return this.blockListingUseCase.execute(slug);
    });
  }

  @Post('users/:username/block')
  async blockUser(
    @Headers('authorization') authorization: string | undefined,
    @Param('username') username: string,
  ): Promise<BlockUserResultDto> {
    return this.mapModerationErrors(() => {
      this.requireModerator(this.authenticate(authorization));

      return this.blockUserUseCase.execute(username);
    });
  }

  private authenticate(authorization: string | undefined): AuthTokenPayload {
    return this.tokenService.verify(this.parseBearerToken(authorization), 'access');
  }

  private requireModerator(user: AuthTokenPayload): void {
    if (user.role !== 'MODERATOR' && user.role !== 'ADMIN') {
      throw new ModerationError(
        'FORBIDDEN_MODERATION_ACTION',
        'No tienes permisos para moderar Wormarket.',
        403,
      );
    }
  }

  private parseReportBody(body: unknown): ReportBody {
    if (!this.isRecord(body)) {
      throw this.invalidBodyError();
    }

    const { reason, description } = body;

    if (!this.isReportReason(reason) || typeof description !== 'string') {
      throw this.invalidBodyError();
    }

    return {
      reason,
      description,
    };
  }

  private parseResolveReportBody(body: unknown): ResolveReportBody {
    if (!this.isRecord(body)) {
      throw this.invalidBodyError();
    }

    const { status, resolution } = body;

    if (
      (status !== 'RESOLVED' && status !== 'DISMISSED') ||
      typeof resolution !== 'string' ||
      resolution.trim().length < 5 ||
      resolution.trim().length > 1000
    ) {
      throw this.invalidBodyError();
    }

    return {
      status,
      resolution,
    };
  }

  private parseBearerToken(authorization: string | undefined): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new ModerationError(
        'INVALID_AUTHORIZATION_HEADER',
        'La cabecera de autorizacion no es valida.',
        401,
      );
    }

    return authorization.slice('Bearer '.length).trim();
  }

  private async mapModerationErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof ModerationError) {
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

  private invalidBodyError(): ModerationError {
    return new ModerationError('INVALID_MODERATION_BODY', 'La solicitud no es valida.', 400);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  private isReportReason(value: unknown): value is ReportReason {
    return reportReasons.some((reason) => reason === value);
  }
}
