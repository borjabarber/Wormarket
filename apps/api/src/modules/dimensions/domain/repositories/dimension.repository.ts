import type { Dimension } from '../entities/dimension';

export const DIMENSION_REPOSITORY = Symbol('DIMENSION_REPOSITORY');

export interface DimensionRepository {
  findAll(): Promise<Dimension[]>;
}
