import { Inject, Injectable } from '@nestjs/common';

import {
  TRANSACTION_REPOSITORY,
  type TransactionRepository,
} from '../../domain/repositories/transaction.repository';
import type { TransactionDto } from '../dto/transaction.dto';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class ListMyTransactionsUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(userId: string): Promise<TransactionDto[]> {
    const transactions = await this.transactionRepository.findByParticipantId(userId);

    return transactions.map((transaction) => TransactionMapper.toDto(transaction));
  }
}
