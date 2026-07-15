import { Inject, Injectable } from '@nestjs/common';

import type { ReportReason } from '../../domain/entities/report';
import {
  MODERATION_REPOSITORY,
  type ModerationRepository,
} from '../../domain/repositories/moderation.repository';
import type { ReportDto } from '../dto/report.dto';
import { ReportMapper } from '../mappers/report.mapper';

export type ReportUserInput = {
  username: string;
  reason: ReportReason;
  description: string;
};

@Injectable()
export class ReportUserUseCase {
  constructor(
    @Inject(MODERATION_REPOSITORY) private readonly moderationRepository: ModerationRepository,
  ) {}

  async execute(reporterId: string, input: ReportUserInput): Promise<ReportDto> {
    const report = await this.moderationRepository.createUserReport({
      reporterId,
      username: input.username,
      reason: input.reason,
      description: input.description,
    });

    return ReportMapper.toDto(report);
  }
}
