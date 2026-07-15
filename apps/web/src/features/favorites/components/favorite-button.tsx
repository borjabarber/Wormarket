'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { favoritesClient } from '../api/favorites-client';

type FavoriteButtonProps = {
  listingSlug: string;
  listingTitle: string;
  size?: 'sm' | 'md';
};

function getFavoriteQueryKey(userId: string | undefined) {
  return ['favorites', userId] as const;
}

export function FavoriteButton({ listingSlug, listingTitle, size = 'md' }: FavoriteButtonProps) {
  const { session, user } = useAuth();
  const queryClient = useQueryClient();
  const accessToken = session?.accessToken;
  const favoriteQueryKey = getFavoriteQueryKey(user?.id);

  const favoritesQuery = useQuery({
    enabled: Boolean(accessToken),
    queryFn: async () => {
      if (!accessToken) {
        return [];
      }

      return favoritesClient.list(accessToken);
    },
    queryKey: favoriteQueryKey,
  });

  const favorite = favoritesQuery.data?.find((item) => item.listing.slug === listingSlug);
  const isFavorite = Boolean(favorite);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      if (isFavorite) {
        await favoritesClient.remove(listingSlug, accessToken);
        return null;
      }

      return favoritesClient.add(listingSlug, accessToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  if (!accessToken) {
    return (
      <Button
        aria-label={`Iniciar sesion para guardar ${listingTitle}`}
        href="/auth"
        size={size}
        variant="ghost"
      >
        Guardar
      </Button>
    );
  }

  const isBusy = favoritesQuery.isPending || toggleFavoriteMutation.isPending;

  return (
    <span className="favorite-control">
      <Button
        aria-label={
          isFavorite
            ? `Quitar ${listingTitle} de favoritos`
            : `Guardar ${listingTitle} en favoritos`
        }
        aria-pressed={isFavorite}
        disabled={isBusy}
        onClick={() => toggleFavoriteMutation.mutate()}
        size={size}
        variant={isFavorite ? 'secondary' : 'ghost'}
      >
        {isBusy ? 'Sincronizando' : isFavorite ? 'Guardado' : 'Guardar'}
      </Button>
      {toggleFavoriteMutation.isError ? (
        <span className="favorite-status" role="alert">
          No se pudo actualizar favoritos.
        </span>
      ) : null}
    </span>
  );
}
