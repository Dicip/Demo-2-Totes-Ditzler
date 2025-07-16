'use server';

import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should be hashed in a real app
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
  lastDispatch: string | null; // ISO 8601 date string
}

export interface Database {
  users: User[];
  clients: Client[];
  totes: Tote[];
}

export async function readDb(): Promise<Database> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data) as Database;
  } catch (error) {
    // If the file doesn't exist, return a default structure
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { users: [], clients: [], totes: [] };
    }
    throw error;
  }
}

export async function writeDb(data: Database): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}
