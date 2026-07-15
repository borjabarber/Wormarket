import type { Report, ReportReason, ReportStatus } from '../entities/report';

export const MODERATION_REPOSITORY = Symbol('MODERATION_REPOSITORY');

export type CreateReportInput = {
  reporterId: string;
  reason: ReportReason;
  description: string;
};

export type ResolveReportInput = {
  reportId: string;
  moderatorId: string;
  status: Extract<ReportStatus, 'RESOLVED' | 'DISMISSED'>;
  resolution: string;
};

export interface ModerationRepository {
  createListingReport(input: CreateReportInput & { listingSlug: string }): Promise<Report>;
  createUserReport(input: CreateReportInput & { username: string }): Promise<Report>;
  findAllReports(): Promise<Report[]>;
  resolveReport(input: ResolveReportInput): Promise<Report>;
  blockListing(slug: string): Promise<boolean>;
  blockUser(username: string): Promise<boolean>;
}
