import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button, EmptyState, Input, ListingCard, RarityBadge, Select, Skeleton, Textarea } from '.';

describe('shared components', () => {
  it('renders button links and buttons with accessible names', () => {
    render(
      <div>
        <Button href="/#explorar">Explorar</Button>
        <Button variant="secondary">Guardar</Button>
      </div>,
    );

    expect(screen.getByRole('link', { name: 'Explorar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeTruthy();
  });

  it('associates form labels, hints and errors', () => {
    render(
      <form>
        <Input
          error="El titulo es obligatorio."
          hint="Usa el nombre visible del objeto."
          id="listing-title"
          label="Titulo"
        />
        <Select label="Rareza">
          <option>Raro</option>
        </Select>
        <Textarea
          error="Describe el objeto con mas detalle."
          id="listing-description"
          label="Descripcion"
        />
      </form>,
    );

    const titleField = screen.getByLabelText('Titulo');
    const titleDescriptionIds = titleField.getAttribute('aria-describedby')?.split(' ');

    expect(titleDescriptionIds).toEqual(['listing-title-hint', 'listing-title-error']);
    expect(document.getElementById('listing-title-hint')?.textContent).toContain(
      'Usa el nombre visible del objeto.',
    );
    expect(document.getElementById('listing-title-error')?.textContent).toContain(
      'El titulo es obligatorio.',
    );
    expect(screen.getByLabelText('Rareza')).toBeTruthy();
    expect(screen.getByLabelText('Descripcion').getAttribute('aria-invalid')).toBe('true');
    expect(
      screen
        .getAllByRole('alert')
        .map((alert) => alert.textContent)
        .join(' '),
    ).toContain('Describe el objeto con mas detalle.');
  });

  it('renders marketplace display components', () => {
    render(
      <div>
        <RarityBadge rarity="LEGENDARY" />
        <ListingCard
          dimensionName="Archivo Horizonte"
          href="/listings/mapa"
          price="260 MAP"
          rarity="LEGENDARY"
          title="Mapa de lugares que aun no existen"
        />
        <EmptyState
          action={{ children: 'Publicar objeto', href: '/#publicar', variant: 'primary' }}
          title="Aun no hay objetos"
        >
          Publica el primer objeto de esta dimension.
        </EmptyState>
        <Skeleton />
      </div>,
    );

    expect(screen.getAllByText('Legendario')).toHaveLength(2);
    expect(screen.getByRole('article')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Ver objeto' })).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: 'Ver Mapa de lugares que aun no existen' })
        .getAttribute('href'),
    ).toBe('/listings/mapa');
    expect(screen.getByRole('heading', { name: 'Aun no hay objetos' })).toBeTruthy();
    expect(screen.getByRole('status', { name: 'Cargando contenido' })).toBeTruthy();
  });
});
