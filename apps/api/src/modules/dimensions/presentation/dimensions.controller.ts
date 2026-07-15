import { Controller, Get, Inject } from '@nestjs/common';

import type { DimensionDto } from '../application/dto/dimension.dto';
import { ListDimensionsUseCase } from '../application/use-cases/list-dimensions.use-case';

@Controller('dimensions')
export class DimensionsController {
  constructor(
    @Inject(ListDimensionsUseCase)
    private readonly listDimensionsUseCase: ListDimensionsUseCase,
  ) {}

  @Get()
  async listDimensions(): Promise<DimensionDto[]> {
    return this.listDimensionsUseCase.execute();
  }
}
