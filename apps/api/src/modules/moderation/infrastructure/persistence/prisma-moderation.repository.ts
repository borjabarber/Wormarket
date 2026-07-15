import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import type { Report } from '../../domain/entities/report';
import type {
  CreateReportInput,
  ModerationRepository,
  ResolveReportInput,
} from '../../domain/repositories/moderation.repository';
import { ModerationError } from '../../application/errors/moderation-error';
import { PrismaReportMapper } from './prisma-report.mapper';

const reportInclude = {
  reporter: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
  listing: {
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
    },
  },
  reportedUser: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
  resolvedBy: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
};

@Injectable()
export class PrismaModerationRepository implements ModerationRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async createListingReport(input: CreateReportInput & { listingSlug: string }): Promise<Report> {
    const [reporter, listing] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: input.reporterId,
        },
        select: {
          id: true,
        },
      }),
      this.prisma.listing.findUnique({
        where: {
          slug: input.listingSlug,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!reporter) {
      throw new ModerationError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    if (!listing) {
      throw new ModerationError('LISTING_NOT_FOUND', 'El anuncio no existe.', 404);
    }

    const report = await this.prisma.report.create({
      data: {
        reporterId: reporter.id,
        targetType: 'LISTING',
        listingId: listing.id,
        reason: input.reason,
        description: input.description,
      },
      include: reportInclude,
    });

    return PrismaReportMapper.toDomain(report);
  }

  async createUserReport(input: CreateReportInput & { username: string }): Promise<Report> {
    const [reporter, reportedUser] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: input.reporterId,
        },
        select: {
          id: true,
        },
      }),
      this.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!reporter) {
      throw new ModerationError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    if (!reportedUser) {
      throw new ModerationError('USER_NOT_FOUND', 'El usuario denunciado no existe.', 404);
    }

    if (reporter.id === reportedUser.id) {
      throw new ModerationError('USER_REPORT_SELF', 'No puedes denunciar tu propio perfil.', 400);
    }

    const report = await this.prisma.report.create({
      data: {
        reporterId: reporter.id,
        targetType: 'USER',
        reportedUserId: reportedUser.id,
        reason: input.reason,
        description: input.description,
      },
      include: reportInclude,
    });

    return PrismaReportMapper.toDomain(report);
  }

  async findAllReports(): Promise<Report[]> {
    const reports = await this.prisma.report.findMany({
      include: reportInclude,
      orderBy: [
        {
          status: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return reports.map((report) => PrismaReportMapper.toDomain(report));
  }

  async resolveReport(input: ResolveReportInput): Promise<Report> {
    const [report, moderator] = await Promise.all([
      this.prisma.report.findUnique({
        where: {
          id: input.reportId,
        },
        select: {
          id: true,
        },
      }),
      this.prisma.user.findUnique({
        where: {
          id: input.moderatorId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!report) {
      throw new ModerationError('REPORT_NOT_FOUND', 'La denuncia no existe.', 404);
    }

    if (!moderator) {
      throw new ModerationError('USER_NOT_FOUND', 'El moderador no existe.', 404);
    }

    const updatedReport = await this.prisma.report.update({
      where: {
        id: report.id,
      },
      data: {
        status: input.status,
        resolution: input.resolution,
        resolvedById: moderator.id,
        resolvedAt: new Date(),
      },
      include: reportInclude,
    });

    return PrismaReportMapper.toDomain(updatedReport);
  }

  async blockListing(slug: string): Promise<boolean> {
    const listing = await this.prisma.listing.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (!listing) {
      return false;
    }

    await this.prisma.listing.update({
      where: {
        id: listing.id,
      },
      data: {
        status: 'BLOCKED',
      },
    });

    return true;
  }

  async blockUser(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'BLOCKED',
      },
    });

    return true;
  }
}
