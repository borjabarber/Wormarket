import { Inject, Injectable } from '@nestjs/common';

import { TransactionError } from '../errors/transaction-error';
import {
  TRANSACTION_REPOSITORY,
  type TransactionRepository,
} from '../../domain/repositories/transaction.repository';
import type { TransactionDto } from '../dto/transaction.dto';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class GetTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(participantId: string, transactionId: string): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new TransactionError('TRANSACTION_NOT_FOUND', 'La transaccion no existe.', 404);
    }

    if (!transaction.canBeViewedBy(participantId)) {
      throw new TransactionError(
        'TRANSACTION_NOT_ACCESSIBLE',
        'No puedes ver esta transaccion.',
        403,
      );
    }

    return TransactionMapper.toDto(transaction);
  }
}
