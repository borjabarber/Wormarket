import { getApiBaseUrl } from '../../../shared/api/api-config';
import type { TransactionSummary } from '../model/transaction-types';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export class TransactionsApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'TransactionsApiError';
  }
}

async function parseError(response: Response): Promise<TransactionsApiError> {
  let body: ApiErrorResponse = {};

  try {
    body = (await response.json()) as ApiErrorResponse;
  } catch {
    body = {};
  }

  return new TransactionsApiError(
    body.code ?? 'UNKNOWN_API_ERROR',
    body.message ?? 'No se pudieron cargar las transacciones.',
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
    throw new TransactionsApiError(
      'NETWORK_ERROR',
      'No se pudo conectar con la API local de Wormarket.',
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export const transactionsClient = {
  complete(transactionId: string, accessToken: string): Promise<TransactionSummary> {
    return request<TransactionSummary>(
      `/transactions/${encodeURIComponent(transactionId)}/complete`,
      accessToken,
      {
        method: 'POST',
      },
    );
  },
  listMine(accessToken: string): Promise<TransactionSummary[]> {
    return request<TransactionSummary[]>('/transactions', accessToken);
  },
};
