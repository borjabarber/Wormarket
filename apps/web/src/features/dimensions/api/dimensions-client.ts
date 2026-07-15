import { getApiBaseUrl } from '../../../shared/api/api-config';
import type { DimensionSummary } from '../model/dimension-types';

export class DimensionsApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DimensionsApiError';
  }
}

export const dimensionsClient = {
  async list(): Promise<DimensionSummary[]> {
    let response: Response;

    try {
      response = await fetch(`${getApiBaseUrl()}/dimensions`, {
        headers: {
          Accept: 'application/json',
        },
      });
    } catch {
      throw new DimensionsApiError('No se pudo conectar con la API local de Wormarket.');
    }

    if (!response.ok) {
      throw new DimensionsApiError('No se pudieron cargar las dimensiones.');
    }

    return (await response.json()) as DimensionSummary[];
  },
};
