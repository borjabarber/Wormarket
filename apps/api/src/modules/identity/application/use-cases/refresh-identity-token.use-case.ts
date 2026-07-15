import { timingSafeEqual } from 'node:crypto';

import { Inject, Injectable } from '@nestjs/common';

import {
  IDENTITY_REPOSITORY,
  type IdentityRepository,
} from '../../domain/repositories/identity.repository';
import type { AuthResponseDto } from '../dto/auth-response.dto';
import { IdentityError } from '../errors/identity-error';
import { TOKEN_SERVICE, type TokenService } from '../ports/token-service';
import { createAuthResponse } from './auth-response.factory';

@Injectable()
export class RefreshIdentityTokenUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(refreshToken: string): Promise<AuthResponseDto> {
    const payload = this.tokenService.verify(refreshToken, 'refresh');
    const account = await this.identityRepository.findByUserId(payload.sub);
    const refreshTokenHash = this.tokenService.hashRefreshToken(refreshToken);

    if (
      !account?.refreshTokenHash ||
      !this.isSameTokenHash(account.refreshTokenHash, refreshTokenHash)
    ) {
      throw new IdentityError('INVALID_REFRESH_TOKEN', 'La sesion no es valida.', 401);
    }

    const response = createAuthResponse(account, this.tokenService);

    await this.identityRepository.saveRefreshTokenHash(
      account.user.id,
      this.tokenService.hashRefreshToken(response.refreshToken),
    );

    return response;
  }

  private isSameTokenHash(expectedHash: string, candidateHash: string): boolean {
    const expectedBuffer = Buffer.from(expectedHash);
    const candidateBuffer = Buffer.from(candidateHash);

    return (
      expectedBuffer.length === candidateBuffer.length &&
      timingSafeEqual(expectedBuffer, candidateBuffer)
    );
  }
}
