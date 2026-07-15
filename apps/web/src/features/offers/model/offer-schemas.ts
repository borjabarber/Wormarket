import { z } from 'zod';

export const offerFormSchema = z.object({
  amount: z.coerce
    .number({ error: 'Indica un importe valido.' })
    .positive('La oferta debe ser mayor que cero.'),
  message: z.string().trim().max(500, 'El mensaje no puede superar 500 caracteres.'),
});

export type OfferFormValues = z.input<typeof offerFormSchema>;
export type ParsedOfferFormValues = z.output<typeof offerFormSchema>;
