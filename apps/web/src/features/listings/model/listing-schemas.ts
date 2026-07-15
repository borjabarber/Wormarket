import { z } from 'zod';

import { rarityValues } from '../../../shared/components';

export const listingFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, 'Describe el objeto con al menos 10 caracteres.')
    .max(2000, 'La descripcion no puede superar 2000 caracteres.'),
  dimensionSlug: z.string().trim().min(1, 'Selecciona una dimension.'),
  imageUrls: z.string().trim().max(1200, 'Las URLs de imagen son demasiado largas.'),
  price: z.coerce
    .number({ error: 'Indica un precio valido.' })
    .positive('El precio debe ser mayor que cero.'),
  rarity: z.enum(rarityValues, {
    error: 'Selecciona una rareza valida.',
  }),
  title: z
    .string()
    .trim()
    .min(3, 'El titulo debe tener al menos 3 caracteres.')
    .max(120, 'El titulo no puede superar 120 caracteres.'),
});

export type ListingFormValues = z.input<typeof listingFormSchema>;
export type ParsedListingFormValues = z.output<typeof listingFormSchema>;

export function parseImageUrls(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((imageUrl) => imageUrl.trim())
    .filter(Boolean)
    .slice(0, 8);
}
