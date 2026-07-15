import { z } from 'zod';

export const messageFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Escribe un mensaje antes de enviarlo.')
    .max(2000, 'El mensaje no puede superar 2000 caracteres.'),
});

export type MessageFormValues = z.input<typeof messageFormSchema>;
export type ParsedMessageFormValues = z.output<typeof messageFormSchema>;
