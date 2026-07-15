import type { AuthenticatedUser } from '../../domain/entities/identity-account';

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

export type TokenKind = 'access' | 'refresh';

export type AuthTokenPayload = {
  sub: string;
  username: string;
  role: AuthenticatedUser['role'];
  kind: TokenKind;
};

export interface TokenService {
  issueAccessToken(user: AuthenticatedUser): string;
  issueRefreshToken(user: AuthenticatedUser): string;
  verify(token: string, expectedKind: TokenKind): AuthTokenPayload;
  hashRefreshToken(token: string): string;
}
