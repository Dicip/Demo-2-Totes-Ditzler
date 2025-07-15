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
    return { error: 'Invalid fields!' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = users.find((user) => user.email === email);

  if (!existingUser || existingUser.password !== password) {
    failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
    return { error: 'Invalid email or password.' };
  }
  
  // Reset failed attempts on successful login
  delete failedLoginAttempts[email];

  cookies().set('auth_token', existingUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  redirect('/dashboard');
}

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  
  const { name, email, password } = validatedFields.data;
  
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return { error: 'An account with this email already exists.' };
  }
  
  // This is a mock. In a real app, you would hash the password.
  users.push({ id: String(users.length + 1), name, email, password, role: 'USER' });

  return { success: 'Registration successful! You can now log in.' };
}

export async function forgotPassword(
  values: z.infer<typeof ForgotPasswordSchema>
) {
  const validatedFields = ForgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid email!' };
  }

  const { email } = validatedFields.data;
  const existingUser = users.find((user) => user.email === email);

  if (!existingUser) {
    return { error: 'No account found with this email.' };
  }

  // In a real app, you would generate a secure token and send an email.
  console.log(`Password reset link for ${email} would be sent here.`);

  return { success: 'Password reset instructions sent to your email.' };
}

export async function logout() {
  cookies().delete('auth_token');
  redirect('/login');
}
