'use client';

import { useQuery } from '@tanstack/react-query';

import { EmptyState, ListingCard, Skeleton } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { formatListingPrice } from '../../listings/model/listing-formatters';
import { favoritesClient } from '../api/favorites-client';
import { FavoriteButton } from './favorite-button';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudieron cargar tus favoritos.';
}

export function FavoritesPage() {
  const { session } = useAuth();
  const accessToken = session?.accessToken;

  const favoritesQuery = useQuery({
    enabled: Boolean(accessToken),
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      return favoritesClient.list(accessToken);
    },
    queryKey: ['favorites', session?.user.id],
  });

  if (!accessToken) {
    return (
      <section className="favorites-page" aria-labelledby="favorites-title">
        <div className="favorites-intro">
          <p className="eyebrow">Area personal</p>
          <h1 id="favorites-title">Favoritos</h1>
        </div>
        <EmptyState
          action={{ children: 'Iniciar sesion', href: '/auth', variant: 'secondary' }}
          title="Necesitas una identidad dimensional"
        >
          Inicia sesion para guardar objetos imposibles y recuperarlos sin volver a cruzar todo el
          mercado.
        </EmptyState>
      </section>
    );
  }

  if (favoritesQuery.isPending) {
    return (
      <section className="favorites-page" aria-busy="true" aria-label="Cargando favoritos">
        <Skeleton label="Cargando favoritos" />
        <div className="object-list" aria-hidden="true">
          <Skeleton className="explorer-card-skeleton" />
          <Skeleton className="explorer-card-skeleton" />
        </div>
      </section>
    );
  }

  if (favoritesQuery.isError) {
    return (
      <section className="favorites-page">
        <div className="explorer-error" role="alert">
          <h1>No se pudieron abrir tus favoritos</h1>
          <p>{getErrorMessage(favoritesQuery.error)}</p>
          <button
            className="wm-button wm-button-secondary"
            onClick={() => void favoritesQuery.refetch()}
          >
            Reintentar carga
          </button>
        </div>
      </section>
    );
  }

  const favorites = favoritesQuery.data;

  return (
    <section className="favorites-page" aria-labelledby="favorites-title">
      <div className="favorites-intro">
        <p className="eyebrow">Area personal</p>
        <h1 id="favorites-title">Favoritos</h1>
        <p>
          Objetos guardados para revisar despues, comparar rarezas o preparar una oferta en otra
          visita al mercado local.
        </p>
      </div>

      <p className="explorer-count" aria-live="polite">
        {favorites.length === 1 ? '1 favorito guardado' : `${favorites.length} favoritos guardados`}
      </p>

      {favorites.length > 0 ? (
        <ul className="object-list" aria-label="Anuncios favoritos">
          {favorites.map((favorite) => (
            <li key={favorite.id}>
              <ListingCard
                dimensionName={favorite.listing.dimension.name}
                href={`/listings/${favorite.listing.slug}`}
                {...(favorite.listing.imageUrls[0]
                  ? {
                      imageAlt: `Imagen de ${favorite.listing.title}`,
                      imageUrl: favorite.listing.imageUrls[0],
                    }
                  : {})}
                price={formatListingPrice(favorite.listing)}
                rarity={favorite.listing.rarity}
                secondaryAction={
                  <FavoriteButton
                    listingSlug={favorite.listing.slug}
                    listingTitle={favorite.listing.title}
                    size="sm"
                  />
                }
                sellerName={favorite.listing.seller.displayName}
                title={favorite.listing.title}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          action={{ children: 'Explorar objetos', href: '/#explorar' }}
          title="Aun no hay favoritos"
        >
          Guarda anuncios desde el explorador o desde el detalle de un objeto para volver a ellos
          rapidamente.
        </EmptyState>
      )}
    </section>
  );
}
