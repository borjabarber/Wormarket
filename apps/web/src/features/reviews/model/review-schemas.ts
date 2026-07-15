import { z } from 'zod';

export const reviewFormSchema = z.object({
  comment: z.string().trim().max(600, 'El comentario no puede superar 600 caracteres.'),
  rating: z.coerce
    .number({ error: 'Elige una puntuacion valida.' })
    .int('La puntuacion debe ser un numero entero.')
    .min(1, 'La puntuacion minima es 1 estrella.')
    .max(5, 'La puntuacion maxima es 5 estrellas.'),
});

export type ReviewFormValues = z.input<typeof reviewFormSchema>;
export type ParsedReviewFormValues = z.output<typeof reviewFormSchema>;
