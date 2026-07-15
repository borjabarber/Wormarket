import { Inject, Injectable } from '@nestjs/common';

import {
  IDENTITY_REPOSITORY,
  type IdentityRepository,
} from '../../domain/repositories/identity.repository';
import type { CurrentIdentityDto } from '../dto/current-identity.dto';
import { IdentityError } from '../errors/identity-error';
import { TOKEN_SERVICE, type TokenService } from '../ports/token-service';

@Injectable()
export class GetCurrentIdentityUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(accessToken: string): Promise<CurrentIdentityDto> {
    const payload = this.tokenService.verify(accessToken, 'access');
    const account = await this.identityRepository.findByUserId(payload.sub);

    if (!account) {
      throw new IdentityError('INVALID_CREDENTIALS', 'La sesion no es valida.', 401);
    }

    return {
      user: account.user,
    };
  }
}
