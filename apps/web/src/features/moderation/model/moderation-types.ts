export const reportReasons = ['FORBIDDEN_OBJECT', 'FRAUD', 'HARASSMENT', 'SPAM', 'OTHER'] as const;
export const reportStatuses = ['PENDING', 'RESOLVED', 'DISMISSED'] as const;
export const reportTargetTypes = ['LISTING', 'USER'] as const;

export type ReportReason = (typeof reportReasons)[number];
export type ReportStatus = (typeof reportStatuses)[number];
export type ReportTargetType = (typeof reportTargetTypes)[number];

export type ReportUserSummary = {
  displayName: string;
  id: string;
  username: string;
};

export type ReportListingSummary = {
  id: string;
  slug: string;
  status: string;
  title: string;
};

export type ReportSummary = {
  createdAt: string;
  description: string;
  id: string;
  listing: ReportListingSummary | null;
  reason: ReportReason;
  reportedUser: ReportUserSummary | null;
  reporter: ReportUserSummary;
  resolution: string | null;
  resolvedAt: string | null;
  resolvedBy: ReportUserSummary | null;
  status: ReportStatus;
  targetType: ReportTargetType;
  updatedAt: string;
};

export type CreateReportInput = {
  description: string;
  reason: ReportReason;
};

export type ResolveReportInput = {
  resolution: string;
  status: Extract<ReportStatus, 'RESOLVED' | 'DISMISSED'>;
};

export type BlockListingResult = {
  listingId: string;
  slug: string;
  status: string;
};

export type BlockUserResult = {
  status: string;
  userId: string;
  username: string;
};
