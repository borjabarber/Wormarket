import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  Inject,
  Param,
  Post,
} from '@nestjs/common';

import { IdentityError } from '../../identity/application/errors/identity-error';
import { TOKEN_SERVICE, type TokenService } from '../../identity/application/ports/token-service';
import type { TransactionDto } from '../application/dto/transaction.dto';
import { TransactionError } from '../application/errors/transaction-error';
import { CompleteTransactionUseCase } from '../application/use-cases/complete-transaction.use-case';
import { CreateTransactionFromOfferUseCase } from '../application/use-cases/create-transaction-from-offer.use-case';
import { GetTransactionUseCase } from '../application/use-cases/get-transaction.use-case';
import { ListMyTransactionsUseCase } from '../application/use-cases/list-my-transactions.use-case';

@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject(CreateTransactionFromOfferUseCase)
    private readonly createTransactionFromOfferUseCase: CreateTransactionFromOfferUseCase,
    @Inject(ListMyTransactionsUseCase)
    private readonly listMyTransactionsUseCase: ListMyTransactionsUseCase,
    @Inject(GetTransactionUseCase)
    private readonly getTransactionUseCase: GetTransactionUseCase,
    @Inject(CompleteTransactionUseCase)
    private readonly completeTransactionUseCase: CompleteTransactionUseCase,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  async listMyTransactions(
    @Headers('authorization') authorization: string | undefined,
  ): Promise<TransactionDto[]> {
    return this.mapTransactionErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.listMyTransactionsUseCase.execute(user.sub);
    });
  }

  @Get(':transactionId')
  async getTransaction(
    @Headers('authorization') authorization: string | undefined,
    @Param('transactionId') transactionId: string,
  ): Promise<TransactionDto> {
    return this.mapTransactionErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.getTransactionUseCase.execute(user.sub, transactionId);
    });
  }

  @Post('from-offer/:offerId')
  async createFromOffer(
    @Headers('authorization') authorization: string | undefined,
    @Param('offerId') offerId: string,
  ): Promise<TransactionDto> {
    return this.mapTransactionErrors(() => {
      const seller = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.createTransactionFromOfferUseCase.execute(seller.sub, offerId);
    });
  }

  @Post(':transactionId/complete')
  @HttpCode(200)
  async completeTransaction(
    @Headers('authorization') authorization: string | undefined,
    @Param('transactionId') transactionId: string,
  ): Promise<TransactionDto> {
    return this.mapTransactionErrors(() => {
      const participant = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.completeTransactionUseCase.execute(participant.sub, transactionId);
    });
  }

  private parseBearerToken(authorization: string | undefined): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new TransactionError(
        'INVALID_AUTHORIZATION_HEADER',
        'La cabecera de autorizacion no es valida.',
        401,
      );
    }

    return authorization.slice('Bearer '.length).trim();
  }

  private async mapTransactionErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof TransactionError) {
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
          },
          error.statusCode,
        );
      }

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
}
