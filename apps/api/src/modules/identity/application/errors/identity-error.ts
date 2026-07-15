export type IdentityErrorCode =
  | 'AUTH_CONFIGURATION_MISSING'
  | 'DIMENSION_NOT_FOUND'
  | 'EMAIL_ALREADY_REGISTERED'
  | 'INVALID_AUTHORIZATION_HEADER'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_REFRESH_TOKEN'
  | 'PASSWORD_TOO_WEAK'
  | 'USERNAME_ALREADY_REGISTERED';

export class IdentityError extends Error {
  constructor(
    readonly code: IdentityErrorCode,
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}
