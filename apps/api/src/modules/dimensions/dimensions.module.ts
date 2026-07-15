import { Module } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ListDimensionsUseCase } from './application/use-cases/list-dimensions.use-case';
import { DIMENSION_REPOSITORY } from './domain/repositories/dimension.repository';
import { PrismaDimensionRepository } from './infrastructure/persistence/prisma-dimension.repository';
import { DimensionsController } from './presentation/dimensions.controller';

@Module({
  controllers: [DimensionsController],
  providers: [
    PrismaService,
    ListDimensionsUseCase,
    {
      provide: DIMENSION_REPOSITORY,
      useClass: PrismaDimensionRepository,
    },
  ],
})
export class DimensionsModule {}
