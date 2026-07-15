import { z } from 'zod';

import { reportReasons } from './moderation-types';

export const createReportSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, 'Describe que ocurre con al menos 10 caracteres.')
    .max(1000, 'La denuncia no puede superar 1000 caracteres.'),
  reason: z.enum(reportReasons, {
    error: 'Selecciona un motivo valido.',
  }),
});

export const resolveReportSchema = z.object({
  resolution: z
    .string()
    .trim()
    .min(5, 'Anade una resolucion de al menos 5 caracteres.')
    .max(1000, 'La resolucion no puede superar 1000 caracteres.'),
});

export type CreateReportFormValues = z.infer<typeof createReportSchema>;
export type ResolveReportFormValues = z.infer<typeof resolveReportSchema>;
