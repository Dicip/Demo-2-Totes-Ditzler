'use server';

import * as z from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';

import {
  LoginSchema,
  RegisterSchema,
  ForgotPasswordSchema,
} from '@/lib/schemas';
import { getUserByEmail, createUser } from '@/lib/db';

// Constantes para seguridad
const TOKEN_EXPIRY = 60 * 60 * 24; // 1 día en segundos
const MAX_LOGIN_ATTEMPTS = 5;

// Mapa para seguimiento de intentos de inicio de sesión (en producción usar Redis)
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();

/**
 * Función de inicio de sesión
 */
export async function login(values: z.infer<typeof LoginSchema>) {
  try {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: '¡Campos inválidos!' };
    }

    const { email, password } = validatedFields.data;
    
    // Verificar intentos de inicio de sesión
    const ipAddress = '127.0.0.1'; // En producción, obtener IP real
    const attemptKey = `${ipAddress}:${email}`;
    const attempt = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
    
    // Verificar si está bloqueado por demasiados intentos
    const now = Date.now();
    if (attempt.count >= MAX_LOGIN_ATTEMPTS && now - attempt.lastAttempt < 15 * 60 * 1000) {
      return { error: 'Demasiados intentos fallidos. Intente nuevamente más tarde.' };
    }

    const existingUser = await getUserByEmail(email);

    if (!existingUser || existingUser.password !== password) {
      // Incrementar contador de intentos fallidos
      loginAttempts.set(attemptKey, {
        count: attempt.count + 1,
        lastAttempt: now
      });
      return { error: 'Email o contraseña inválidos.' };
    }

    // Reiniciar contador de intentos
    loginAttempts.delete(attemptKey);

    // Generar token seguro
    const sessionToken = randomUUID();
    
    // Establecer cookie segura
    cookies().set('auth_token', sessionToken, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: TOKEN_EXPIRY,
    });

    // Almacenar mapeo de token a usuario (en producción usar base de datos)
    // sessionStore.set(sessionToken, existingUser.id);

    redirect('/dashboard');
  } catch (error) {
    console.error('Error en login:', error);
    return { error: 'Error al iniciar sesión. Intente nuevamente.' };
  }
}

/**
 * Función de registro de usuario
 */
export async function register(values: z.infer<typeof RegisterSchema>) {
  try {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: '¡Campos inválidos!' };
    }
    
    const { name, email, password } = validatedFields.data;
    
    // Verificar si el usuario ya existe
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: 'Ya existe una cuenta con este email.' };
    }
    
    // En producción, hashear la contraseña antes de almacenarla
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear el usuario con datos validados
    await createUser({
      name, 
      email, 
      password, // En producción: hashedPassword
      role: 'User' as const 
    });

    return { success: '¡Registro exitoso! Ahora puedes iniciar sesión.' };
  } catch (error) {
    console.error('Error en registro:', error);
    return { error: 'Error al registrar usuario. Intente nuevamente.' };
  }
}

/**
 * Función para solicitar restablecimiento de contraseña
 */
export async function forgotPassword(
  values: z.infer<typeof ForgotPasswordSchema>
) {
  try {
    const validatedFields = ForgotPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: '¡Email inválido!' };
    }

    const { email } = validatedFields.data;
    
    // Verificar si el usuario existe
    const existingUser = await getUserByEmail(email);

    // Por seguridad, no revelar si el usuario existe o no
    if (!existingUser) {
      // Simular tiempo de procesamiento para prevenir timing attacks
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: 'Si existe una cuenta con este email, se han enviado las instrucciones para restablecer la contraseña.' };
    }

    // Generar token único para restablecer contraseña
    const resetToken = randomUUID();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hora
    
    // En producción, almacenar token y expiración en base de datos
    // await storeResetToken(existingUser.id, resetToken, resetTokenExpiry);
    
    // En producción, enviar email con enlace para restablecer contraseña
    console.log(`El enlace para restablecer la contraseña de ${email} se enviaría aquí: /reset-password?token=${resetToken}`);

    return { success: 'Si existe una cuenta con este email, se han enviado las instrucciones para restablecer la contraseña.' };
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    return { error: 'Error al procesar la solicitud. Intente nuevamente.' };
  }
}

/**
 * Función para cerrar sesión
 */
export async function logout() {
  try {
    // Eliminar cookie de sesión
    cookies().delete('auth_token');
    
    // En producción, invalidar sesión en base de datos
    // await invalidateSession(sessionToken);
    
    // Redireccionar a página de inicio de sesión
    redirect('/login');
  } catch (error) {
    console.error('Error en logout:', error);
    // Forzar redirección incluso si hay error
    redirect('/login');
  }
}
