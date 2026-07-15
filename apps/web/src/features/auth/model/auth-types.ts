export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

export type AuthenticatedUser = {
  displayName: string;
  id: string;
  role: UserRole;
  username: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSession = AuthTokens & {
  user: AuthenticatedUser;
};

export type LoginIdentityInput = {
  email: string;
  password: string;
};

export type RegisterIdentityInput = LoginIdentityInput & {
  bio: string;
  displayName: string;
  homeDimensionSlug: string;
  username: string;
};

export type ApiErrorCode =
  | 'AUTH_CONFIGURATION_MISSING'
  | 'DIMENSION_NOT_FOUND'
  | 'EMAIL_ALREADY_REGISTERED'
  | 'INVALID_AUTHORIZATION_HEADER'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_REFRESH_TOKEN'
  | 'PASSWORD_TOO_WEAK'
  | 'USERNAME_ALREADY_REGISTERED'
  | 'INVALID_REQUEST_BODY'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_API_ERROR';

export class AuthApiError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
  }
}
