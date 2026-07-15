import { Inject, Injectable } from '@nestjs/common';

import {
  IDENTITY_REPOSITORY,
  type IdentityRepository,
} from '../../domain/repositories/identity.repository';
import type { AuthResponseDto } from '../dto/auth-response.dto';
import type { RegisterIdentityDto } from '../dto/register-identity.dto';
import { IdentityError } from '../errors/identity-error';
import { PASSWORD_HASHER, type PasswordHasher } from '../ports/password-hasher';
import { TOKEN_SERVICE, type TokenService } from '../ports/token-service';
import { createAuthResponse } from './auth-response.factory';

@Injectable()
export class RegisterIdentityUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: RegisterIdentityDto): Promise<AuthResponseDto> {
    if (
      input.password.length < 8 ||
      !/[a-zA-Z]/.test(input.password) ||
      !/\d/.test(input.password)
    ) {
      throw new IdentityError(
        'PASSWORD_TOO_WEAK',
        'La contrasena debe tener al menos 8 caracteres, una letra y un numero.',
        400,
      );
    }

    const email = input.email.trim().toLowerCase();
    const username = input.username.trim().toLowerCase();

    if (await this.identityRepository.findByEmail(email)) {
      throw new IdentityError('EMAIL_ALREADY_REGISTERED', 'El email ya esta registrado.', 409);
    }

    if (await this.identityRepository.usernameExists(username)) {
      throw new IdentityError(
        'USERNAME_ALREADY_REGISTERED',
        'El nombre de usuario ya existe.',
        409,
      );
    }

    const account = await this.identityRepository.register({
      email,
      passwordHash: this.passwordHasher.hash(input.password),
      username,
      displayName: input.displayName,
      bio: input.bio,
      homeDimensionSlug: input.homeDimensionSlug,
    });
    const response = createAuthResponse(account, this.tokenService);

    await this.identityRepository.saveRefreshTokenHash(
      account.user.id,
      this.tokenService.hashRefreshToken(response.refreshToken),
    );

    return response;
  }
}
