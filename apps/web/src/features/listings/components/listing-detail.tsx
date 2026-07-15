'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { Button, EmptyState, RarityBadge, Skeleton } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { StartConversationButton } from '../../conversations/components/start-conversation-button';
import { FavoriteButton } from '../../favorites/components/favorite-button';
import { ReportForm } from '../../moderation/components/report-form';
import { ListingOffersPanel } from '../../offers/components/listing-offers-panel';
import { OfferForm } from '../../offers/components/offer-form';
import { listingsClient, ListingsApiError } from '../api/listings-client';
import { formatListingDate, formatListingPrice, statusLabels } from '../model/listing-formatters';
import type { ListingSummary } from '../model/listing-types';

type ListingDetailProps = {
  slug: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo cargar el anuncio.';
}

function ListingDetailSkeleton() {
  return (
    <section className="listing-detail-page" aria-busy="true" aria-label="Cargando anuncio">
      <Skeleton label="Cargando anuncio" />
      <div className="listing-detail-grid" aria-hidden="true">
        <Skeleton className="listing-detail-media-skeleton" />
        <div className="listing-detail-panel">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    </section>
  );
}

function ListingMedia({ listing }: { listing: ListingSummary }) {
  const [primaryImageUrl, ...secondaryImageUrls] = listing.imageUrls;

  if (!primaryImageUrl) {
    return (
      <div
        className="listing-detail-placeholder"
        aria-label={`Objeto sin imagen: ${listing.title}`}
      >
        <span aria-hidden="true" />
        <p>Imagen pendiente</p>
      </div>
    );
  }

  return (
    <figure className="listing-detail-media">
      <Image
        alt={`Imagen de ${listing.title}`}
        height={760}
        sizes="(max-width: 760px) 100vw, (max-width: 1180px) 58vw, 680px"
        src={primaryImageUrl}
        unoptimized
        width={960}
      />
      {secondaryImageUrls.length > 0 ? (
        <figcaption>{secondaryImageUrls.length + 1} imagenes disponibles</figcaption>
      ) : null}
    </figure>
  );
}

function ListingFacts({ listing }: { listing: ListingSummary }) {
  return (
    <dl className="listing-detail-facts">
      <div>
        <dt>Dimension</dt>
        <dd>{listing.dimension.name}</dd>
      </div>
      <div>
        <dt>Estado</dt>
        <dd>{statusLabels[listing.status]}</dd>
      </div>
      <div>
        <dt>Publicado</dt>
        <dd>{formatListingDate(listing.createdAt)}</dd>
      </div>
      <div>
        <dt>Vendedor</dt>
        <dd>
          <a href={`/users/${listing.seller.username}`}>{listing.seller.displayName}</a>{' '}
          <span>@{listing.seller.username}</span>
        </dd>
      </div>
    </dl>
  );
}

export function ListingDetail({ slug }: ListingDetailProps) {
  const { user } = useAuth();
  const listingQuery = useQuery({
    queryFn: () => listingsClient.getBySlug(slug),
    queryKey: ['listings', slug],
  });

  if (listingQuery.isPending) {
    return <ListingDetailSkeleton />;
  }

  if (listingQuery.isError) {
    if (listingQuery.error instanceof ListingsApiError && listingQuery.error.statusCode === 404) {
      return (
        <section className="listing-detail-page">
          <EmptyState
            action={{ children: 'Volver al explorador', href: '/#explorar', variant: 'secondary' }}
            title="Anuncio no encontrado"
          >
            El objeto que buscas no existe o ya no esta disponible en este mercado local.
          </EmptyState>
        </section>
      );
    }

    return (
      <section className="listing-detail-page">
        <div className="explorer-error" role="alert">
          <h1>No se pudo abrir el anuncio</h1>
          <p>{getErrorMessage(listingQuery.error)}</p>
          <button
            className="wm-button wm-button-secondary"
            onClick={() => void listingQuery.refetch()}
          >
            Reintentar carga
          </button>
        </div>
      </section>
    );
  }

  const listing = listingQuery.data;
  const canEdit = user?.id === listing.seller.id;

  return (
    <article className="listing-detail-page" aria-labelledby="listing-detail-title">
      <a className="listing-back-link" href="/#explorar">
        Volver al explorador
      </a>

      <div className="listing-detail-grid">
        <ListingMedia listing={listing} />

        <div className="listing-detail-panel">
          <p className="eyebrow">{listing.dimension.name}</p>
          <h1 id="listing-detail-title">{listing.title}</h1>
          <div className="listing-detail-badges">
            <RarityBadge rarity={listing.rarity} />
            <span className="listing-status-badge">{statusLabels[listing.status]}</span>
          </div>
          <p className="listing-detail-price">{formatListingPrice(listing)}</p>
          <p className="listing-detail-description">{listing.description}</p>

          <ListingFacts listing={listing} />

          <div className="listing-detail-actions" aria-label="Acciones del anuncio">
            <FavoriteButton listingSlug={listing.slug} listingTitle={listing.title} />
            <StartConversationButton listing={listing} />
            {canEdit ? (
              <Button href={`/listings/${listing.slug}/edit`} variant="secondary">
                Editar anuncio
              </Button>
            ) : null}
            <Button href="/#explorar" variant="secondary">
              Seguir explorando
            </Button>
          </div>
        </div>
      </div>
      <OfferForm listing={listing} />
      <ListingOffersPanel listing={listing} />
      {!canEdit ? (
        <ReportForm
          targetId={listing.slug}
          targetLabel={`el anuncio ${listing.title}`}
          targetType="LISTING"
        />
      ) : null}
    </article>
  );
}
