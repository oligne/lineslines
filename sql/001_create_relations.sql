-- Table des relations entre utilisateurs
CREATE TABLE IF NOT EXISTS relations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user1_id INTEGER NOT NULL,
  user2_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user1_id, user2_id)
);
-- Index pour accélérer les recherches
CREATE INDEX IF NOT EXISTS idx_relations_user1 ON relations(user1_id);
CREATE INDEX IF NOT EXISTS idx_relations_user2 ON relations(user2_id);
