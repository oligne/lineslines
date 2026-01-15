-- Migration: Table de personnalisation des points
CREATE TABLE IF NOT EXISTS customizations (
  user_id TEXT PRIMARY KEY,
  eye INTEGER DEFAULT 1,
  mouth INTEGER DEFAULT 1,
  goodie INTEGER DEFAULT 0,
  x REAL,
  y REAL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
