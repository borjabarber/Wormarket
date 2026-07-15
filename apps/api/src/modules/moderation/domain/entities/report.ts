import { ReportId } from '../value-objects/report-id';

export const reportTargetTypes = ['LISTING', 'USER'] as const;
export const reportReasons = ['FORBIDDEN_OBJECT', 'FRAUD', 'HARASSMENT', 'SPAM', 'OTHER'] as const;
export const reportStatuses = ['PENDING', 'RESOLVED', 'DISMISSED'] as const;

export type ReportTargetType = (typeof reportTargetTypes)[number];
export type ReportReason = (typeof reportReasons)[number];
export type ReportStatus = (typeof reportStatuses)[number];

export type ReportUserSummary = {
  id: string;
  username: string;
  displayName: string;
};

export type ReportListingSummary = {
  id: string;
  slug: string;
  title: string;
  status: string;
};

type ReportProperties = {
  id: ReportId;
  reporter: ReportUserSummary;
  targetType: ReportTargetType;
  listing: ReportListingSummary | null;
  reportedUser: ReportUserSummary | null;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  resolution: string | null;
  resolvedBy: ReportUserSummary | null;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateReportInput = Omit<ReportProperties, 'id'> & {
  id: string;
};

export class Report {
  private constructor(private readonly properties: ReportProperties) {}

  static create(input: CreateReportInput): Report {
    const description = input.description.trim();
    const resolution = input.resolution?.trim() || null;

    if (!reportTargetTypes.includes(input.targetType)) {
      throw new Error('Report target type is not supported.');
    }

    if (!reportReasons.includes(input.reason)) {
      throw new Error('Report reason is not supported.');
    }

    if (!reportStatuses.includes(input.status)) {
      throw new Error('Report status is not supported.');
    }

    if (description.length < 10 || description.length > 1000) {
      throw new Error('Report description must contain between 10 and 1000 characters.');
    }

    if (input.targetType === 'LISTING' && !input.listing) {
      throw new Error('Listing report must include a listing target.');
    }

    if (input.targetType === 'USER' && !input.reportedUser) {
      throw new Error('User report must include a user target.');
    }

    return new Report({
      ...input,
      id: ReportId.create(input.id),
      description,
      resolution,
      reporter: { ...input.reporter },
      listing: input.listing ? { ...input.listing } : null,
      reportedUser: input.reportedUser ? { ...input.reportedUser } : null,
      resolvedBy: input.resolvedBy ? { ...input.resolvedBy } : null,
    });
  }

  get id(): ReportId {
    return this.properties.id;
  }

  get reporter(): ReportUserSummary {
    return { ...this.properties.reporter };
  }

  get targetType(): ReportTargetType {
    return this.properties.targetType;
  }

  get listing(): ReportListingSummary | null {
    return this.properties.listing ? { ...this.properties.listing } : null;
  }

  get reportedUser(): ReportUserSummary | null {
    return this.properties.reportedUser ? { ...this.properties.reportedUser } : null;
  }

  get reason(): ReportReason {
    return this.properties.reason;
  }

  get description(): string {
    return this.properties.description;
  }

  get status(): ReportStatus {
    return this.properties.status;
  }

  get resolution(): string | null {
    return this.properties.resolution;
  }

  get resolvedBy(): ReportUserSummary | null {
    return this.properties.resolvedBy ? { ...this.properties.resolvedBy } : null;
  }

  get resolvedAt(): Date | null {
    return this.properties.resolvedAt;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
