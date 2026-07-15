import { Inject, Injectable } from '@nestjs/common';

import {
  TRANSACTION_REPOSITORY,
  type TransactionRepository,
} from '../../domain/repositories/transaction.repository';
import type { TransactionDto } from '../dto/transaction.dto';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class CreateTransactionFromOfferUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(sellerId: string, offerId: string): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.createFromAcceptedOffer(offerId, sellerId);

    return TransactionMapper.toDto(transaction);
  }
}
