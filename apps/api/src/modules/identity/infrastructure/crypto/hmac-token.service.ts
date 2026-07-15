import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../../domain/entities/identity-account';
import { IdentityError } from '../../application/errors/identity-error';
import type {
  AuthTokenPayload,
  TokenKind,
  TokenService,
} from '../../application/ports/token-service';

type JwtPayload = AuthTokenPayload & {
  exp: number;
  iat: number;
  jti: string;
};

const accessTokenTtlSeconds = 15 * 60;
const refreshTokenTtlSeconds = 7 * 24 * 60 * 60;

@Injectable()
export class HmacTokenService implements TokenService {
  issueAccessToken(user: AuthenticatedUser): string {
    return this.sign(
      {
        sub: user.id,
        username: user.username,
        role: user.role,
        kind: 'access',
      },
      accessTokenTtlSeconds,
      this.getSecret('JWT_ACCESS_SECRET'),
    );
  }

  issueRefreshToken(user: AuthenticatedUser): string {
    return this.sign(
      {
        sub: user.id,
        username: user.username,
        role: user.role,
        kind: 'refresh',
      },
      refreshTokenTtlSeconds,
      this.getSecret('JWT_REFRESH_SECRET'),
    );
  }

  verify(token: string, expectedKind: TokenKind): AuthTokenPayload {
    const secret =
      expectedKind === 'access'
        ? this.getSecret('JWT_ACCESS_SECRET')
        : this.getSecret('JWT_REFRESH_SECRET');
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw this.invalidTokenError(expectedKind);
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    if (!encodedHeader || !encodedPayload || !signature) {
      throw this.invalidTokenError(expectedKind);
    }

    const expectedSignature = this.signPart(`${encodedHeader}.${encodedPayload}`, secret);
    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedSignatureBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
      throw this.invalidTokenError(expectedKind);
    }

    const payload = this.parsePayload(encodedPayload);
    const now = Math.floor(Date.now() / 1000);

    if (payload.kind !== expectedKind || payload.exp <= now) {
      throw this.invalidTokenError(expectedKind);
    }

    return {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
      kind: payload.kind,
    };
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('base64url');
  }

  private sign(payload: AuthTokenPayload, ttlSeconds: number, secret: string): string {
    const now = Math.floor(Date.now() / 1000);
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };
    const jwtPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp: now + ttlSeconds,
      jti: randomUUID(),
    };
    const encodedHeader = this.encodeJson(header);
    const encodedPayload = this.encodeJson(jwtPayload);
    const signature = this.signPart(`${encodedHeader}.${encodedPayload}`, secret);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private signPart(value: string, secret: string): string {
    return createHmac('sha256', secret).update(value).digest('base64url');
  }

  private encodeJson(value: object): string {
    return Buffer.from(JSON.stringify(value)).toString('base64url');
  }

  private parsePayload(encodedPayload: string): JwtPayload {
    try {
      const payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      ) as unknown;

      if (!this.isJwtPayload(payload)) {
        throw new Error('Invalid payload.');
      }

      return payload;
    } catch {
      throw new IdentityError('INVALID_CREDENTIALS', 'La sesion no es valida.', 401);
    }
  }

  private isJwtPayload(value: unknown): value is JwtPayload {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const payload = value as Record<string, unknown>;

    return (
      typeof payload['sub'] === 'string' &&
      typeof payload['username'] === 'string' &&
      (payload['role'] === 'USER' ||
        payload['role'] === 'MODERATOR' ||
        payload['role'] === 'ADMIN') &&
      (payload['kind'] === 'access' || payload['kind'] === 'refresh') &&
      typeof payload['exp'] === 'number' &&
      typeof payload['iat'] === 'number' &&
      typeof payload['jti'] === 'string'
    );
  }

  private getSecret(name: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET'): string {
    const secret = process.env[name]?.trim();

    if (!secret) {
      throw new IdentityError(
        'AUTH_CONFIGURATION_MISSING',
        'La autenticacion no esta configurada.',
        500,
      );
    }

    return secret;
  }

  private invalidTokenError(kind: TokenKind): IdentityError {
    return new IdentityError(
      kind === 'refresh' ? 'INVALID_REFRESH_TOKEN' : 'INVALID_CREDENTIALS',
      kind === 'refresh' ? 'La sesion no es valida.' : 'La sesion no es valida.',
      401,
    );
  }
}
