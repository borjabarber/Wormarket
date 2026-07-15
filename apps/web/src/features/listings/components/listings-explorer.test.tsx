import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '../../auth/model/use-auth';
import { ListingsExplorer } from './listings-explorer';

const listingFixtures = [
  {
    createdAt: '2026-07-14T08:00:00.000Z',
    description: 'Instrumento que apunta hacia alternativas descartadas.',
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
  },
  {
    createdAt: '2026-07-14T08:10:00.000Z',
    description: 'Reloj estabilizado para rebobinar siete minutos menores.',
    dimension: {
      id: 'dimension-2',
      name: 'Distrito Cronal',
      slug: 'distrito-cronal',
    },
    id: 'listing-2',
    imageUrls: [],
    price: {
      amount: 320,
      currencyCode: 'MIN',
    },
    rarity: 'EPIC',
    seller: {
      displayName: 'Nadir Cronal',
      id: 'seller-2',
      username: 'nadir-cronal',
    },
    slug: 'reloj-de-siete-minutos-reversibles',
    status: 'RESERVED',
    title: 'Reloj de siete minutos reversibles',
  },
  {
    createdAt: '2026-07-14T08:20:00.000Z',
    description: 'Una botella sellada que contiene una tormenta diminuta.',
    dimension: {
      id: 'dimension-3',
      name: 'Archivo Horizonte',
      slug: 'archivo-horizonte',
    },
    id: 'listing-3',
    imageUrls: ['/images/demo/botella-tormenta.png'],
    price: {
      amount: 260,
      currencyCode: 'AUR',
    },
    rarity: 'EPIC',
    seller: {
      displayName: 'Brais Moure',
      id: 'seller-3',
      username: 'braismoure',
    },
    slug: 'botella-que-contiene-una-tormenta',
    status: 'PUBLISHED',
    title: 'Botella que contiene una tormenta',
  },
  {
    createdAt: '2026-07-14T08:30:00.000Z',
    description: 'Anuncio interno pendiente de publicacion.',
    dimension: {
      id: 'dimension-1',
      name: 'Oraculo Norte',
      slug: 'oraculo-norte',
    },
    id: 'listing-4',
    imageUrls: [],
    price: {
      amount: 1,
      currencyCode: 'AUR',
    },
    rarity: 'COMMON',
    seller: {
      displayName: 'Lyra del Oraculo',
      id: 'seller-1',
      username: 'lyra-oraculo',
    },
    slug: 'borrador-interno',
    status: 'DRAFT',
    title: 'Borrador interno',
  },
  {
    createdAt: '2026-07-14T08:40:00.000Z',
    description: 'Anuncio cancelado que no debe mostrarse publicamente.',
    dimension: {
      id: 'dimension-2',
      name: 'Distrito Cronal',
      slug: 'distrito-cronal',
    },
    id: 'listing-5',
    imageUrls: [],
    price: {
      amount: 1,
      currencyCode: 'MIN',
    },
    rarity: 'COMMON',
    seller: {
      displayName: 'Nadir Cronal',
      id: 'seller-2',
      username: 'nadir-cronal',
    },
    slug: 'anuncio-cancelado',
    status: 'CANCELLED',
    title: 'Anuncio cancelado',
  },
] as const;

function renderListingsExplorer() {
  return render(
    <AppProviders>
      <ListingsExplorer />
    </AppProviders>,
  );
}

function mockFetchWithListings() {
  const fetchMock = vi.fn(async () => Response.json(listingFixtures));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('ListingsExplorer', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.history.pushState({}, '', '/');
  });

  it('loads listings from the local API and renders Spanish filters', async () => {
    const fetchMock = mockFetchWithListings();
    renderListingsExplorer();

    expect(screen.getByLabelText('Cargando anuncios')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Brujula de decisiones no tomadas')).toBeTruthy();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/listings',
      expect.objectContaining({
        headers: expect.any(Object),
      }),
    );
    expect(screen.getByLabelText('Buscar objeto')).toBeTruthy();
    expect(screen.getByLabelText('Dimension')).toBeTruthy();
    expect(screen.queryByRole('option', { name: 'Borrador' })).toBeNull();
    expect(screen.queryByRole('option', { name: 'Cancelado' })).toBeNull();
    expect(screen.queryByText('Borrador interno')).toBeNull();
    expect(screen.queryByText('Anuncio cancelado')).toBeNull();
    expect(screen.getByText('2 anuncios encontrados')).toBeTruthy();
  });

  it('uses the header query parameter as the initial search', async () => {
    window.history.pushState({}, '', '/?q=botella#explorar');
    mockFetchWithListings();

    renderListingsExplorer();

    expect(await screen.findByText('Botella que contiene una tormenta')).toBeTruthy();
    expect(screen.queryByText('Brujula de decisiones no tomadas')).toBeNull();
    expect(screen.getByLabelText('Buscar objeto')).toHaveProperty('value', 'botella');
    expect(screen.getByText('1 anuncio encontrado')).toBeTruthy();
  });

  it('filters by status and search text', async () => {
    mockFetchWithListings();
    const user = userEvent.setup();
    renderListingsExplorer();

    await screen.findByText('Brujula de decisiones no tomadas');
    await user.selectOptions(screen.getByLabelText('Estado'), 'Todos');
    await user.type(screen.getByLabelText('Buscar objeto'), 'cronal');

    expect(screen.queryByText('Brujula de decisiones no tomadas')).toBeNull();
    expect(screen.getByText('Reloj de siete minutos reversibles')).toBeTruthy();
    expect(screen.getByText('1 anuncio encontrado')).toBeTruthy();
  });

  it('shows an empty state when no listing matches the filters', async () => {
    mockFetchWithListings();
    const user = userEvent.setup();
    renderListingsExplorer();

    await screen.findByText('Brujula de decisiones no tomadas');
    await user.type(screen.getByLabelText('Buscar objeto'), 'portal inexistente');

    expect(screen.getByText('No hay anuncios con estos filtros')).toBeTruthy();
    expect(screen.getByText('0 anuncios encontrados')).toBeTruthy();
  });

  it('shows a retryable API error state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json(
          { code: 'LISTINGS_DOWN', message: 'Mercado local temporalmente cerrado.' },
          { status: 503 },
        ),
      ),
    );

    renderListingsExplorer();

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByText('Mercado local temporalmente cerrado.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reintentar carga' })).toBeTruthy();
  });
});
