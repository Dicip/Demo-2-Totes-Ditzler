'use server';

import sql from 'mssql';

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

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', 
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
  },
};


async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error('Error de conexión con la base de datos:', err);
        throw new Error('No se pudo conectar a la base de datos SQL Server.');
    }
}

export async function readDb(): Promise<Database> {
  const pool = await getConnection();
  try {
    const usersResult = await pool.request().query('SELECT id, name, email, role FROM users');
    const clientsResult = await pool.request().query('SELECT id, name, contact FROM clients');
    const totesResult = await pool.request().query('SELECT id, status, client_id as clientId, last_dispatch as lastDispatch FROM totes');
    
    return {
      users: usersResult.recordset as User[],
      clients: clientsResult.recordset as Client[],
      totes: (totesResult.recordset as any[]).map(tote => ({
          ...tote,
          lastDispatch: tote.lastDispatch ? new Date(tote.lastDispatch).toISOString() : null
      })) as Tote[],
    };
  } finally {
    await pool.close();
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const pool = await getConnection();
    try {
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT id, name, email, password, role FROM users WHERE email = @email');

        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset[0] as User;
    } finally {
        await pool.close();
    }
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
    const pool = await getConnection();
    try {
        const result = await pool.request()
            .input('name', sql.NVarChar, user.name)
            .input('email', sql.NVarChar, user.email)
            .input('password', sql.NVarChar, user.password)
            // SQL Server no soporta el tipo ENUM directamente, se asume NVarChar
            .input('role', sql.NVarChar, user.role)
            .query('INSERT INTO users (name, email, password, role) OUTPUT INSERTED.id VALUES (@name, @email, @password, @role)');
        
        const newUserId = result.recordset[0].id;
        const newUser: User = { id: String(newUserId), ...user };
        return newUser;
    } finally {
        await pool.close();
    }
}
