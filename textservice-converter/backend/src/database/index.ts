import initSqlJs, { Database } from 'sql.js';
import path from 'path';
import fs from 'fs';

let SQL: any;
let db: Database;

export async function connectDatabase(): Promise<void> {
  try {
    // Initialize sql.js
    SQL = await initSqlJs();
    
    // Create data directory
    const dataDir = path.join(__dirname, '../data');
    const dbPath = path.join(dataDir, 'database.sqlite');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('Created data directory:', dataDir);
    }
    
    // Try to load existing database or create new one
    let dbBuffer: Buffer | undefined;
    if (fs.existsSync(dbPath)) {
      dbBuffer = fs.readFileSync(dbPath);
    }
    
    db = new SQL.Database(dbBuffer);

    // Create table if it doesn't exist
    db.run(`
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

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

export async function getAllTextServiceData(): Promise<string[]> {
  const database = getDatabase();
  const stmt = database.prepare('SELECT raw_text FROM textservice_data ORDER BY id');
  const results: string[] = [];
  
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push((row as any).raw_text);
  }
  
  stmt.free();
  return results;
}

export async function insertTextServiceData(rawText: string): Promise<void> {
  const database = getDatabase();
  const stmt = database.prepare('INSERT INTO textservice_data (raw_text) VALUES (?)');
  stmt.run([rawText]);
  stmt.free();
  
  // Save database to file
  await saveDatabase();
}

export async function clearTextServiceData(): Promise<void> {
  const database = getDatabase();
  const stmt = database.prepare('DELETE FROM textservice_data');
  stmt.run();
  stmt.free();
  
  // Save database to file
  await saveDatabase();
}

async function saveDatabase(): Promise<void> {
  try {
    const dataDir = path.join(__dirname, '../data');
    const dbPath = path.join(dataDir, 'database.sqlite');
    const data = db.export();
    fs.writeFileSync(dbPath, data);
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}