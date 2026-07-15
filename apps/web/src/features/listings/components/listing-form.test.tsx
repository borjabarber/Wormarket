import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import { ListingForm } from './listing-form';

const userSession = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    displayName: 'Lyra del Oraculo',
    id: 'user-1',
    role: 'USER' as const,
    username: 'lyra-oraculo',
  },
};

const dimensions = [
  {
    currencyCode: 'AUR',
    currencyName: 'Aurora',
    description: 'Bibliotecas vivas y decisiones no tomadas.',
    exchangeRate: 1.2,
    forbiddenObjects: [],
    id: 'dimension-1',
    name: 'Oraculo Norte',
    shippingRules: 'Declarar antes del recuerdo.',
    slug: 'oraculo-norte',
  },
];

const listing = {
  createdAt: '2026-07-14T08:00:00.000Z',
  description: 'Instrumento de bolsillo que apunta hacia alternativas improbables.',
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
    id: 'user-1',
    username: 'lyra-oraculo',
  },
  slug: 'brujula-de-decisiones-no-tomadas',
  status: 'PUBLISHED',
  title: 'Brujula de decisiones no tomadas',
} as const;

function renderForm(mode: 'create' | 'edit', slug?: string) {
  return render(
    <AppProviders>
      {slug ? <ListingForm mode={mode} slug={slug} /> : <ListingForm mode={mode} />}
    </AppProviders>,
  );
}

function mockCommonFetch() {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url.endsWith('/identity/me')) {
      return Response.json({ user: userSession.user });
    }

    if (url.endsWith('/dimensions')) {
      return Response.json(dimensions);
    }

    if (url.endsWith('/listings/brujula-de-decisiones-no-tomadas') && init?.method !== 'PATCH') {
      return Response.json(listing);
    }

    if (url.endsWith('/listings') && init?.method === 'POST') {
      return Response.json({
        ...listing,
        slug: 'planta-que-crece-con-mentiras',
        title: 'Planta que crece con mentiras',
      });
    }

    if (url.endsWith('/storage/uploads') && init?.method === 'POST') {
      return Response.json({
        fileName: 'planta-mentiras.png',
        mimeType: 'image/png',
        path: '/uploads/planta-mentiras.png',
        size: 68,
        url: '/uploads/planta-mentiras.png',
      });
    }

    if (url.endsWith('/listings/brujula-de-decisiones-no-tomadas') && init?.method === 'PATCH') {
      return Response.json({
        ...listing,
        title: 'Brujula afinada de decisiones no tomadas',
      });
    }

    return Response.json({ code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' }, { status: 404 });
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('ListingForm', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks for authentication before creating listings', () => {
    renderForm('create');

    expect(screen.getByText('Necesitas una identidad dimensional')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Iniciar sesion' })).toBeTruthy();
  });

  it('creates a listing with the authenticated session token', async () => {
    storeSession(userSession);
    const fetchMock = mockCommonFetch();
    const user = userEvent.setup();
    renderForm('create');

    await screen.findByRole('heading', { name: 'Publicar objeto imposible' });
    await user.type(screen.getByLabelText('Titulo del objeto'), 'Planta que crece con mentiras');
    await user.type(
      screen.getByLabelText('Descripcion'),
      'Crece unos centimetros cada vez que alguien miente cerca de la maceta.',
    );
    await user.selectOptions(screen.getByLabelText('Dimension de venta'), 'oraculo-norte');
    await user.selectOptions(screen.getByLabelText('Rareza'), 'RARE');
    await user.clear(screen.getByLabelText('Precio'));
    await user.type(screen.getByLabelText('Precio'), '75');
    await user.type(
      screen.getByLabelText('URLs de imagenes'),
      '/images/demo/brujula-decisiones.png',
    );
    await user.click(screen.getByRole('button', { name: 'Publicar objeto' }));

    await waitFor(() => {
      expect(screen.getByText('Anuncio publicado.')).toBeTruthy();
    });

    const createCall = fetchMock.mock.calls.find(
      ([url, init]) => String(url).endsWith('/listings') && init?.method === 'POST',
    );

    expect(createCall?.[1]).toEqual(
      expect.objectContaining({
        body: JSON.stringify({
          description: 'Crece unos centimetros cada vez que alguien miente cerca de la maceta.',
          dimensionSlug: 'oraculo-norte',
          imageUrls: ['/images/demo/brujula-decisiones.png'],
          price: 75,
          rarity: 'RARE',
          title: 'Planta que crece con mentiras',
        }),
        method: 'POST',
      }),
    );
  });

  it('uploads local images before creating a listing', async () => {
    storeSession(userSession);
    const fetchMock = mockCommonFetch();
    const user = userEvent.setup();
    const image = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'planta.png', {
      type: 'image/png',
    });

    renderForm('create');

    await screen.findByRole('heading', { name: 'Publicar objeto imposible' });
    await user.type(screen.getByLabelText('Titulo del objeto'), 'Planta que crece con mentiras');
    await user.type(
      screen.getByLabelText('Descripcion'),
      'Crece unos centimetros cada vez que alguien miente cerca de la maceta.',
    );
    await user.selectOptions(screen.getByLabelText('Dimension de venta'), 'oraculo-norte');
    await user.selectOptions(screen.getByLabelText('Rareza'), 'RARE');
    await user.clear(screen.getByLabelText('Precio'));
    await user.type(screen.getByLabelText('Precio'), '75');
    await user.upload(screen.getByLabelText('Subir imagenes locales'), image);
    await user.click(screen.getByRole('button', { name: 'Publicar objeto' }));

    await waitFor(() => {
      expect(screen.getByText('Anuncio publicado.')).toBeTruthy();
    });

    const uploadCall = fetchMock.mock.calls.find(
      ([url, init]) => String(url).endsWith('/storage/uploads') && init?.method === 'POST',
    );
    const createCall = fetchMock.mock.calls.find(
      ([url, init]) => String(url).endsWith('/listings') && init?.method === 'POST',
    );

    expect(uploadCall?.[1]).toEqual(
      expect.objectContaining({
        method: 'POST',
      }),
    );
    expect(createCall?.[1]).toEqual(
      expect.objectContaining({
        body: expect.stringContaining('http://localhost:3001/uploads/planta-mentiras.png'),
        method: 'POST',
      }),
    );
  });

  it('updates a listing owned by the authenticated user', async () => {
    storeSession(userSession);
    const fetchMock = mockCommonFetch();
    const user = userEvent.setup();
    renderForm('edit', 'brujula-de-decisiones-no-tomadas');

    await screen.findByDisplayValue('Brujula de decisiones no tomadas');
    await user.clear(screen.getByLabelText('Titulo del objeto'));
    await user.type(
      screen.getByLabelText('Titulo del objeto'),
      'Brujula afinada de decisiones no tomadas',
    );
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() => {
      expect(screen.getByText('Anuncio actualizado.')).toBeTruthy();
    });

    const updateCall = fetchMock.mock.calls.find(
      ([url, init]) =>
        String(url).endsWith('/listings/brujula-de-decisiones-no-tomadas') &&
        init?.method === 'PATCH',
    );

    expect(updateCall?.[1]).toEqual(
      expect.objectContaining({
        body: expect.stringContaining('Brujula afinada de decisiones no tomadas'),
        method: 'PATCH',
      }),
    );
  });

  it('blocks editing listings owned by another seller', async () => {
    storeSession(userSession);
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.endsWith('/identity/me')) {
          return Response.json({ user: userSession.user });
        }

        if (url.endsWith('/dimensions')) {
          return Response.json(dimensions);
        }

        if (url.endsWith('/listings/brujula-de-decisiones-no-tomadas')) {
          return Response.json({
            ...listing,
            seller: {
              displayName: 'Nadir Cronal',
              id: 'user-2',
              username: 'nadir-cronal',
            },
          });
        }

        return Response.json(
          { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
          { status: 404 },
        );
      }),
    );

    renderForm('edit', 'brujula-de-decisiones-no-tomadas');

    expect(await screen.findByText('No puedes editar este anuncio')).toBeTruthy();
    expect(screen.getByText('Solo el vendedor original puede modificar este objeto.')).toBeTruthy();
  });
});
