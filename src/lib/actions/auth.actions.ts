'use server';

import * as z from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  LoginSchema,
  RegisterSchema,
  ForgotPasswordSchema,
} from '@/lib/schemas';

// Mock user database
const users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'USER',
  },
];

let failedLoginAttempts: Record<string, number> = {};

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: '¡Campos inválidos!' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = users.find((user) => user.email === email);

  if (!existingUser || existingUser.password !== password) {
    failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
    return { error: 'Email o contraseña inválidos.' };
  }
  
  // Reset failed attempts on successful login
  delete failedLoginAttempts[email];

  cookies().set('auth_token', existingUser.id, {
    // httpOnly: true, // This must be false for the client-side check to work
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  redirect('/dashboard');
}

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: '¡Campos inválidos!' };
  }
  
  const { name, email, password } = validatedFields.data;
  
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return { error: 'Ya existe una cuenta con este email.' };
  }
  
  // This is a mock. In a real app, you would hash the password.
  users.push({ id: String(users.length + 1), name, email, password, role: 'USER' });

  return { success: '¡Registro exitoso! Ahora puedes iniciar sesión.' };
}

export async function forgotPassword(
  values: z.infer<typeof ForgotPasswordSchema>
) {
  const validatedFields = ForgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: '¡Email inválido!' };
  }

  const { email } = validatedFields.data;
  const existingUser = users.find((user) => user.email === email);

  if (!existingUser) {
    return { error: 'No se encontró una cuenta con este email.' };
  }

  // In a real app, you would generate a secure token and send an email.
  console.log(`El enlace para restablecer la contraseña de ${email} se enviaría aquí.`);

  return { success: 'Se han enviado las instrucciones para restablecer la contraseña a tu email.' };
}

export async function logout() {
  cookies().delete('auth_token');
  redirect('/login');
}
