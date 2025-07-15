import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Se requiere un email válido.',
  }),
  password: z.string().min(1, {
    message: 'La contraseña es requerida.',
  }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: 'Se requiere un email válido.',
    }),
    password: z.string().min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres.',
    }),
    confirmPassword: z.string(),
    name: z.string().min(1, {
      message: 'El nombre es requerido.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ['confirmPassword'],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'Se requiere un email válido.',
  }),
});
