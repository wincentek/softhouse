import mysql from 'mysql2/promise';

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

let connection: mysql.Connection;

export async function connectDatabase(): Promise<void> {
  const config: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'textservice_db'
  };

  try {
    connection = await mysql.createConnection(config);
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export function getConnection(): mysql.Connection {
  if (!connection) {
    throw new Error('Database not connected');
  }
  return connection;
}

export async function getAllTextServiceData(): Promise<string[]> {
  const conn = getConnection();
  const [rows] = await conn.execute<mysql.RowDataPacket[]>(
    'SELECT raw_text FROM textservice_data ORDER BY id'
  );
  return rows.map(row => row.raw_text);
}

export async function insertTextServiceData(rawText: string): Promise<void> {
  const conn = getConnection();
  await conn.execute(
    'INSERT INTO textservice_data (raw_text) VALUES (?)',
    [rawText]
  );
}