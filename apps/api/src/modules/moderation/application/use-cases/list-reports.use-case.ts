import { Inject, Injectable } from '@nestjs/common';

import {
  MODERATION_REPOSITORY,
  type ModerationRepository,
} from '../../domain/repositories/moderation.repository';
import type { ReportDto } from '../dto/report.dto';
import { ReportMapper } from '../mappers/report.mapper';

@Injectable()
export class ListReportsUseCase {
  constructor(
    @Inject(MODERATION_REPOSITORY) private readonly moderationRepository: ModerationRepository,
  ) {}

  async execute(): Promise<ReportDto[]> {
    const reports = await this.moderationRepository.findAllReports();

    return reports.map((report) => ReportMapper.toDto(report));
  }
}
