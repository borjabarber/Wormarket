import type {
  ReportListingSummary,
  ReportReason,
  ReportStatus,
  ReportTargetType,
  ReportUserSummary,
} from '../../domain/entities/report';

export type ReportDto = {
  id: string;
  reporter: ReportUserSummary;
  targetType: ReportTargetType;
  listing: ReportListingSummary | null;
  reportedUser: ReportUserSummary | null;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  resolution: string | null;
  resolvedBy: ReportUserSummary | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
