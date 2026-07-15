import { Inject, Injectable } from '@nestjs/common';

import {
  DIMENSION_REPOSITORY,
  type DimensionRepository,
} from '../../domain/repositories/dimension.repository';
import type { DimensionDto } from '../dto/dimension.dto';
import { DimensionMapper } from '../mappers/dimension.mapper';

@Injectable()
export class ListDimensionsUseCase {
  constructor(
    @Inject(DIMENSION_REPOSITORY)
    private readonly dimensionRepository: DimensionRepository,
  ) {}

  async execute(): Promise<DimensionDto[]> {
    const dimensions = await this.dimensionRepository.findAll();

    return dimensions.map((dimension) => DimensionMapper.toDto(dimension));
  }
}
