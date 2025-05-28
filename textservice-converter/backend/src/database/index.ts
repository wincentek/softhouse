import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';

let db: Database<sqlite3.Database, sqlite3.Statement>;

export async function connectDatabase(): Promise<void> {
  try {
    // Create database file in project root
    const dbPath = path.join(__dirname, '../../database.sqlite');
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Create table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS textservice_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        raw_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('SQLite database connected and initialized');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export function getDatabase(): Database<sqlite3.Database, sqlite3.Statement> {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

export async function getAllTextServiceData(): Promise<string[]> {
  const database = getDatabase();
  const rows = await database.all('SELECT raw_text FROM textservice_data ORDER BY id');
  return rows.map(row => row.raw_text);
}

export async function insertTextServiceData(rawText: string): Promise<void> {
  const database = getDatabase();
  await database.run('INSERT INTO textservice_data (raw_text) VALUES (?)', [rawText]);
}

export async function clearTextServiceData(): Promise<void> {
  const database = getDatabase();
  await database.run('DELETE FROM textservice_data');
}