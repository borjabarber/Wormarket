import { getApiBaseUrl } from '../../../shared/api/api-config';
import type { CreateOfferInput, OfferSummary } from '../model/offer-types';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export class OffersApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'OffersApiError';
  }
}

async function parseError(response: Response): Promise<OffersApiError> {
  let body: ApiErrorResponse = {};

  try {
    body = (await response.json()) as ApiErrorResponse;
  } catch {
    body = {};
  }

  return new OffersApiError(
    body.code ?? 'UNKNOWN_API_ERROR',
    body.message ?? 'No se pudieron cargar las ofertas.',
    response.status,
  );
}

async function request<TResponse>(
  path: string,
  accessToken: string,
  options: RequestInit & {
    body?: string;
  } = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${accessToken}`);

  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new OffersApiError('NETWORK_ERROR', 'No se pudo conectar con la API local de Wormarket.');
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export const offersClient = {
  accept(offerId: string, accessToken: string): Promise<OfferSummary> {
    return request<OfferSummary>(`/offers/${encodeURIComponent(offerId)}/accept`, accessToken, {
      method: 'POST',
    });
  },
  cancel(offerId: string, accessToken: string): Promise<OfferSummary> {
    return request<OfferSummary>(`/offers/${encodeURIComponent(offerId)}/cancel`, accessToken, {
      method: 'POST',
    });
  },
  create(input: CreateOfferInput, accessToken: string): Promise<OfferSummary> {
    return request<OfferSummary>('/offers', accessToken, {
      body: JSON.stringify(input),
      method: 'POST',
    });
  },
  listForListing(listingSlug: string, accessToken: string): Promise<OfferSummary[]> {
    return request<OfferSummary[]>(
      `/listings/${encodeURIComponent(listingSlug)}/offers`,
      accessToken,
    );
  },
  listMine(accessToken: string): Promise<OfferSummary[]> {
    return request<OfferSummary[]>('/offers', accessToken);
  },
  reject(offerId: string, accessToken: string): Promise<OfferSummary> {
    return request<OfferSummary>(`/offers/${encodeURIComponent(offerId)}/reject`, accessToken, {
      method: 'POST',
    });
  },
};
