import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { ReviewSummary } from '../../reviews/model/review-types';
import type { UserProfile } from '../model/user-types';
import { UserProfilePage } from './user-profile-page';

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

const profileFixture: UserProfile = {
  avatarUrl: '/images/demo/users/lyra-oraculo.png',
  bio: 'Cartografa de objetos imposibles y contratos escritos en tinta reversible.',
  displayName: 'Lyra del Oraculo',
  homeDimension: {
    id: 'dimension-1',
    name: 'Oraculo Norte',
    slug: 'oraculo-norte',
  },
  id: 'user-1',
  reputation: 87.4,
  role: 'USER',
  status: 'ACTIVE',
  username: 'lyra-oraculo',
};

const reviewFixture: ReviewSummary = {
  comment: 'Entrega impecable, portal estable y objeto envuelto contra paradojas.',
  createdAt: '2026-07-14T11:00:00.000Z',
  id: 'review-1',
  rating: 5,
  reviewee: {
    displayName: 'Lyra del Oraculo',
    id: 'user-1',
    username: 'lyra-oraculo',
  },
  reviewer: {
    displayName: 'Nadir Cronal',
    id: 'user-2',
    username: 'nadir-cronal',
  },
  transaction: {
    completedAt: '2026-07-14T10:30:00.000Z',
    id: 'transaction-1',
    listing: {
      id: 'listing-1',
      slug: 'brujula-de-decisiones-no-tomadas',
      title: 'Brujula de decisiones no tomadas',
    },
  },
  updatedAt: '2026-07-14T11:00:00.000Z',
};

function renderProfilePage(username?: string) {
  return render(
    <AppProviders>
      {username ? <UserProfilePage username={username} /> : <UserProfilePage />}
    </AppProviders>,
  );
}

describe('UserProfilePage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks for authentication before showing the current profile', () => {
    renderProfilePage();

    expect(screen.getByText('Necesitas una identidad dimensional')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Iniciar sesion' })).toBeTruthy();
  });

  it('loads the authenticated user profile from the local API', async () => {
    storeSession(userSession);
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/users/lyra-oraculo')) {
        return Response.json(profileFixture);
      }

      if (url.endsWith('/users/lyra-oraculo/reviews')) {
        return Response.json([reviewFixture]);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    renderProfilePage();

    expect(await screen.findByRole('heading', { level: 1, name: 'Lyra del Oraculo' })).toBeTruthy();
    expect(screen.getByText('@lyra-oraculo')).toBeTruthy();
    expect(screen.getByAltText('Avatar de Lyra del Oraculo')).toBeTruthy();
    expect(screen.getByText('Tu perfil')).toBeTruthy();
    expect(screen.getByText('87 puntos')).toBeTruthy();
    expect(screen.getAllByText('Oraculo Norte').length).toBeGreaterThan(1);
    expect(screen.getByText('Usuario')).toBeTruthy();
    expect(screen.getByText('Activo')).toBeTruthy();
  });

  it('loads public profiles without requiring a session', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.endsWith('/users/lyra-oraculo')) {
        return Response.json(profileFixture);
      }

      if (url.endsWith('/users/lyra-oraculo/reviews')) {
        return Response.json([reviewFixture]);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    renderProfilePage('lyra-oraculo');

    expect(
      await screen.findByText(
        'Cartografa de objetos imposibles y contratos escritos en tinta reversible.',
      ),
    ).toBeTruthy();
    expect(await screen.findByText('Reputacion recibida')).toBeTruthy();
    expect(screen.getByText('5 estrellas')).toBeTruthy();
    expect(screen.getByText('Brujula de decisiones no tomadas')).toBeTruthy();
    expect(
      screen.getByText('Entrega impecable, portal estable y objeto envuelto contra paradojas.'),
    ).toBeTruthy();
    expect(screen.queryByText('Tu perfil')).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/users/lyra-oraculo',
      expect.objectContaining({
        headers: expect.any(Object),
      }),
    );
  });

  it('shows a not found state for missing profiles', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json(
          { code: 'USER_NOT_FOUND', message: 'Usuario no encontrado.' },
          { status: 404 },
        ),
      ),
    );

    renderProfilePage('nadie');

    expect(await screen.findByText('Perfil no encontrado')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Volver al mercado' })).toBeTruthy();
  });
});
