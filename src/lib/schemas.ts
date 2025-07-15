import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'A valid email is required.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: 'A valid email is required.',
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
    confirmPassword: z.string(),
    name: z.string().min(1, {
      message: 'Name is required.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'A valid email is required.',
  }),
});
