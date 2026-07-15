import { Inject, Injectable } from '@nestjs/common';

import type { ReportStatus } from '../../domain/entities/report';
import {
  MODERATION_REPOSITORY,
  type ModerationRepository,
} from '../../domain/repositories/moderation.repository';
import type { ReportDto } from '../dto/report.dto';
import { ReportMapper } from '../mappers/report.mapper';

export type ResolveReportUseCaseInput = {
  reportId: string;
  moderatorId: string;
  status: Extract<ReportStatus, 'RESOLVED' | 'DISMISSED'>;
  resolution: string;
};

@Injectable()
export class ResolveReportUseCase {
  constructor(
    @Inject(MODERATION_REPOSITORY) private readonly moderationRepository: ModerationRepository,
  ) {}

  async execute(input: ResolveReportUseCaseInput): Promise<ReportDto> {
    const report = await this.moderationRepository.resolveReport(input);

    return ReportMapper.toDto(report);
  }
}
