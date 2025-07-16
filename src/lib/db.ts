'use server';

import * as mssql from 'mssql';

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

// Configuración directa de la conexión a SQL Server
const config = {
    user: 'sa',
    password: '123',
    server: 'localhost',
    port: 1433,
    database: 'Prueba',
    options: {
        encrypt: true, // Para conexiones Azure
        trustServerCertificate: true // Cambiar a false para producción
    }
};

async function getConnection() {
    return await mssql.connect(config);
}

export async function readDb(): Promise<Database> {
  const connection = await getConnection();
  try {
    const usersResult = await connection.request().query('SELECT Id as id, Name as name, Email as email, Role as role FROM Users');
    const clientsResult = await connection.request().query('SELECT Id as id, Name as name, Contact as contact FROM Clients');
    const totesResult = await connection.request().query('SELECT Id as id, Status as status, ClientId as clientId, LastDispatch as lastDispatch FROM Totes');

    return {
      users: usersResult.recordset as User[],
      clients: clientsResult.recordset as Client[],
      totes: totesResult.recordset.map(tote => ({
          ...tote,
          lastDispatch: tote.lastDispatch ? new Date(tote.lastDispatch).toISOString() : null
      })) as Tote[],
    };
  } finally {
    await connection.close();
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const connection = await getConnection();
    try {
        const result = await connection.request()
            .input('email', mssql.VarChar, email)
            .query('SELECT Id as id, Name as name, Email as email, Password as password, Role as role FROM Users WHERE Email = @email');
        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset[0] as User;
    } finally {
        await connection.close();
    }
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
    const connection = await getConnection();
    try {
        const result = await connection.request()
            .input('name', mssql.VarChar, user.name)
            .input('email', mssql.VarChar, user.email)
            .input('password', mssql.VarChar, user.password)
            .input('role', mssql.VarChar, user.role)
            .query('INSERT INTO Users (Name, Email, Password, Role) OUTPUT INSERTED.Id as id VALUES (@name, @email, @password, @role)');
        
        const newUser: User = { id: result.recordset[0].id, ...user };
        return newUser;
    } finally {
        await connection.close();
    }
}
