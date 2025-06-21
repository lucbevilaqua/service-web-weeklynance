/* eslint-disable @typescript-eslint/no-require-imports */
const Database = require('better-sqlite3');
const path = require('path');

// Initialize SQLite database (creates a file in the project root)
const db = new Database(path.join(process.cwd(), 'database.db'));

// Create the finances table
const createTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS finances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    currency TEXT NOT NULL,
    amount REAL NOT NULL,
    week TEXT NOT NULL,
    category TEXT NOT NULL,
    establishment TEXT NOT NULL,
    split_option TEXT NOT NULL,
    extras TEXT,
    my_amount REAL NOT NULL,
    home_or_other_amount REAL NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);
createTable.run();

module.exports = db;
