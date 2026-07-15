'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm, type FieldValues, type Path, type UseFormSetError } from 'react-hook-form';
import type { z } from 'zod';

import { dimensionsClient } from '../../dimensions/api/dimensions-client';
import {
  Button,
  EmptyState,
  Input,
  Select,
  Skeleton,
  Textarea,
  rarityValues,
} from '../../../shared/components';
import { useAuth } from '../../auth/model/use-auth';
import { listingsClient, ListingsApiError } from '../api/listings-client';
import { rarityLabels } from '../model/listing-formatters';
import {
  listingFormSchema,
  parseImageUrls,
  type ListingFormValues,
  type ParsedListingFormValues,
} from '../model/listing-schemas';
import type { ListingSummary, SaveListingInput } from '../model/listing-types';
import { storageClient, StorageApiError } from '../../storage/api/storage-client';

type ListingFormMode = 'create' | 'edit';

type ListingFormProps = {
  mode: ListingFormMode;
  slug?: string;
};

function applySchemaErrors<TValues extends FieldValues>(
  error: z.ZodError<TValues>,
  setError: UseFormSetError<TValues>,
): void {
  for (const issue of error.issues) {
    const fieldName = issue.path[0];

    if (typeof fieldName === 'string') {
      setError(fieldName as Path<TValues>, {
        message: issue.message,
        type: 'manual',
      });
    }
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof StorageApiError) {
    return error.message;
  }

  if (error instanceof ListingsApiError) {
    if (error.code === 'INVALID_AUTHORIZATION_HEADER') {
      return 'Inicia sesion antes de publicar o editar objetos.';
    }

    if (error.code === 'LISTING_FORBIDDEN') {
      return 'Solo el vendedor puede editar este anuncio.';
    }

    if (error.code === 'LISTING_NOT_EDITABLE') {
      return 'Este anuncio ya no puede editarse.';
    }

    if (error.code === 'DIMENSION_NOT_FOUND') {
      return 'La dimension seleccionada no existe en el mercado local.';
    }

    return error.message;
  }

  return 'Ha ocurrido un error inesperado.';
}

function toSaveListingInput(
  values: ParsedListingFormValues,
  uploadedImageUrls: string[] = [],
): SaveListingInput {
  return {
    description: values.description,
    dimensionSlug: values.dimensionSlug,
    imageUrls: [...parseImageUrls(values.imageUrls), ...uploadedImageUrls],
    price: values.price,
    rarity: values.rarity,
    title: values.title,
  };
}

function toFormValues(listing: ListingSummary): ListingFormValues {
  return {
    description: listing.description,
    dimensionSlug: listing.dimension.slug,
    imageUrls: listing.imageUrls.join('\n'),
    price: listing.price.amount,
    rarity: listing.rarity,
    title: listing.title,
  };
}

export function ListingForm({ mode, slug }: ListingFormProps) {
  const { isAuthenticated, session, user } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [savedListing, setSavedListing] = useState<ListingSummary | null>(null);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const isEditing = mode === 'edit';

  const dimensionsQuery = useQuery({
    queryFn: dimensionsClient.list,
    queryKey: ['dimensions'],
  });

  const listingQuery = useQuery({
    enabled: isEditing && Boolean(slug),
    queryFn: () => listingsClient.getBySlug(slug ?? ''),
    queryKey: ['listings', slug, 'edit'],
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ListingFormValues>({
    defaultValues: {
      description: '',
      dimensionSlug: '',
      imageUrls: '',
      price: 1,
      rarity: 'COMMON',
      title: '',
    },
  });

  useEffect(() => {
    if (listingQuery.data) {
      reset(toFormValues(listingQuery.data));
    }
  }, [listingQuery.data, reset]);

  async function onSubmit(values: ListingFormValues): Promise<void> {
    setFormError(null);
    setSavedListing(null);

    const result = listingFormSchema.safeParse(values);

    if (!result.success) {
      applySchemaErrors(result.error, setError);
      return;
    }

    if (!session?.accessToken) {
      setFormError('Inicia sesion antes de publicar o editar objetos.');
      return;
    }

    try {
      const existingImageUrls = parseImageUrls(result.data.imageUrls);

      if (existingImageUrls.length + selectedImageFiles.length > 8) {
        setError('imageUrls', {
          message: 'Puedes asociar como maximo 8 imagenes.',
          type: 'manual',
        });
        return;
      }

      const uploadedImages =
        selectedImageFiles.length > 0
          ? await storageClient.uploadImages(selectedImageFiles, session.accessToken)
          : [];
      const payload = toSaveListingInput(
        result.data,
        uploadedImages.map((image) => image.url),
      );
      const nextListing =
        isEditing && slug
          ? await listingsClient.update(slug, payload, session.accessToken)
          : await listingsClient.create(payload, session.accessToken);

      setSavedListing(nextListing);
      setSelectedImageFiles([]);
    } catch (error: unknown) {
      setFormError(getErrorMessage(error));
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="listing-form-page">
        <EmptyState
          action={{ children: 'Iniciar sesion', href: '/auth', variant: 'secondary' }}
          title="Necesitas una identidad dimensional"
        >
          Inicia sesion para publicar o editar objetos en Wormarket.
        </EmptyState>
      </section>
    );
  }

  if (dimensionsQuery.isPending || (isEditing && listingQuery.isPending)) {
    return (
      <section className="listing-form-page" aria-busy="true" aria-label="Cargando formulario">
        <Skeleton label="Cargando formulario" />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </section>
    );
  }

  if (dimensionsQuery.isError || listingQuery.isError) {
    return (
      <section className="listing-form-page">
        <div className="explorer-error" role="alert">
          <h1>No se pudo preparar el formulario</h1>
          <p>
            {dimensionsQuery.isError
              ? 'No se pudieron cargar las dimensiones.'
              : getErrorMessage(listingQuery.error)}
          </p>
        </div>
      </section>
    );
  }

  if (isEditing && listingQuery.data && listingQuery.data.seller.id !== user?.id) {
    return (
      <section className="listing-form-page">
        <EmptyState
          action={{
            children: 'Volver al anuncio',
            href: `/listings/${listingQuery.data.slug}`,
            variant: 'secondary',
          }}
          title="No puedes editar este anuncio"
        >
          Solo el vendedor original puede modificar este objeto.
        </EmptyState>
      </section>
    );
  }

  return (
    <section className="listing-form-page" aria-labelledby="listing-form-title">
      <div className="listing-form-intro">
        <p className="eyebrow">{isEditing ? 'Editar objeto' : 'Publicacion local'}</p>
        <h1 id="listing-form-title">
          {isEditing ? 'Editar anuncio' : 'Publicar objeto imposible'}
        </h1>
        <p>
          Completa los datos visibles para compradores. Las imagenes usan URLs locales o publicas
          durante esta fase, o se suben al almacenamiento local de desarrollo.
        </p>
      </div>

      <form className="listing-form" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <Input error={errors.title?.message} label="Titulo del objeto" {...register('title')} />
        <Textarea
          error={errors.description?.message}
          label="Descripcion"
          {...register('description')}
        />
        <div className="listing-form-grid">
          <Select
            error={errors.dimensionSlug?.message}
            label="Dimension de venta"
            {...register('dimensionSlug')}
          >
            <option value="">Selecciona una dimension</option>
            {dimensionsQuery.data.map((dimension) => (
              <option key={dimension.slug} value={dimension.slug}>
                {dimension.name} ({dimension.currencyCode})
              </option>
            ))}
          </Select>
          <Select error={errors.rarity?.message} label="Rareza" {...register('rarity')}>
            {rarityValues.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarityLabels[rarity]}
              </option>
            ))}
          </Select>
          <Input
            error={errors.price?.message}
            label="Precio"
            min="0"
            step="0.01"
            type="number"
            {...register('price')}
          />
        </div>
        <Textarea
          error={errors.imageUrls?.message}
          hint="Una URL por linea o separadas por comas. Tambien puedes subir archivos locales. Maximo 8 imagenes."
          label="URLs de imagenes"
          {...register('imageUrls')}
        />
        <Input
          accept="image/jpeg,image/png,image/webp,image/gif"
          hint={
            selectedImageFiles.length > 0
              ? `${selectedImageFiles.length} imagen(es) seleccionada(s). Maximo 2 MB por archivo.`
              : 'JPG, PNG, WebP o GIF. Maximo 2 MB por archivo.'
          }
          label="Subir imagenes locales"
          multiple
          type="file"
          onChange={(event) => {
            setSelectedImageFiles(Array.from(event.currentTarget.files ?? []));
          }}
        />

        {formError ? (
          <p className="auth-error" role="alert">
            {formError}
          </p>
        ) : null}

        {savedListing ? (
          <p className="listing-form-success" role="status">
            {isEditing ? 'Anuncio actualizado.' : 'Anuncio publicado.'}{' '}
            <a href={`/listings/${savedListing.slug}`}>Ver objeto</a>
          </p>
        ) : null}

        <div className="listing-form-actions">
          <Button type="submit">
            {isSubmitting
              ? isEditing
                ? 'Guardando cambios...'
                : 'Publicando objeto...'
              : isEditing
                ? 'Guardar cambios'
                : 'Publicar objeto'}
          </Button>
          <Button href="/#explorar" variant="secondary">
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
