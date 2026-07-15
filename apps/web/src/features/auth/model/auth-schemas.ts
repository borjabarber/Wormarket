import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Indica tu correo dimensional.')
  .email('El correo debe tener un formato valido.');

const passwordSchema = z
  .string()
  .min(8, 'La contrasena debe tener al menos 8 caracteres.')
  .regex(/[A-Za-z]/, 'Incluye al menos una letra.')
  .regex(/[0-9]/, 'Incluye al menos un numero.');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Indica tu contrasena.'),
});

export const registerSchema = z.object({
  bio: z
    .string()
    .trim()
    .min(10, 'Describe tu perfil con al menos 10 caracteres.')
    .max(280, 'La biografia no puede superar 280 caracteres.'),
  displayName: z
    .string()
    .trim()
    .min(2, 'El nombre visible debe tener al menos 2 caracteres.')
    .max(80, 'El nombre visible no puede superar 80 caracteres.'),
  email: emailSchema,
  homeDimensionSlug: z.string().trim().min(1, 'Elige una dimension de origen.'),
  password: passwordSchema,
  username: z
    .string()
    .trim()
    .min(3, 'El alias debe tener al menos 3 caracteres.')
    .max(32, 'El alias no puede superar 32 caracteres.')
    .regex(/^[a-z0-9-]+$/, 'Usa minusculas, numeros y guiones.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
