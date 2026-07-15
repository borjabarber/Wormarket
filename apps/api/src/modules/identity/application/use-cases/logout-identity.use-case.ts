import { Inject, Injectable } from '@nestjs/common';

import {
  IDENTITY_REPOSITORY,
  type IdentityRepository,
} from '../../domain/repositories/identity.repository';
import { TOKEN_SERVICE, type TokenService } from '../ports/token-service';

@Injectable()
export class LogoutIdentityUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(accessToken: string): Promise<void> {
    const payload = this.tokenService.verify(accessToken, 'access');

    await this.identityRepository.clearRefreshTokenHash(payload.sub);
  }
}
