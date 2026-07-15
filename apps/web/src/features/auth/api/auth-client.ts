import type {
  AuthSession,
  AuthenticatedUser,
  LoginIdentityInput,
  RegisterIdentityInput,
} from '../model/auth-types';
import { AuthApiError, type ApiErrorCode } from '../model/auth-types';
import { getApiBaseUrl } from '../../../shared/api/api-config';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

type CurrentIdentityResponse = {
  user: AuthenticatedUser;
};

async function parseError(response: Response): Promise<AuthApiError> {
  let body: ApiErrorResponse = {};

  try {
    body = (await response.json()) as ApiErrorResponse;
  } catch {
    body = {};
  }

  return new AuthApiError(
    (body.code ?? 'UNKNOWN_API_ERROR') as ApiErrorCode,
    body.message ?? 'No se pudo completar la operacion.',
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
    throw new AuthApiError('NETWORK_ERROR', 'No se pudo conectar con la API local de Wormarket.');
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export const authClient = {
  getMe(accessToken: string): Promise<CurrentIdentityResponse> {
    return request<CurrentIdentityResponse>('/identity/me', {
      accessToken,
      method: 'GET',
    });
  },
  login(input: LoginIdentityInput): Promise<AuthSession> {
    return request<AuthSession>('/identity/login', {
      body: JSON.stringify(input),
      method: 'POST',
    });
  },
  logout(accessToken: string): Promise<void> {
    return request<void>('/identity/logout', {
      accessToken,
      method: 'POST',
    });
  },
  refresh(refreshToken: string): Promise<AuthSession> {
    return request<AuthSession>('/identity/refresh', {
      body: JSON.stringify({ refreshToken }),
      method: 'POST',
    });
  },
  register(input: RegisterIdentityInput): Promise<AuthSession> {
    return request<AuthSession>('/identity/register', {
      body: JSON.stringify(input),
      method: 'POST',
    });
  },
};
