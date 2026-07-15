import type { Report } from '../../domain/entities/report';
import type { ReportDto } from '../dto/report.dto';

export class ReportMapper {
  static toDto(report: Report): ReportDto {
    return {
      id: report.id.toString(),
      reporter: report.reporter,
      targetType: report.targetType,
      listing: report.listing,
      reportedUser: report.reportedUser,
      reason: report.reason,
      description: report.description,
      status: report.status,
      resolution: report.resolution,
      resolvedBy: report.resolvedBy,
      resolvedAt: report.resolvedAt?.toISOString() ?? null,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
    };
  }
}
