'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  EmptyState,
  Input,
  ListingCard,
  Select,
  Skeleton,
  rarityValues,
  type Rarity,
} from '../../../shared/components';
import { FavoriteButton } from '../../favorites/components/favorite-button';
import { listingsClient } from '../api/listings-client';
import { formatListingPrice, rarityLabels, statusLabels } from '../model/listing-formatters';
import type { ListingStatus, ListingSummary } from '../model/listing-types';

const allValue = 'ALL';
const emptyListings: ListingSummary[] = [];
const publicListingStatuses = [
  'PUBLISHED',
  'RESERVED',
  'SOLD',
] as const satisfies readonly ListingStatus[];

function isPublicListingStatus(status: ListingStatus): boolean {
  return (publicListingStatuses as readonly ListingStatus[]).includes(status);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudieron cargar los anuncios.';
}

function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase('es');
}

function readSearchFromUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get('q') ?? '';
}

function matchesSearch(listing: ListingSummary, query: string): boolean {
  if (!query) {
    return true;
  }

  return [
    listing.title,
    listing.description,
    listing.dimension.name,
    listing.seller.displayName,
    listing.seller.username,
  ].some((value) => value.toLocaleLowerCase('es').includes(query));
}

function sortByName<TValue extends { name: string }>(values: TValue[]): TValue[] {
  return [...values].sort((first, second) => first.name.localeCompare(second.name, 'es'));
}

export function ListingsExplorer() {
  const [search, setSearch] = useState(readSearchFromUrl);
  const [dimensionSlug, setDimensionSlug] = useState(allValue);
  const [rarity, setRarity] = useState<Rarity | typeof allValue>(allValue);
  const [status, setStatus] = useState<ListingStatus | typeof allValue>('PUBLISHED');

  const listingsQuery = useQuery({
    queryFn: listingsClient.list,
    queryKey: ['listings'],
  });

  const listings = listingsQuery.data ?? emptyListings;

  const dimensions = useMemo(() => {
    const bySlug = new Map<string, { name: string; slug: string }>();

    for (const listing of listings) {
      bySlug.set(listing.dimension.slug, {
        name: listing.dimension.name,
        slug: listing.dimension.slug,
      });
    }

    return sortByName([...bySlug.values()]);
  }, [listings]);

  const filteredListings = useMemo(() => {
    const query = normalizeSearch(search);

    return listings.filter((listing) => {
      if (!isPublicListingStatus(listing.status)) {
        return false;
      }

      const dimensionMatches =
        dimensionSlug === allValue || listing.dimension.slug === dimensionSlug;
      const rarityMatches = rarity === allValue || listing.rarity === rarity;
      const statusMatches = status === allValue || listing.status === status;

      return dimensionMatches && rarityMatches && statusMatches && matchesSearch(listing, query);
    });
  }, [dimensionSlug, listings, rarity, search, status]);

  if (listingsQuery.isPending) {
    return (
      <div className="explorer-state" aria-busy="true" aria-label="Cargando anuncios">
        <Skeleton label="Cargando filtros" />
        <div className="object-list" aria-hidden="true">
          <Skeleton className="explorer-card-skeleton" />
          <Skeleton className="explorer-card-skeleton" />
          <Skeleton className="explorer-card-skeleton" />
        </div>
      </div>
    );
  }

  if (listingsQuery.isError) {
    return (
      <div className="explorer-error" role="alert">
        <h3>No se pudo abrir el mercado local</h3>
        <p>{getErrorMessage(listingsQuery.error)}</p>
        <button
          className="wm-button wm-button-secondary"
          onClick={() => void listingsQuery.refetch()}
        >
          Reintentar carga
        </button>
      </div>
    );
  }

  return (
    <div className="explorer">
      <div className="explorer-toolbar" aria-label="Filtros de anuncios">
        <Input
          id="listing-search"
          label="Buscar objeto"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nombre, vendedor o dimension"
          type="search"
          value={search}
        />
        <Select
          id="listing-dimension"
          label="Dimension"
          onChange={(event) => setDimensionSlug(event.target.value)}
          value={dimensionSlug}
        >
          <option value={allValue}>Todas</option>
          {dimensions.map((dimension) => (
            <option key={dimension.slug} value={dimension.slug}>
              {dimension.name}
            </option>
          ))}
        </Select>
        <Select
          id="listing-rarity"
          label="Rareza"
          onChange={(event) => setRarity(event.target.value as Rarity | typeof allValue)}
          value={rarity}
        >
          <option value={allValue}>Todas</option>
          {rarityValues.map((rarityValue) => (
            <option key={rarityValue} value={rarityValue}>
              {rarityLabels[rarityValue]}
            </option>
          ))}
        </Select>
        <Select
          id="listing-status"
          label="Estado"
          onChange={(event) => setStatus(event.target.value as ListingStatus | typeof allValue)}
          value={status}
        >
          <option value={allValue}>Todos</option>
          {publicListingStatuses.map((statusValue) => (
            <option key={statusValue} value={statusValue}>
              {statusLabels[statusValue]}
            </option>
          ))}
        </Select>
      </div>

      <p className="explorer-count" aria-live="polite">
        {filteredListings.length === 1
          ? '1 anuncio encontrado'
          : `${filteredListings.length} anuncios encontrados`}
      </p>

      {filteredListings.length > 0 ? (
        <ul className="object-list" aria-label="Anuncios disponibles">
          {filteredListings.map((listing) => (
            <li key={listing.id}>
              <ListingCard
                dimensionName={listing.dimension.name}
                href={`/listings/${listing.slug}`}
                {...(listing.imageUrls[0]
                  ? {
                      imageAlt: `Imagen de ${listing.title}`,
                      imageUrl: listing.imageUrls[0],
                    }
                  : {})}
                price={formatListingPrice(listing)}
                rarity={listing.rarity}
                secondaryAction={
                  <FavoriteButton
                    listingSlug={listing.slug}
                    listingTitle={listing.title}
                    size="sm"
                  />
                }
                sellerName={listing.seller.displayName}
                title={listing.title}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No hay anuncios con estos filtros">
          Ajusta la busqueda, la dimension, la rareza o el estado para volver a abrir rutas de
          mercado.
        </EmptyState>
      )}
    </div>
  );
}
