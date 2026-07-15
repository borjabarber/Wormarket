import { Inject, Injectable } from '@nestjs/common';

import {
  MODERATION_REPOSITORY,
  type ModerationRepository,
} from '../../domain/repositories/moderation.repository';
import type { ReportReason } from '../../domain/entities/report';
import type { ReportDto } from '../dto/report.dto';
import { ReportMapper } from '../mappers/report.mapper';

export type ReportListingInput = {
  listingSlug: string;
  reason: ReportReason;
  description: string;
};

@Injectable()
export class ReportListingUseCase {
  constructor(
    @Inject(MODERATION_REPOSITORY) private readonly moderationRepository: ModerationRepository,
  ) {}

  async execute(reporterId: string, input: ReportListingInput): Promise<ReportDto> {
    const report = await this.moderationRepository.createListingReport({
      reporterId,
      listingSlug: input.listingSlug,
      reason: input.reason,
      description: input.description,
    });

    return ReportMapper.toDto(report);
  }
}
