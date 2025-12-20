import * as SQLite from 'expo-sqlite';
import { JournalEntry } from '@/types/journal';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase() {
  try {
    db = await SQLite.openDatabaseAsync('rifflingua.db');
    
    // Create journals table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS journals (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER,
        mood TEXT,
        steps INTEGER,
        location TEXT,
        note TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_date ON journals(date DESC);
    `);
    
    console.log('✅ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

export async function getDatabase() {
  if (!db) {
    db = await initDatabase();
  }
  return db;
}

// CRUD Operations
export async function createJournal(entry: Omit<JournalEntry, 'id'>): Promise<string> {
  const database = await getDatabase();
  const id = Date.now().toString();
  
  await database.runAsync(
    `INSERT INTO journals (id, date, title, content, rating, mood, steps, location, note) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, entry.date, entry.title, entry.content, entry.rating || null, entry.mood || null, 
     entry.steps || null, entry.location || null, entry.note || null]
  );
  
  return id;
}

export async function getAllJournals(): Promise<JournalEntry[]> {
  const database = await getDatabase();
  const result = await database.getAllAsync<JournalEntry>(
    'SELECT * FROM journals ORDER BY date DESC'
  );
  return result;
}

export async function getJournalByDate(date: string): Promise<JournalEntry | null> {
  const database = await getDatabase();
  const result = await database.getFirstAsync<JournalEntry>(
    'SELECT * FROM journals WHERE date = ?',
    [date]
  );
  return result || null;
}

export async function getJournalById(id: string): Promise<JournalEntry | null> {
  const database = await getDatabase();
  const result = await database.getFirstAsync<JournalEntry>(
    'SELECT * FROM journals WHERE id = ?',
    [id]
  );
  return result || null;
}

export async function updateJournal(id: string, entry: Partial<JournalEntry>): Promise<void> {
  const database = await getDatabase();
  
  const updates: string[] = [];
  const values: any[] = [];
  
  if (entry.title !== undefined) {
    updates.push('title = ?');
    values.push(entry.title);
  }
  if (entry.content !== undefined) {
    updates.push('content = ?');
    values.push(entry.content);
  }
  if (entry.rating !== undefined) {
    updates.push('rating = ?');
    values.push(entry.rating);
  }
  if (entry.location !== undefined) {
    updates.push('location = ?');
    values.push(entry.location);
  }
  if (entry.note !== undefined) {
    updates.push('note = ?');
    values.push(entry.note);
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  
  await database.runAsync(
    `UPDATE journals SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deleteJournal(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM journals WHERE id = ?', [id]);
}

// Seed mock data (for first time users)
export async function seedMockData() {
  const database = await getDatabase();
  const existing = await database.getFirstAsync('SELECT COUNT(*) as count FROM journals');
  
  if (existing && (existing as any).count > 0) {
    console.log('📚 Database already has data, skipping seed');
    return;
  }
  
  const mockData = [
    {
      id: '1',
      date: '2025-09-12',
      title: 'Morning outing to Ocean Beach',
      content: 'I dreamed about surfing last night. Whenever that happens, I know I\'m going to have a great day in the water. Sarah',
      rating: 5,
      mood: '😊',
      steps: 1250,
      location: 'Ocean Beach',
    },
    {
      id: '2',
      date: '2025-09-11',
      title: 'Afternoon hike, Mount Diablo',
      content: 'What a day! She and I were in town and decided to take a hike. The views were amazing and the weather was perfect.',
      rating: 5,
      mood: '🌟',
      steps: 8234,
      location: 'Mt. Diablo State Park',
    },
    {
      id: '3',
      date: '2025-09-10',
      title: 'Coffee with friends',
      content: 'Met up with old friends at the local cafe. We talked for hours about everything and nothing. It felt great to reconnect.',
      rating: 4,
      mood: '☕',
      steps: 3200,
      location: 'Downtown Cafe',
    },
  ];
  
  for (const entry of mockData) {
    await database.runAsync(
      `INSERT INTO journals (id, date, title, content, rating, mood, steps, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [entry.id, entry.date, entry.title, entry.content, entry.rating, entry.mood, entry.steps, entry.location]
    );
  }
  
  console.log('✅ Mock data seeded successfully');
}

