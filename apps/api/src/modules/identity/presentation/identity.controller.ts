import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  Inject,
  Post,
} from '@nestjs/common';

import type { AuthResponseDto } from '../application/dto/auth-response.dto';
import type { CurrentIdentityDto } from '../application/dto/current-identity.dto';
import type { LoginIdentityDto } from '../application/dto/login-identity.dto';
import type { RegisterIdentityDto } from '../application/dto/register-identity.dto';
import { IdentityError } from '../application/errors/identity-error';
import { GetCurrentIdentityUseCase } from '../application/use-cases/get-current-identity.use-case';
import { LoginIdentityUseCase } from '../application/use-cases/login-identity.use-case';
import { LogoutIdentityUseCase } from '../application/use-cases/logout-identity.use-case';
import { RefreshIdentityTokenUseCase } from '../application/use-cases/refresh-identity-token.use-case';
import { RegisterIdentityUseCase } from '../application/use-cases/register-identity.use-case';

@Controller('identity')
export class IdentityController {
  constructor(
    @Inject(RegisterIdentityUseCase)
    private readonly registerIdentityUseCase: RegisterIdentityUseCase,
    @Inject(LoginIdentityUseCase)
    private readonly loginIdentityUseCase: LoginIdentityUseCase,
    @Inject(RefreshIdentityTokenUseCase)
    private readonly refreshIdentityTokenUseCase: RefreshIdentityTokenUseCase,
    @Inject(GetCurrentIdentityUseCase)
    private readonly getCurrentIdentityUseCase: GetCurrentIdentityUseCase,
    @Inject(LogoutIdentityUseCase)
    private readonly logoutIdentityUseCase: LogoutIdentityUseCase,
  ) {}

  @Post('register')
  async register(@Body() body: unknown): Promise<AuthResponseDto> {
    return this.mapIdentityErrors(() =>
      this.registerIdentityUseCase.execute(this.parseRegisterBody(body)),
    );
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: unknown): Promise<AuthResponseDto> {
    return this.mapIdentityErrors(() =>
      this.loginIdentityUseCase.execute(this.parseLoginBody(body)),
    );
  }

  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() body: unknown): Promise<AuthResponseDto> {
    return this.mapIdentityErrors(() =>
      this.refreshIdentityTokenUseCase.execute(this.parseRefreshBody(body)),
    );
  }

  @Get('me')
  async me(
    @Headers('authorization') authorization: string | undefined,
  ): Promise<CurrentIdentityDto> {
    return this.mapIdentityErrors(() =>
      this.getCurrentIdentityUseCase.execute(this.parseBearerToken(authorization)),
    );
  }

  @HttpCode(204)
  @Post('logout')
  async logout(@Headers('authorization') authorization: string | undefined): Promise<void> {
    return this.mapIdentityErrors(() =>
      this.logoutIdentityUseCase.execute(this.parseBearerToken(authorization)),
    );
  }

  private parseRegisterBody(body: unknown): RegisterIdentityDto {
    if (!this.isRecord(body)) {
      throw this.invalidBodyError();
    }

    const { email, password, username, displayName, bio, homeDimensionSlug } = body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof username !== 'string' ||
      typeof displayName !== 'string' ||
      typeof bio !== 'string' ||
      typeof homeDimensionSlug !== 'string'
    ) {
      throw this.invalidBodyError();
    }

    return {
      email,
      password,
      username,
      displayName,
      bio,
      homeDimensionSlug,
    };
  }

  private parseLoginBody(body: unknown): LoginIdentityDto {
    if (!this.isRecord(body)) {
      throw this.invalidBodyError();
    }

    const { email, password } = body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw this.invalidBodyError();
    }

    return {
      email,
      password,
    };
  }

  private parseRefreshBody(body: unknown): string {
    if (!this.isRecord(body) || typeof body['refreshToken'] !== 'string') {
      throw this.invalidBodyError();
    }

    return body['refreshToken'];
  }

  private parseBearerToken(authorization: string | undefined): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new IdentityError(
        'INVALID_AUTHORIZATION_HEADER',
        'La cabecera de autorizacion no es valida.',
        401,
      );
    }

    return authorization.slice('Bearer '.length).trim();
  }

  private async mapIdentityErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof IdentityError) {
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
          },
          error.statusCode,
        );
      }

      throw error;
    }
  }

  private invalidBodyError(): BadRequestException {
    return new BadRequestException({
      code: 'INVALID_REQUEST_BODY',
      message: 'La solicitud no es valida.',
    });
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }
}
