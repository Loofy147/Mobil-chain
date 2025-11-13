const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./aeamc.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      telemetry TEXT,
      eps REAL,
      lastSeen INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS microblocks (
      hash TEXT PRIMARY KEY,
      header TEXT,
      receipts TEXT,
      anchored INTEGER,
      anchorTx TEXT
    )
  `);
});

module.exports = db;
