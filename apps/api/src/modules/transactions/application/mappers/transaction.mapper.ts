import type { Transaction } from '../../domain/entities/transaction';
import type { TransactionDto } from '../dto/transaction.dto';

export class TransactionMapper {
  static toDto(transaction: Transaction): TransactionDto {
    return {
      id: transaction.id.toString(),
      offerId: transaction.offerId,
      listing: transaction.listing,
      buyer: transaction.buyer,
      seller: transaction.seller,
      amount: {
        amount: transaction.amount.amount,
        currencyCode: transaction.amount.currencyCode,
      },
      status: transaction.status,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      completedAt: transaction.completedAt?.toISOString() ?? null,
    };
  }
}
