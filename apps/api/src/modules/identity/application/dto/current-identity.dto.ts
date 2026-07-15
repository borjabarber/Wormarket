import type { AuthenticatedUser } from '../../domain/entities/identity-account';

export type CurrentIdentityDto = {
  user: AuthenticatedUser;
};
