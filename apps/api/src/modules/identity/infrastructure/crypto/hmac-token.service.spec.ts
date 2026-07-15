import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { HmacTokenService } from './hmac-token.service';

const originalAccessSecret = process.env['JWT_ACCESS_SECRET'];
const originalRefreshSecret = process.env['JWT_REFRESH_SECRET'];

describe('HmacTokenService', () => {
  beforeEach(() => {
    process.env['JWT_ACCESS_SECRET'] = 'local-access-secret-for-tests';
    process.env['JWT_REFRESH_SECRET'] = 'local-refresh-secret-for-tests';
  });

  afterEach(() => {
    process.env['JWT_ACCESS_SECRET'] = originalAccessSecret;
    process.env['JWT_REFRESH_SECRET'] = originalRefreshSecret;
  });

  it('issues and verifies access and refresh tokens', () => {
    const service = new HmacTokenService();
    const user = {
      id: 'user-1',
      username: 'lyra-oraculo',
      displayName: 'Lyra del Oraculo',
      role: 'USER' as const,
    };

    const accessToken = service.issueAccessToken(user);
    const refreshToken = service.issueRefreshToken(user);

    expect(service.verify(accessToken, 'access')).toMatchObject({
      sub: 'user-1',
      username: 'lyra-oraculo',
      kind: 'access',
    });
    expect(service.verify(refreshToken, 'refresh')).toMatchObject({
      sub: 'user-1',
      kind: 'refresh',
    });
  });

  it('rejects tokens verified with the wrong kind', () => {
    const service = new HmacTokenService();
    const refreshToken = service.issueRefreshToken({
      id: 'user-1',
      username: 'lyra-oraculo',
      displayName: 'Lyra del Oraculo',
      role: 'USER',
    });

    expect(() => service.verify(refreshToken, 'access')).toThrow('La sesion no es valida.');
  });
});
