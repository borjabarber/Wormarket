import { getApiBaseUrl } from '../../../shared/api/api-config';
import type { UserProfile } from '../model/user-types';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export class UsersApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'UsersApiError';
  }
}

async function parseError(response: Response): Promise<UsersApiError> {
  let body: ApiErrorResponse = {};

  try {
    body = (await response.json()) as ApiErrorResponse;
  } catch {
    body = {};
  }

  return new UsersApiError(
    body.code ?? 'UNKNOWN_API_ERROR',
    body.message ?? 'No se pudo cargar el perfil.',
    response.status,
  );
}

async function request<TResponse>(path: string): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: {
        Accept: 'application/json',
      },
    });
  } catch {
    throw new UsersApiError('NETWORK_ERROR', 'No se pudo conectar con la API local de Wormarket.');
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export const usersClient = {
  getByUsername(username: string): Promise<UserProfile> {
    return request<UserProfile>(`/users/${encodeURIComponent(username)}`);
  },
};
