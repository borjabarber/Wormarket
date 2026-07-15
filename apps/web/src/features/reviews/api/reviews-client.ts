import { getApiBaseUrl } from '../../../shared/api/api-config';
import type { CreateReviewInput, ReviewSummary } from '../model/review-types';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export class ReviewsApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'ReviewsApiError';
  }
}

async function parseError(response: Response): Promise<ReviewsApiError> {
  let body: ApiErrorResponse = {};

  try {
    body = (await response.json()) as ApiErrorResponse;
  } catch {
    body = {};
  }

  return new ReviewsApiError(
    body.code ?? 'UNKNOWN_API_ERROR',
    body.message ?? 'No se pudieron cargar las valoraciones.',
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
    throw new ReviewsApiError(
      'NETWORK_ERROR',
      'No se pudo conectar con la API local de Wormarket.',
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export const reviewsClient = {
  create(input: CreateReviewInput, accessToken: string): Promise<ReviewSummary> {
    return request<ReviewSummary>('/reviews', {
      accessToken,
      body: JSON.stringify(input),
      method: 'POST',
    });
  },
  listForUser(username: string): Promise<ReviewSummary[]> {
    return request<ReviewSummary[]>(`/users/${encodeURIComponent(username)}/reviews`);
  },
};
