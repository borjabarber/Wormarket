import type { Transaction } from '../entities/transaction';

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByParticipantId(userId: string): Promise<Transaction[]>;
  createFromAcceptedOffer(offerId: string, sellerId: string): Promise<Transaction>;
  complete(id: string, participantId: string): Promise<Transaction>;
}
