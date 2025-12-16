import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.sqlite')

let dbPromise

export const getDb = async () => {
  if (!dbPromise) {
    dbPromise = open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    })
  }
  return dbPromise
}

export const initDb = async () => {
  const db = await getDb()
  await db.exec('PRAGMA foreign_keys = ON;')
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS wallets (
      user_id TEXT PRIMARY KEY,
      balance INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      status TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      reference TEXT,
      meta_json TEXT,
      created_at TEXT NOT NULL,
      confirmed_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rounds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL,
      server_seed_hash TEXT NOT NULL,
      client_seed_public TEXT,
      server_seed TEXT,
      result_json TEXT,
      created_at TEXT NOT NULL,
      settled_at TEXT
    );

    CREATE TABLE IF NOT EXISTS bets (
      id TEXT PRIMARY KEY,
      round_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      bet_type TEXT NOT NULL,
      stake INTEGER NOT NULL,
      multiplier INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(round_id) REFERENCES rounds(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_bets_round_id ON bets(round_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
  `)

  const ensureColumn = async (tableName, columnName, columnSql) => {
    const cols = await db.all(`PRAGMA table_info(${tableName})`)
    const has = cols.some((c) => c.name === columnName)
    if (has) return
    await db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`)
  }

  await ensureColumn('rounds', 'client_seed_public', 'client_seed_public TEXT')
  await ensureColumn('wallets', 'bonus_locked', 'bonus_locked INTEGER NOT NULL DEFAULT 0')
}

export const nowIso = () => new Date().toISOString()
