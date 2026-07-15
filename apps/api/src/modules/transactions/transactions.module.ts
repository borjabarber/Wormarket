import { Module } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TOKEN_SERVICE } from '../identity/application/ports/token-service';
import { HmacTokenService } from '../identity/infrastructure/crypto/hmac-token.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { CompleteTransactionUseCase } from './application/use-cases/complete-transaction.use-case';
import { CreateTransactionFromOfferUseCase } from './application/use-cases/create-transaction-from-offer.use-case';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.use-case';
import { ListMyTransactionsUseCase } from './application/use-cases/list-my-transactions.use-case';
import { TRANSACTION_REPOSITORY } from './domain/repositories/transaction.repository';
import { PrismaTransactionRepository } from './infrastructure/persistence/prisma-transaction.repository';
import { TransactionsController } from './presentation/transactions.controller';

@Module({
  imports: [NotificationsModule],
  controllers: [TransactionsController],
  providers: [
    PrismaService,
    CreateTransactionFromOfferUseCase,
    GetTransactionUseCase,
    ListMyTransactionsUseCase,
    CompleteTransactionUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: HmacTokenService,
    },
  ],
})
export class TransactionsModule {}
