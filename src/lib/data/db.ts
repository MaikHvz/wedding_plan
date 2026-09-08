import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";

let cached: DatabaseSync | undefined;

function resolveDatabasePath(): string {
  const configured = process.env.DATABASE_URL ?? "file:data/wedding.db";
  const raw = configured.startsWith("file:")
    ? configured.slice("file:".length)
    : configured;
  const file = isAbsolute(raw) ? raw : join(process.cwd(), raw);
  return file;
}

function sleepSync(ms: number): void {
  const buffer = new SharedArrayBuffer(4);
  Atomics.wait(new Int32Array(buffer), 0, 0, ms);
}

export function getDb(): DatabaseSync {
  if (!cached) {
    const file = resolveDatabasePath();
    mkdirSync(dirname(file), { recursive: true });

    let db: DatabaseSync | null = null;
    for (let attempt = 0; attempt < 20; attempt++) {
      try {
        db = new DatabaseSync(file);
        db.exec("PRAGMA journal_mode = WAL;");
        db.exec("PRAGMA busy_timeout = 5000;");
        db.exec("PRAGMA foreign_keys = ON;");
        break;
      } catch (error) {
        try {
          db?.close();
        } catch {
          // ignore
        }
        const busy =
          error instanceof Error && /locked|busy/i.test(error.message);
        if (!busy) {
          throw error;
        }
        sleepSync(50);
      }
    }
    if (!db) {
      throw new Error(`No se pudo abrir la base de datos: ${file}`);
    }
    cached = db;
  }
  return cached;
}

export function closeDb(): void {
  cached?.close();
  cached = undefined;
}