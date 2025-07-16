'use server';

import * as z from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  LoginSchema,
  RegisterSchema,
  ForgotPasswordSchema,
} from '@/lib/schemas';
import { readDb, writeDb } from '@/lib/db';

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: '¡Campos inválidos!' };
  }

  const { email, password } = validatedFields.data;

  const db = await readDb();
  const existingUser = db.users.find((user) => user.email === email);

  if (!existingUser || existingUser.password !== password) {
    return { error: 'Email o contraseña inválidos.' };
  }

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
  
  const db = await readDb();
  const existingUser = db.users.find((user) => user.email === email);

  if (existingUser) {
    return { error: 'Ya existe una cuenta con este email.' };
  }
  
  // This is a mock. In a real app, you would hash the password.
  const newUser = { 
    id: String(db.users.length + 1), 
    name, 
    email, 
    password, 
    role: 'User' as const 
  };
  db.users.push(newUser);
  await writeDb(db);

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
  const db = await readDb();
  const existingUser = db.users.find((user) => user.email === email);

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
