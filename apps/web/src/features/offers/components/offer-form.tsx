'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { Button, EmptyState, Input, Textarea } from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import type { ListingSummary } from '../../listings/model/listing-types';
import { offersClient } from '../api/offers-client';
import {
  offerFormSchema,
  type OfferFormValues,
  type ParsedOfferFormValues,
} from '../model/offer-schemas';

type OfferFormProps = {
  listing: ListingSummary;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo enviar la oferta.';
}

export function OfferForm({ listing }: OfferFormProps) {
  const { session, user } = useAuth();
  const queryClient = useQueryClient();
  const accessToken = session?.accessToken;
  const isOwner = user?.id === listing.seller.id;
  const isPublished = listing.status === 'PUBLISHED';

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<OfferFormValues>({
    defaultValues: {
      amount: listing.price.amount,
      message: '',
    },
  });

  const createOfferMutation = useMutation({
    mutationFn: async (values: ParsedOfferFormValues) => {
      if (!accessToken) {
        throw new Error('La sesion no esta iniciada.');
      }

      return offersClient.create(
        {
          amount: values.amount,
          listingSlug: listing.slug,
          message: values.message || null,
        },
        accessToken,
      );
    },
    onSuccess: async () => {
      reset({
        amount: listing.price.amount,
        message: '',
      });
      await queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });

  if (!accessToken) {
    return (
      <EmptyState
        action={{ children: 'Iniciar sesion', href: '/auth', variant: 'secondary' }}
        title="Inicia sesion para ofertar"
      >
        Las ofertas requieren una identidad dimensional activa para proteger al comprador y al
        vendedor.
      </EmptyState>
    );
  }

  if (isOwner) {
    return (
      <EmptyState title="Este objeto es tuyo">
        No puedes ofertar por tu propio anuncio. Revisa las ofertas recibidas en el panel del
        vendedor.
      </EmptyState>
    );
  }

  if (!isPublished) {
    return (
      <EmptyState title="Oferta no disponible">
        Solo se pueden enviar ofertas por anuncios publicados.
      </EmptyState>
    );
  }

  const submittedOffer = createOfferMutation.data;

  return (
    <section className="offer-panel" aria-labelledby="offer-form-title">
      <div>
        <p className="eyebrow">Oferta</p>
        <h2 id="offer-form-title">Preparar oferta</h2>
        <p>
          Propón un importe en {listing.price.currencyCode}. El vendedor podrá aceptarla o
          rechazarla desde su panel de anuncio.
        </p>
      </div>

      <form
        className="offer-form"
        onSubmit={(event) => {
          void handleSubmit((values) => {
            const parsed = offerFormSchema.safeParse(values);

            if (!parsed.success) {
              parsed.error.issues.forEach((issue) => {
                const fieldName = issue.path[0];

                if (fieldName === 'amount' || fieldName === 'message') {
                  setError(fieldName, { message: issue.message, type: 'manual' });
                }
              });

              return Promise.resolve();
            }

            return createOfferMutation.mutateAsync(parsed.data);
          })(event);
        }}
      >
        <Input
          error={errors.amount?.message}
          id="offer-amount"
          label="Importe"
          min="1"
          step="1"
          type="number"
          {...register('amount')}
        />
        <Textarea
          error={errors.message?.message}
          hint="Opcional. Maximo 500 caracteres."
          id="offer-message"
          label="Mensaje al vendedor"
          rows={4}
          {...register('message')}
        />

        {createOfferMutation.isError ? (
          <p className="auth-error" role="alert">
            {getErrorMessage(createOfferMutation.error)}
          </p>
        ) : null}

        {submittedOffer ? (
          <p className="listing-form-success" aria-live="polite">
            Oferta enviada por {submittedOffer.amount.amount} {submittedOffer.amount.currencyCode}.
            Puedes revisarla en <a href="/offers">Mis ofertas</a>.
          </p>
        ) : null}

        <div className="listing-form-actions">
          <Button disabled={isSubmitting || createOfferMutation.isPending} type="submit">
            {createOfferMutation.isPending ? 'Enviando oferta' : 'Enviar oferta'}
          </Button>
          <Button href="/offers" variant="secondary">
            Ver mis ofertas
          </Button>
        </div>
      </form>
    </section>
  );
}
