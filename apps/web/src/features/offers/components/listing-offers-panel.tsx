'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button, EmptyState, Skeleton } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import type { ListingSummary } from '../../listings/model/listing-types';
import { offersClient } from '../api/offers-client';
import { formatOfferAmount, formatOfferDate, offerStatusLabels } from '../model/offer-formatters';
import type { OfferSummary } from '../model/offer-types';

type ListingOffersPanelProps = {
  listing: ListingSummary;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudieron cargar las ofertas recibidas.';
}

function OfferItem({
  offer,
  onAccept,
  onReject,
  isBusy,
}: {
  isBusy: boolean;
  offer: OfferSummary;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
}) {
  const isPending = offer.status === 'PENDING';

  return (
    <li className="offer-item">
      <div>
        <p className="offer-item-title">{formatOfferAmount(offer.amount)}</p>
        <p>
          {offer.buyer.displayName} · {formatOfferDate(offer.createdAt)}
        </p>
        {offer.message ? <p className="offer-message">{offer.message}</p> : null}
      </div>
      <div className="offer-item-actions">
        <span className="listing-status-badge">{offerStatusLabels[offer.status]}</span>
        {isPending ? (
          <>
            <Button disabled={isBusy} onClick={() => onAccept(offer.id)} size="sm">
              Aceptar
            </Button>
            <Button
              disabled={isBusy}
              onClick={() => onReject(offer.id)}
              size="sm"
              variant="secondary"
            >
              Rechazar
            </Button>
          </>
        ) : null}
      </div>
    </li>
  );
}

export function ListingOffersPanel({ listing }: ListingOffersPanelProps) {
  const { session, user } = useAuth();
  const accessToken = session?.accessToken;
  const isOwner = user?.id === listing.seller.id;
  const queryClient = useQueryClient();

  const offersQuery = useQuery({
    enabled: Boolean(accessToken && isOwner),
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      return offersClient.listForListing(listing.slug, accessToken);
    },
    queryKey: ['offers', 'listing', listing.slug],
  });

  const actionMutation = useMutation({
    mutationFn: async ({ action, offerId }: { action: 'accept' | 'reject'; offerId: string }) => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return action === 'accept'
        ? offersClient.accept(offerId, accessToken)
        : offersClient.reject(offerId, accessToken);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['offers'] }),
        queryClient.invalidateQueries({ queryKey: ['listings', listing.slug] }),
      ]);
    },
  });

  if (!isOwner) {
    return null;
  }

  if (offersQuery.isPending) {
    return (
      <section className="offer-panel" aria-busy="true" aria-label="Cargando ofertas recibidas">
        <Skeleton label="Cargando ofertas recibidas" />
        <Skeleton />
      </section>
    );
  }

  if (offersQuery.isError) {
    return (
      <section className="offer-panel">
        <div className="explorer-error" role="alert">
          <h2>No se pudieron abrir las ofertas recibidas</h2>
          <p>{getErrorMessage(offersQuery.error)}</p>
          <button
            className="wm-button wm-button-secondary"
            onClick={() => void offersQuery.refetch()}
          >
            Reintentar carga
          </button>
        </div>
      </section>
    );
  }

  const offers = offersQuery.data;

  return (
    <section className="offer-panel" aria-labelledby="listing-offers-title">
      <div>
        <p className="eyebrow">Panel del vendedor</p>
        <h2 id="listing-offers-title">Ofertas recibidas</h2>
      </div>

      {actionMutation.isError ? (
        <p className="auth-error" role="alert">
          No se pudo actualizar la oferta.
        </p>
      ) : null}

      {offers.length > 0 ? (
        <ul className="offer-list">
          {offers.map((offer) => (
            <OfferItem
              isBusy={actionMutation.isPending}
              key={offer.id}
              offer={offer}
              onAccept={(offerId) => actionMutation.mutate({ action: 'accept', offerId })}
              onReject={(offerId) => actionMutation.mutate({ action: 'reject', offerId })}
            />
          ))}
        </ul>
      ) : (
        <EmptyState title="Aun no hay ofertas">
          Cuando otro comprador proponga un trato por este objeto, aparecera aqui.
        </EmptyState>
      )}
    </section>
  );
}
