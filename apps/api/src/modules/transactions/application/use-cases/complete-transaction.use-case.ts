import { Inject, Injectable, Optional } from '@nestjs/common';

import { NotificationPublisher } from '../../../notifications/application/services/notification-publisher';
import {
  TRANSACTION_REPOSITORY,
  type TransactionRepository,
} from '../../domain/repositories/transaction.repository';
import type { TransactionDto } from '../dto/transaction.dto';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class CompleteTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: TransactionRepository,
    @Optional()
    @Inject(NotificationPublisher)
    private readonly notificationPublisher?: NotificationPublisher,
  ) {}

  async execute(participantId: string, transactionId: string): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.complete(transactionId, participantId);
    const transactionDto = TransactionMapper.toDto(transaction);
    const recipient =
      transactionDto.buyer.id === participantId ? transactionDto.seller : transactionDto.buyer;

    await this.notificationPublisher?.publish({
      userId: recipient.id,
      type: 'TRANSACTION_COMPLETED',
      title: 'Transaccion completada',
      message: `La transaccion de "${transactionDto.listing.title}" se ha completado.`,
      linkPath: `/transactions/${transactionDto.id}`,
    });

    return transactionDto;
  }
}
