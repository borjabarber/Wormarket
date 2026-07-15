import type { AuthenticatedUser } from '../../domain/entities/identity-account';

export type AuthResponseDto = {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
};
