import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { TransactionError } from '../../application/errors/transaction-error';
import type { Transaction } from '../../domain/entities/transaction';
import type { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { PrismaTransactionMapper } from './prisma-transaction.mapper';

const transactionInclude = {
  buyer: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
  seller: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
  listing: {
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          displayName: true,
        },
      },
      dimension: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  },
};

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
      include: transactionInclude,
    });

    return transaction ? PrismaTransactionMapper.toDomain(transaction) : null;
  }

  async findByParticipantId(userId: string): Promise<Transaction[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new TransactionError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: transactionInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map((transaction) => PrismaTransactionMapper.toDomain(transaction));
  }

  async createFromAcceptedOffer(offerId: string, sellerId: string): Promise<Transaction> {
    const offer = await this.prisma.offer.findUnique({
      where: {
        id: offerId,
      },
      include: {
        listing: {
          select: {
            id: true,
            sellerId: true,
            status: true,
          },
        },
      },
    });

    if (!offer) {
      throw new TransactionError('OFFER_NOT_FOUND', 'La oferta no existe.', 404);
    }

    if (offer.listing.sellerId !== sellerId) {
      throw new TransactionError(
        'SELLER_NOT_AUTHORIZED',
        'No puedes crear transacciones de un anuncio que no te pertenece.',
        403,
      );
    }

    if (offer.status !== 'ACCEPTED') {
      throw new TransactionError(
        'OFFER_NOT_ACCEPTED',
        'Solo se puede crear una transaccion desde una oferta aceptada.',
        409,
      );
    }

    const existingTransaction = await this.findByOfferId(offerId);

    if (existingTransaction) {
      return existingTransaction;
    }

    const createdTransaction = await this.prisma.$transaction(async (tx) => {
      await tx.listing.update({
        where: {
          id: offer.listingId,
        },
        data: {
          status: 'RESERVED',
        },
      });

      return tx.transaction.create({
        data: {
          offerId: offer.id,
          listingId: offer.listingId,
          buyerId: offer.buyerId,
          sellerId,
          amount: offer.amount,
          currencyCode: offer.currencyCode,
        },
        include: transactionInclude,
      });
    });

    return PrismaTransactionMapper.toDomain(createdTransaction);
  }

  async complete(id: string, participantId: string): Promise<Transaction> {
    const existingTransaction = await this.findRequiredTransaction(id);

    if (!existingTransaction.canBeCompletedBy(participantId)) {
      throw new TransactionError(
        'TRANSACTION_NOT_COMPLETABLE',
        'No puedes completar esta transaccion.',
        existingTransaction.canBeViewedBy(participantId) ? 409 : 403,
      );
    }

    const completedTransaction = await this.prisma.$transaction(async (tx) => {
      await tx.listing.update({
        where: {
          id: existingTransaction.listing.id,
        },
        data: {
          status: 'SOLD',
        },
      });

      return tx.transaction.update({
        where: {
          id,
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
        include: transactionInclude,
      });
    });

    return PrismaTransactionMapper.toDomain(completedTransaction);
  }

  private async findByOfferId(offerId: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        offerId,
      },
      include: transactionInclude,
    });

    return transaction ? PrismaTransactionMapper.toDomain(transaction) : null;
  }

  private async findRequiredTransaction(id: string): Promise<Transaction> {
    const transaction = await this.findById(id);

    if (!transaction) {
      throw new TransactionError('TRANSACTION_NOT_FOUND', 'La transaccion no existe.', 404);
    }

    return transaction;
  }
}
