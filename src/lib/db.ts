'use server';

import mysql from 'mysql2/promise';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'User';
}

export interface Client {
  id: string;
  name: string;
  contact: string;
}

export type ToteStatus = 'Con Cliente' | 'Disponible' | 'En Lavado' | 'En Mantenimiento' | 'En Uso' | 'Baja';

export interface Tote {
  id: string;
  status: ToteStatus;
  clientId: string | null;
  lastDispatch: string | null;
}

export interface Database {
  users: User[];
  clients: Client[];
  totes: Tote[];
}

async function getConnection() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL no está definida en las variables de entorno");
    }
  return await mysql.createConnection(process.env.DATABASE_URL);
}

export async function readDb(): Promise<Database> {
  const connection = await getConnection();
  try {
    const [users] = await connection.execute('SELECT id, name, email, role FROM users');
    const [clients] = await connection.execute('SELECT id, name, contact FROM clients');
    const [totes] = await connection.execute('SELECT id, status, client_id as clientId, last_dispatch as lastDispatch FROM totes');

    return {
      users: users as User[],
      clients: clients as Client[],
      totes: (totes as any[]).map(tote => ({
          ...tote,
          lastDispatch: tote.lastDispatch ? new Date(tote.lastDispatch).toISOString() : null
      })) as Tote[],
    };
  } finally {
    await connection.end();
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0] as User;
    } finally {
        await connection.end();
    }
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
    const connection = await getConnection();
    try {
        const [result] = await connection.execute<mysql.ResultSetHeader>(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [user.name, user.email, user.password, user.role]
        );
        const newUser: User = { id: String(result.insertId), ...user };
        return newUser;
    } finally {
        await connection.end();
    }
}
