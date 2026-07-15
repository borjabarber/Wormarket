import type {
  Listing as PrismaListing,
  Report as PrismaReport,
  User as PrismaUser,
} from '../../../../generated/prisma/client';
import { Report } from '../../domain/entities/report';

type ReportUserRecord = Pick<PrismaUser, 'id' | 'username' | 'displayName'>;
type ReportListingRecord = Pick<PrismaListing, 'id' | 'slug' | 'title' | 'status'>;

export type PrismaReportWithRelations = PrismaReport & {
  reporter: ReportUserRecord;
  listing: ReportListingRecord | null;
  reportedUser: ReportUserRecord | null;
  resolvedBy: ReportUserRecord | null;
};

export class PrismaReportMapper {
  static toDomain(record: PrismaReportWithRelations): Report {
    return Report.create({
      id: record.id,
      reporter: {
        id: record.reporter.id,
        username: record.reporter.username,
        displayName: record.reporter.displayName,
      },
      targetType: record.targetType,
      listing: record.listing
        ? {
            id: record.listing.id,
            slug: record.listing.slug,
            title: record.listing.title,
            status: record.listing.status,
          }
        : null,
      reportedUser: record.reportedUser
        ? {
            id: record.reportedUser.id,
            username: record.reportedUser.username,
            displayName: record.reportedUser.displayName,
          }
        : null,
      reason: record.reason,
      description: record.description,
      status: record.status,
      resolution: record.resolution,
      resolvedBy: record.resolvedBy
        ? {
            id: record.resolvedBy.id,
            username: record.resolvedBy.username,
            displayName: record.resolvedBy.displayName,
          }
        : null,
      resolvedAt: record.resolvedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
