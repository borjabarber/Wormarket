import { Inject, Injectable } from '@nestjs/common';

import {
  IDENTITY_REPOSITORY,
  type IdentityRepository,
} from '../../domain/repositories/identity.repository';
import type { AuthResponseDto } from '../dto/auth-response.dto';
import type { LoginIdentityDto } from '../dto/login-identity.dto';
import { IdentityError } from '../errors/identity-error';
import { PASSWORD_HASHER, type PasswordHasher } from '../ports/password-hasher';
import { TOKEN_SERVICE, type TokenService } from '../ports/token-service';
import { createAuthResponse } from './auth-response.factory';

@Injectable()
export class LoginIdentityUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginIdentityDto): Promise<AuthResponseDto> {
    const account = await this.identityRepository.findByEmail(input.email.trim().toLowerCase());

    if (!account || !this.passwordHasher.verify(input.password, account.passwordHash)) {
      throw new IdentityError('INVALID_CREDENTIALS', 'Email o contrasena incorrectos.', 401);
    }

    const response = createAuthResponse(account, this.tokenService);

    await this.identityRepository.saveRefreshTokenHash(
      account.user.id,
      this.tokenService.hashRefreshToken(response.refreshToken),
    );

    return response;
  }
}
