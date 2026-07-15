import { Module } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { GetCurrentIdentityUseCase } from './application/use-cases/get-current-identity.use-case';
import { LoginIdentityUseCase } from './application/use-cases/login-identity.use-case';
import { LogoutIdentityUseCase } from './application/use-cases/logout-identity.use-case';
import { RefreshIdentityTokenUseCase } from './application/use-cases/refresh-identity-token.use-case';
import { RegisterIdentityUseCase } from './application/use-cases/register-identity.use-case';
import { IDENTITY_REPOSITORY } from './domain/repositories/identity.repository';
import { HmacTokenService } from './infrastructure/crypto/hmac-token.service';
import { NodePasswordHasher } from './infrastructure/crypto/node-password-hasher';
import { PrismaIdentityRepository } from './infrastructure/persistence/prisma-identity.repository';
import { IdentityController } from './presentation/identity.controller';
import { PASSWORD_HASHER } from './application/ports/password-hasher';
import { TOKEN_SERVICE } from './application/ports/token-service';

@Module({
  controllers: [IdentityController],
  providers: [
    PrismaService,
    RegisterIdentityUseCase,
    LoginIdentityUseCase,
    RefreshIdentityTokenUseCase,
    GetCurrentIdentityUseCase,
    LogoutIdentityUseCase,
    {
      provide: IDENTITY_REPOSITORY,
      useClass: PrismaIdentityRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: NodePasswordHasher,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: HmacTokenService,
    },
  ],
})
export class IdentityModule {}
