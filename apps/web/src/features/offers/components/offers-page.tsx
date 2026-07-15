'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button, EmptyState, Skeleton } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { offersClient } from '../api/offers-client';
import { formatOfferAmount, formatOfferDate, offerStatusLabels } from '../model/offer-formatters';
import type { OfferSummary } from '../model/offer-types';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudieron cargar tus ofertas.';
}

function MyOfferItem({
  isBusy,
  offer,
  onCancel,
}: {
  isBusy: boolean;
  offer: OfferSummary;
  onCancel: (offerId: string) => void;
}) {
  const isPending = offer.status === 'PENDING';

  return (
    <li className="offer-item">
      <div>
        <p className="offer-item-title">{offer.listing.title}</p>
        <p>
          {formatOfferAmount(offer.amount)} · {offer.listing.dimension.name} ·{' '}
          {formatOfferDate(offer.createdAt)}
        </p>
        {offer.message ? <p className="offer-message">{offer.message}</p> : null}
      </div>
      <div className="offer-item-actions">
        <span className="listing-status-badge">{offerStatusLabels[offer.status]}</span>
        <Button href={`/listings/${offer.listing.slug}`} size="sm" variant="secondary">
          Ver objeto
        </Button>
        {isPending ? (
          <Button disabled={isBusy} onClick={() => onCancel(offer.id)} size="sm" variant="ghost">
            Cancelar
          </Button>
        ) : null}
      </div>
    </li>
  );
}

export function OffersPage() {
  const { session } = useAuth();
  const accessToken = session?.accessToken;
  const queryClient = useQueryClient();

  const offersQuery = useQuery({
    enabled: Boolean(accessToken),
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      return offersClient.listMine(accessToken);
    },
    queryKey: ['offers', 'mine', session?.user.id],
  });

  const cancelMutation = useMutation({
    mutationFn: async (offerId: string) => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return offersClient.cancel(offerId, accessToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });

  if (!accessToken) {
    return (
      <section className="offers-page" aria-labelledby="offers-title">
        <div className="offers-intro">
          <p className="eyebrow">Area personal</p>
          <h1 id="offers-title">Mis ofertas</h1>
        </div>
        <EmptyState
          action={{ children: 'Iniciar sesion', href: '/auth', variant: 'secondary' }}
          title="Necesitas una identidad dimensional"
        >
          Inicia sesion para enviar, revisar y cancelar tus ofertas locales.
        </EmptyState>
      </section>
    );
  }

  if (offersQuery.isPending) {
    return (
      <section className="offers-page" aria-busy="true" aria-label="Cargando ofertas">
        <Skeleton label="Cargando ofertas" />
        <Skeleton />
      </section>
    );
  }

  if (offersQuery.isError) {
    return (
      <section className="offers-page">
        <div className="explorer-error" role="alert">
          <h1>No se pudieron abrir tus ofertas</h1>
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
    <section className="offers-page" aria-labelledby="offers-title">
      <div className="offers-intro">
        <p className="eyebrow">Area personal</p>
        <h1 id="offers-title">Mis ofertas</h1>
        <p>
          Revisa las propuestas que has enviado y cancela las que sigan pendientes antes de que el
          vendedor las responda.
        </p>
      </div>

      <p className="explorer-count" aria-live="polite">
        {offers.length === 1 ? '1 oferta enviada' : `${offers.length} ofertas enviadas`}
      </p>

      {cancelMutation.isError ? (
        <p className="auth-error" role="alert">
          No se pudo cancelar la oferta.
        </p>
      ) : null}

      {offers.length > 0 ? (
        <ul className="offer-list" aria-label="Ofertas enviadas">
          {offers.map((offer) => (
            <MyOfferItem
              isBusy={cancelMutation.isPending}
              key={offer.id}
              offer={offer}
              onCancel={(offerId) => cancelMutation.mutate(offerId)}
            />
          ))}
        </ul>
      ) : (
        <EmptyState
          action={{ children: 'Explorar objetos', href: '/#explorar' }}
          title="Aun no has enviado ofertas"
        >
          Envia una oferta desde el detalle de un anuncio publicado para iniciar una negociacion.
        </EmptyState>
      )}
    </section>
  );
}
