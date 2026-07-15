import { getApiBaseUrl } from '../../../shared/api/api-config';
import type { FavoriteSummary } from '../model/favorite-types';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export class FavoritesApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'FavoritesApiError';
  }
}

async function parseError(response: Response): Promise<FavoritesApiError> {
  let body: ApiErrorResponse = {};

  try {
    body = (await response.json()) as ApiErrorResponse;
  } catch {
    body = {};
  }

  return new FavoritesApiError(
    body.code ?? 'UNKNOWN_API_ERROR',
    body.message ?? 'No se pudieron cargar los favoritos.',
    response.status,
  );
}

async function request<TResponse>(
  path: string,
  accessToken: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${accessToken}`);

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new FavoritesApiError(
      'NETWORK_ERROR',
      'No se pudo conectar con la API local de Wormarket.',
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export const favoritesClient = {
  add(listingSlug: string, accessToken: string): Promise<FavoriteSummary> {
    return request<FavoriteSummary>(`/favorites/${encodeURIComponent(listingSlug)}`, accessToken, {
      method: 'POST',
    });
  },
  list(accessToken: string): Promise<FavoriteSummary[]> {
    return request<FavoriteSummary[]>('/favorites', accessToken);
  },
  remove(listingSlug: string, accessToken: string): Promise<void> {
    return request<void>(`/favorites/${encodeURIComponent(listingSlug)}`, accessToken, {
      method: 'DELETE',
    });
  },
};
