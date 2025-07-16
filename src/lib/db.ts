'use server';

<<<<<<< HEAD
import sql from 'mssql';
=======
import * as mssql from 'mssql';
>>>>>>> 788ae29bae1c7188df275a3308132b8150b7360c

// Interfaces de datos
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

<<<<<<< HEAD
// Configuración de la conexión a SQL Server
=======
<<<<<<< HEAD
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
=======
// Configuración directa de la conexión a SQL Server
>>>>>>> e82f00054191ea0f8357128bea7a46af0176d008
const config = {
    user: 'sa',
    password: '123',
    server: 'localhost',
    port: 1433,
    database: 'Prueba',
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Pool de conexiones para mejor rendimiento
const pool = new mssql.ConnectionPool(config);
const poolConnect = pool.connect();

// Función para obtener conexión del pool
async function getConnection() {
<<<<<<< HEAD
    await poolConnect;
    return pool;
=======
    return await mssql.connect(config);
>>>>>>> 788ae29bae1c7188df275a3308132b8150b7360c
>>>>>>> e82f00054191ea0f8357128bea7a46af0176d008
}

/**
 * Lee todos los datos de la base de datos
 * @returns Objeto con usuarios, clientes y totes
 */
export async function readDb(): Promise<Database> {
<<<<<<< HEAD
  const connection = await getConnection();
  
  try {
    // Usar transacción para mejorar consistencia
    const transaction = new mssql.Transaction(connection);
    await transaction.begin();
    
    try {
      // Ejecutar consultas en paralelo para mejorar rendimiento
      const [usersResult, clientsResult, totesResult] = await Promise.all([
        transaction.request().query('SELECT Id as id, Name as name, Email as email, Role as role FROM Users'),
        transaction.request().query('SELECT Id as id, Name as name, Contact as contact FROM Clients'),
        transaction.request().query('SELECT Id as id, Status as status, ClientId as clientId, LastDispatch as lastDispatch FROM Totes')
      ]);
      
      await transaction.commit();
      
      return {
        users: usersResult.recordset as User[],
        clients: clientsResult.recordset as Client[],
        totes: totesResult.recordset.map(tote => ({
          ...tote,
          lastDispatch: tote.lastDispatch ? new Date(tote.lastDispatch).toISOString() : null
        })) as Tote[],
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error al leer la base de datos:', error);
    throw new Error('Error al obtener datos de la base de datos');
=======
  const pool = await getConnection();
  try {
<<<<<<< HEAD
    const usersResult = await pool.request().query('SELECT id, name, email, role FROM users');
    const clientsResult = await pool.request().query('SELECT id, name, contact FROM clients');
    const totesResult = await pool.request().query('SELECT id, status, client_id as clientId, last_dispatch as lastDispatch FROM totes');
    
    return {
      users: usersResult.recordset as User[],
      clients: clientsResult.recordset as Client[],
      totes: (totesResult.recordset as any[]).map(tote => ({
=======
    const usersResult = await connection.request().query('SELECT Id as id, Name as name, Email as email, Role as role FROM Users');
    const clientsResult = await connection.request().query('SELECT Id as id, Name as name, Contact as contact FROM Clients');
    const totesResult = await connection.request().query('SELECT Id as id, Status as status, ClientId as clientId, LastDispatch as lastDispatch FROM Totes');

    return {
      users: usersResult.recordset as User[],
      clients: clientsResult.recordset as Client[],
      totes: totesResult.recordset.map(tote => ({
>>>>>>> 788ae29bae1c7188df275a3308132b8150b7360c
          ...tote,
          lastDispatch: tote.lastDispatch ? new Date(tote.lastDispatch).toISOString() : null
      })) as Tote[],
    };
  } finally {
<<<<<<< HEAD
    await pool.close();
=======
    await connection.close();
>>>>>>> 788ae29bae1c7188df275a3308132b8150b7360c
>>>>>>> e82f00054191ea0f8357128bea7a46af0176d008
  }
}

/**
 * Busca un usuario por su email
 * @param email Email del usuario a buscar
 * @returns Usuario encontrado o null si no existe
 */
export async function getUserByEmail(email: string): Promise<User | null> {
<<<<<<< HEAD
    if (!email || typeof email !== 'string') {
        throw new Error('Email inválido');
    }
    
    const connection = await getConnection();
    
    try {
        // Usar parámetros preparados para prevenir SQL injection
        const result = await connection.request()
            .input('email', mssql.VarChar(255), email.trim().toLowerCase())
            .query(`
                SELECT 
                    Id as id, 
                    Name as name, 
                    Email as email, 
                    Password as password, 
                    Role as role 
                FROM Users 
                WHERE Email = @email
            `);
            
        return result.recordset.length === 0 ? null : result.recordset[0] as User;
    } catch (error) {
        console.error('Error al buscar usuario por email:', error);
        throw new Error('Error al buscar usuario');
=======
    const pool = await getConnection();
    try {
<<<<<<< HEAD
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT id, name, email, password, role FROM users WHERE email = @email');

=======
        const result = await connection.request()
            .input('email', mssql.VarChar, email)
            .query('SELECT Id as id, Name as name, Email as email, Password as password, Role as role FROM Users WHERE Email = @email');
>>>>>>> 788ae29bae1c7188df275a3308132b8150b7360c
        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset[0] as User;
    } finally {
<<<<<<< HEAD
        await pool.close();
=======
        await connection.close();
>>>>>>> 788ae29bae1c7188df275a3308132b8150b7360c
>>>>>>> e82f00054191ea0f8357128bea7a46af0176d008
    }
}

/**
 * Crea un nuevo usuario en la base de datos
 * @param user Datos del usuario a crear
 * @returns Usuario creado con su ID asignado
 */
export async function createUser(user: Omit<User, 'id'>): Promise<User> {
<<<<<<< HEAD
    if (!user || !user.email || !user.name) {
        throw new Error('Datos de usuario inválidos');
    }
    
    const connection = await getConnection();
    
    try {
        // Iniciar transacción para asegurar consistencia
        const transaction = new mssql.Transaction(connection);
        await transaction.begin();
        
        try {
            // Verificar si el email ya existe
            const checkResult = await transaction.request()
                .input('email', mssql.VarChar(255), user.email.trim().toLowerCase())
                .query('SELECT COUNT(*) as count FROM Users WHERE Email = @email');
                
            if (checkResult.recordset[0].count > 0) {
                throw new Error('El email ya está registrado');
            }
            
            // Insertar nuevo usuario
            const result = await transaction.request()
                .input('name', mssql.NVarChar(100), user.name.trim())
                .input('email', mssql.VarChar(255), user.email.trim().toLowerCase())
                .input('password', mssql.NVarChar(100), user.password) // En producción: usar hash
                .input('role', mssql.VarChar(10), user.role)
                .query(`
                    INSERT INTO Users (Name, Email, Password, Role) 
                    OUTPUT INSERTED.Id as id 
                    VALUES (@name, @email, @password, @role)
                `);
            
            await transaction.commit();
            
            // Construir y retornar el usuario creado
            const newUser: User = { 
                id: result.recordset[0].id, 
                name: user.name.trim(),
                email: user.email.trim().toLowerCase(),
                role: user.role
            };
            
            return newUser;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error al crear usuario:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error al crear usuario');
=======
    const pool = await getConnection();
    try {
<<<<<<< HEAD
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
=======
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
>>>>>>> 788ae29bae1c7188df275a3308132b8150b7360c
>>>>>>> e82f00054191ea0f8357128bea7a46af0176d008
    }
}
