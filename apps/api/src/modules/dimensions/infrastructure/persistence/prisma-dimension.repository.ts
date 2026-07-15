import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import type { Dimension } from '../../domain/entities/dimension';
import type { DimensionRepository } from '../../domain/repositories/dimension.repository';
import { PrismaDimensionMapper } from './prisma-dimension.mapper';

@Injectable()
export class PrismaDimensionRepository implements DimensionRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findAll(): Promise<Dimension[]> {
    const dimensions = await this.prisma.dimension.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return dimensions.map((dimension) => PrismaDimensionMapper.toDomain(dimension));
  }
}
