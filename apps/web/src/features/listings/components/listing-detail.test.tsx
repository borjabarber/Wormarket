import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '../../auth/model/use-auth';
import { ListingDetail } from './listing-detail';

const listingFixture = {
  createdAt: '2026-07-14T08:00:00.000Z',
  description: 'Instrumento de bolsillo que apunta hacia la alternativa que casi elegiste.',
  dimension: {
    id: 'dimension-1',
    name: 'Oraculo Norte',
    slug: 'oraculo-norte',
  },
  id: 'listing-1',
  imageUrls: ['/images/demo/brujula-decisiones.png'],
  price: {
    amount: 180,
    currencyCode: 'AUR',
  },
  rarity: 'RARE',
  seller: {
    displayName: 'Lyra del Oraculo',
    id: 'seller-1',
    username: 'lyra-oraculo',
  },
  slug: 'brujula-de-decisiones-no-tomadas',
  status: 'PUBLISHED',
  title: 'Brujula de decisiones no tomadas',
} as const;

function renderListingDetail(slug: string = listingFixture.slug) {
  return render(
    <AppProviders>
      <ListingDetail slug={slug} />
    </AppProviders>,
  );
}

describe('ListingDetail', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('loads and renders a listing detail from the local API', async () => {
    const fetchMock = vi.fn(async () => Response.json(listingFixture));
    vi.stubGlobal('fetch', fetchMock);

    renderListingDetail();

    expect(screen.getAllByLabelText('Cargando anuncio').length).toBeGreaterThan(0);

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Brujula de decisiones no tomadas',
      }),
    ).toBeTruthy();

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/listings/brujula-de-decisiones-no-tomadas',
      expect.objectContaining({
        headers: expect.any(Object),
      }),
    );
    expect(screen.getByText('180 AUR')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Lyra del Oraculo' }).getAttribute('href')).toBe(
      '/users/lyra-oraculo',
    );
    expect(screen.getByText('@lyra-oraculo')).toBeTruthy();
    expect(screen.getAllByText('Publicado').length).toBeGreaterThan(1);
    expect(
      screen.getByRole('img', { name: 'Imagen de Brujula de decisiones no tomadas' }),
    ).toBeTruthy();
  });

  it('renders an accessible placeholder when the listing has no image', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          ...listingFixture,
          imageUrls: [],
        }),
      ),
    );

    renderListingDetail();

    expect(
      await screen.findByLabelText('Objeto sin imagen: Brujula de decisiones no tomadas'),
    ).toBeTruthy();
    expect(screen.getByText('Imagen pendiente')).toBeTruthy();
  });

  it('shows a not found state for missing listings', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json(
          { code: 'LISTING_NOT_FOUND', message: 'El anuncio no existe.' },
          { status: 404 },
        ),
      ),
    );

    renderListingDetail('objeto-inexistente');

    expect(await screen.findByText('Anuncio no encontrado')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Volver al explorador' })).toBeTruthy();
  });

  it('shows a retryable error when the API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json(
          { code: 'LISTINGS_DOWN', message: 'Mercado local temporalmente cerrado.' },
          { status: 503 },
        ),
      ),
    );

    renderListingDetail();

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByText('Mercado local temporalmente cerrado.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reintentar carga' })).toBeTruthy();
  });
});
