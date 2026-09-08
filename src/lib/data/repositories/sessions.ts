import type { DatabaseSync } from "node:sqlite";
import type { Session } from "@/types";
import { newId, now } from "./utils";

interface SessionRow {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

function mapRow(row: SessionRow): Session {
  return {
    id: row.id,
    userId: row.user_id,
    token: row.token,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

export function createSessionsRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO sessions (id, user_id, token, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  );
  const byTokenStmt = db.prepare(
    `SELECT id, user_id, token, expires_at, created_at FROM sessions WHERE token = ?`,
  );
  const deleteStmt = db.prepare(`DELETE FROM sessions WHERE token = ?`);
  const deleteExpiredStmt = db.prepare(
    `DELETE FROM sessions WHERE expires_at < ?`,
  );

  return {
    create(userId: string, token: string, expiresAt: string): Session {
      const row: SessionRow = {
        id: newId(),
        user_id: userId,
        token,
        expires_at: expiresAt,
        created_at: now(),
      };
      insertStmt.run(
        row.id,
        row.user_id,
        row.token,
        row.expires_at,
        row.created_at,
      );
      return mapRow(row);
    },
    findByToken(token: string): Session | null {
      const row = byTokenStmt.get(token) as unknown as SessionRow | undefined;
      return row ? mapRow(row) : null;
    },
    deleteByToken(token: string): void {
      deleteStmt.run(token);
    },
    deleteExpired(): void {
      deleteExpiredStmt.run(now());
    },
  };
}

export type SessionsRepository = ReturnType<typeof createSessionsRepository>;