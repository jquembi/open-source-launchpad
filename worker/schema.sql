CREATE TABLE IF NOT EXISTS entries (
 id TEXT PRIMARY KEY,
 type TEXT NOT NULL CHECK(type IN ('need','offer')),
 title TEXT NOT NULL,
 description TEXT NOT NULL,
 category TEXT NOT NULL,
 province TEXT NOT NULL,
 municipality TEXT NOT NULL,
 contact TEXT NOT NULL,
 contact_consent INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','closed')),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 reviewed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_entries_public ON entries(status,category,municipality,created_at);
