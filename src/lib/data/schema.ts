import type { DatabaseSync } from "node:sqlite";

export function initSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id            TEXT PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      name          TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'user',
      created_at    TEXT NOT NULL,
      updated_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id         TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      token      TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weddings (
      id               TEXT PRIMARY KEY,
      user_id          TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      title            TEXT NOT NULL,
      partner_1        TEXT NOT NULL DEFAULT '',
      partner_2        TEXT NOT NULL DEFAULT '',
      event_date       TEXT,
      event_time       TEXT,
      location_name    TEXT,
      location_address TEXT,
      maps_url         TEXT,
      drive_url        TEXT,
      slug             TEXT NOT NULL UNIQUE,
      status           TEXT NOT NULL DEFAULT 'DRAFT',
      template_id      TEXT NOT NULL,
      template_version INTEGER NOT NULL DEFAULT 1,
      theme_json       TEXT,
      created_at       TEXT NOT NULL,
      updated_at       TEXT NOT NULL,
      published_at     TEXT,
      expires_at       TEXT
    );

    CREATE TABLE IF NOT EXISTS wedding_sections (
      id         TEXT PRIMARY KEY,
      wedding_id TEXT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
      type       TEXT NOT NULL,
      variant    TEXT NOT NULL DEFAULT 'default',
      position   INTEGER NOT NULL DEFAULT 0,
      enabled    INTEGER NOT NULL DEFAULT 1,
      data_json  TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS wedding_media (
      id           TEXT PRIMARY KEY,
      wedding_id   TEXT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
      storage_path TEXT NOT NULL,
      alt_text     TEXT NOT NULL DEFAULT '',
      position     INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS templates (
      id          TEXT PRIMARY KEY,
      slug        TEXT NOT NULL UNIQUE,
      name        TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category    TEXT NOT NULL DEFAULT '',
      preview_url TEXT,
      config_json TEXT NOT NULL DEFAULT '{}',
      version     INTEGER NOT NULL DEFAULT 1,
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      description   TEXT NOT NULL DEFAULT '',
      price         INTEGER NOT NULL,
      currency      TEXT NOT NULL DEFAULT 'CLP',
      duration_days INTEGER,
      features_json TEXT NOT NULL DEFAULT '[]',
      active        INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id                 TEXT PRIMARY KEY,
      user_id            TEXT NOT NULL REFERENCES profiles(id),
      wedding_id         TEXT NOT NULL REFERENCES weddings(id),
      product_id         TEXT NOT NULL REFERENCES products(id),
      provider           TEXT NOT NULL,
      provider_reference TEXT,
      amount             INTEGER NOT NULL,
      currency           TEXT NOT NULL DEFAULT 'CLP',
      status             TEXT NOT NULL DEFAULT 'PENDING',
      created_at         TEXT NOT NULL,
      paid_at            TEXT
    );

    CREATE TABLE IF NOT EXISTS publications (
      id           TEXT PRIMARY KEY,
      wedding_id   TEXT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
      slug         TEXT NOT NULL UNIQUE,
      status       TEXT NOT NULL DEFAULT 'PUBLISHED',
      published_at TEXT,
      expires_at   TEXT
    );

    CREATE TABLE IF NOT EXISTS guests (
      id         TEXT PRIMARY KEY,
      wedding_id TEXT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      phone      TEXT,
      group_name TEXT,
      status     TEXT NOT NULL DEFAULT 'INVITED',
      created_by TEXT NOT NULL REFERENCES profiles(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invitations (
      id         TEXT PRIMARY KEY,
      wedding_id TEXT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
      guest_id   TEXT NOT NULL REFERENCES guests(id) ON DELETE CASCADE UNIQUE,
      token      TEXT NOT NULL UNIQUE,
      status     TEXT NOT NULL DEFAULT 'PENDING',
      sent_at    TEXT,
      opened_at  TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rsvp_responses (
      id              TEXT PRIMARY KEY,
      guest_id        TEXT NOT NULL REFERENCES guests(id) ON DELETE CASCADE UNIQUE,
      attendance      TEXT NOT NULL,
      companions_json TEXT NOT NULL DEFAULT '[]',
      message         TEXT,
      created_at      TEXT NOT NULL,
      updated_at      TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_weddings_user ON weddings(user_id);
    CREATE INDEX IF NOT EXISTS idx_weddings_slug ON weddings(slug);
    CREATE INDEX IF NOT EXISTS idx_sections_wedding ON wedding_sections(wedding_id);
    CREATE INDEX IF NOT EXISTS idx_media_wedding ON wedding_media(wedding_id);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_wedding ON orders(wedding_id);
    CREATE INDEX IF NOT EXISTS idx_publications_slug ON publications(slug);
    CREATE INDEX IF NOT EXISTS idx_guests_wedding ON guests(wedding_id);
    CREATE INDEX IF NOT EXISTS idx_guests_created_by ON guests(created_by);
    CREATE INDEX IF NOT EXISTS idx_invitations_wedding ON invitations(wedding_id);
    CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
  `);

  migrateRoles(db);
  migrateMaxGuests(db);
}

/** Migración: agrega la columna `role` a `profiles` si no existe (DBs viejas). */
function migrateRoles(db: DatabaseSync): void {
  const columns = db
    .prepare(`PRAGMA table_info(profiles)`)
    .all() as unknown as Array<{ name: string }>;
  if (!columns.some((column) => column.name === "role")) {
    db.exec(`ALTER TABLE profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user'`);
  }
}

/** Migración: agrega `max_guests` a `weddings` si no existe (DBs viejas). */
function migrateMaxGuests(db: DatabaseSync): void {
  const columns = db
    .prepare(`PRAGMA table_info(weddings)`)
    .all() as unknown as Array<{ name: string }>;
  if (!columns.some((column) => column.name === "max_guests")) {
    db.exec(
      `ALTER TABLE weddings ADD COLUMN max_guests INTEGER NOT NULL DEFAULT 0`,
    );
  }
}