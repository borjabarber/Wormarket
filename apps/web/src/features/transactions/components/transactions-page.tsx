'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button, EmptyState, Skeleton } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { transactionsClient } from '../api/transactions-client';
import {
  formatTransactionAmount,
  formatTransactionDate,
  transactionStatusLabels,
} from '../model/transaction-formatters';
import type { TransactionSummary, TransactionUser } from '../model/transaction-types';
import { ReviewForm } from './review-form';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudieron cargar tus transacciones.';
}

function getOtherParticipant(
  transaction: TransactionSummary,
  currentUserId: string,
): TransactionUser {
  return transaction.buyer.id === currentUserId ? transaction.seller : transaction.buyer;
}

function TransactionItem({
  accessToken,
  currentUserId,
  isCompleting,
  onComplete,
  transaction,
}: {
  accessToken: string;
  currentUserId: string;
  isCompleting: boolean;
  onComplete: (transactionId: string) => void;
  transaction: TransactionSummary;
}) {
  const otherParticipant = getOtherParticipant(transaction, currentUserId);
  const canComplete = transaction.status === 'PENDING_DELIVERY';
  const canReview = transaction.status === 'COMPLETED';

  return (
    <li className="transaction-item">
      <article>
        <div className="transaction-item-header">
          <div>
            <p className="transaction-item-title">{transaction.listing.title}</p>
            <p>
              Con <a href={`/users/${otherParticipant.username}`}>{otherParticipant.displayName}</a>{' '}
              · {formatTransactionAmount(transaction.amount)}
            </p>
          </div>
          <span className="listing-status-badge">
            {transactionStatusLabels[transaction.status]}
          </span>
        </div>

        <dl className="transaction-facts">
          <div>
            <dt>Dimension</dt>
            <dd>{transaction.listing.dimension.name}</dd>
          </div>
          <div>
            <dt>Completada</dt>
            <dd>{formatTransactionDate(transaction.completedAt)}</dd>
          </div>
        </dl>

        <div className="offer-item-actions">
          <Button href={`/listings/${transaction.listing.slug}`} size="sm" variant="secondary">
            Ver objeto
          </Button>
          {canComplete ? (
            <Button
              disabled={isCompleting}
              onClick={() => onComplete(transaction.id)}
              size="sm"
              variant="ghost"
            >
              Completar transaccion
            </Button>
          ) : null}
        </div>

        {canReview ? (
          <div className="transaction-review-box">
            <p className="eyebrow">Valoracion</p>
            <ReviewForm
              accessToken={accessToken}
              reviewee={otherParticipant}
              transaction={transaction}
            />
          </div>
        ) : null}
      </article>
    </li>
  );
}

export function TransactionsPage() {
  const { session, user } = useAuth();
  const accessToken = session?.accessToken;
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    enabled: Boolean(accessToken),
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      return transactionsClient.listMine(accessToken);
    },
    queryKey: ['transactions', 'mine', session?.user.id],
  });

  const completeMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return transactionsClient.complete(transactionId, accessToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  if (!accessToken || !user) {
    return (
      <section className="transactions-page" aria-labelledby="transactions-title">
        <div className="transactions-intro">
          <p className="eyebrow">Area personal</p>
          <h1 id="transactions-title">Transacciones y valoraciones</h1>
        </div>
        <EmptyState
          action={{ children: 'Iniciar sesion', href: '/auth', variant: 'secondary' }}
          title="Necesitas una identidad dimensional"
        >
          Inicia sesion para completar transacciones y valorar a otros usuarios.
        </EmptyState>
      </section>
    );
  }

  if (transactionsQuery.isPending) {
    return (
      <section className="transactions-page" aria-busy="true" aria-label="Cargando transacciones">
        <Skeleton label="Cargando transacciones" />
        <Skeleton />
      </section>
    );
  }

  if (transactionsQuery.isError) {
    return (
      <section className="transactions-page">
        <div className="explorer-error" role="alert">
          <h1>No se pudieron abrir tus transacciones</h1>
          <p>{getErrorMessage(transactionsQuery.error)}</p>
          <button
            className="wm-button wm-button-secondary"
            onClick={() => void transactionsQuery.refetch()}
          >
            Reintentar carga
          </button>
        </div>
      </section>
    );
  }

  const transactions = transactionsQuery.data;

  return (
    <section className="transactions-page" aria-labelledby="transactions-title">
      <div className="transactions-intro">
        <p className="eyebrow">Area personal</p>
        <h1 id="transactions-title">Transacciones y valoraciones</h1>
        <p>
          Completa intercambios cerrados y deja una valoracion del otro participante cuando el trato
          haya terminado.
        </p>
      </div>

      <p className="explorer-count" aria-live="polite">
        {transactions.length === 1
          ? '1 transaccion registrada'
          : `${transactions.length} transacciones registradas`}
      </p>

      {completeMutation.isError ? (
        <p className="auth-error" role="alert">
          {getErrorMessage(completeMutation.error)}
        </p>
      ) : null}

      {transactions.length > 0 ? (
        <ul className="transaction-list" aria-label="Transacciones">
          {transactions.map((transaction) => (
            <TransactionItem
              accessToken={accessToken}
              currentUserId={user.id}
              isCompleting={completeMutation.isPending}
              key={transaction.id}
              onComplete={(transactionId) => completeMutation.mutate(transactionId)}
              transaction={transaction}
            />
          ))}
        </ul>
      ) : (
        <EmptyState
          action={{ children: 'Revisar ofertas', href: '/offers', variant: 'secondary' }}
          title="Aun no hay transacciones"
        >
          Acepta una oferta para abrir una transaccion y poder cerrarla con una valoracion.
        </EmptyState>
      )}
    </section>
  );
}
