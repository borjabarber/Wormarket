import { getApiBaseUrl } from '../../../shared/api/api-config';
import type { ListingSummary, SaveListingInput } from '../model/listing-types';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export class ListingsApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'ListingsApiError';
  }
}

async function parseError(response: Response): Promise<ListingsApiError> {
  let body: ApiErrorResponse = {};

  try {
    body = (await response.json()) as ApiErrorResponse;
  } catch {
    body = {};
  }

  return new ListingsApiError(
    body.code ?? 'UNKNOWN_API_ERROR',
    body.message ?? 'No se pudieron cargar los anuncios.',
    response.status,
  );
}

async function request<TResponse>(
  path: string,
  options: RequestInit & {
    accessToken?: string;
    body?: string;
  } = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');

  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ListingsApiError(
      'NETWORK_ERROR',
      'No se pudo conectar con la API local de Wormarket.',
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export const listingsClient = {
  create(input: SaveListingInput, accessToken: string): Promise<ListingSummary> {
    return request<ListingSummary>('/listings', {
      accessToken,
      body: JSON.stringify(input),
      method: 'POST',
    });
  },
  getBySlug(slug: string): Promise<ListingSummary> {
    return request<ListingSummary>(`/listings/${encodeURIComponent(slug)}`);
  },
  list(): Promise<ListingSummary[]> {
    return request<ListingSummary[]>('/listings');
  },
  update(slug: string, input: SaveListingInput, accessToken: string): Promise<ListingSummary> {
    return request<ListingSummary>(`/listings/${encodeURIComponent(slug)}`, {
      accessToken,
      body: JSON.stringify(input),
      method: 'PATCH',
    });
  },
};
