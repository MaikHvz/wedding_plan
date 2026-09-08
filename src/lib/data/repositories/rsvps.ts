import type { DatabaseSync } from "node:sqlite";
import type { RsvpAttendance, RsvpResponse } from "@/types";
import { newId, now } from "./utils";

interface RsvpResponseRow {
  id: string;
  guest_id: string;
  attendance: RsvpAttendance;
  companions_json: string;
  message: string | null;
  created_at: string;
  updated_at: string;
}

function parseCompanions(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function mapRow(row: RsvpResponseRow): RsvpResponse {
  return {
    id: row.id,
    guestId: row.guest_id,
    attendance: row.attendance,
    companions: parseCompanions(row.companions_json),
    message: row.message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const SELECT_COLUMNS = `
  id, guest_id, attendance, companions_json, message, created_at, updated_at
`;

const SELECT_COLUMNS_JOINED = `
  r.id AS id, r.guest_id AS guest_id, r.attendance AS attendance,
  r.companions_json AS companions_json, r.message AS message,
  r.created_at AS created_at, r.updated_at AS updated_at
`;

export type NewRsvpResponse = Pick<
  RsvpResponse,
  "guestId" | "attendance" | "companions"
> &
  Partial<Omit<RsvpResponse, "id" | "guestId" | "createdAt" | "updatedAt">>;

export function createRsvpsRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO rsvp_responses
       (id, guest_id, attendance, companions_json, message, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  const byGuestStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM rsvp_responses WHERE guest_id = ?`,
  );
  const byWeddingStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS_JOINED} FROM rsvp_responses r
     JOIN guests g ON g.id = r.guest_id
     WHERE g.wedding_id = ?`,
  );
  const updateStmt = db.prepare(
    `UPDATE rsvp_responses SET attendance = ?, companions_json = ?, message = ?, updated_at = ?
     WHERE id = ?`,
  );

  return {
    create(input: NewRsvpResponse): RsvpResponse {
      const timestamp = now();
      const row: RsvpResponseRow = {
        id: newId(),
        guest_id: input.guestId,
        attendance: input.attendance,
        companions_json: JSON.stringify(input.companions),
        message: input.message ?? null,
        created_at: timestamp,
        updated_at: timestamp,
      };
      insertStmt.run(
        row.id,
        row.guest_id,
        row.attendance,
        row.companions_json,
        row.message,
        row.created_at,
        row.updated_at,
      );
      return mapRow(row);
    },
    findOneByGuestId(guestId: string): RsvpResponse | null {
      const row = byGuestStmt.get(guestId) as unknown as
        | RsvpResponseRow
        | undefined;
      return row ? mapRow(row) : null;
    },
    findManyByWedding(weddingId: string): RsvpResponse[] {
      return (byWeddingStmt.all(weddingId) as unknown as RsvpResponseRow[]).map(
        mapRow,
      );
    },
    /** Crea o actualiza la respuesta del invitado (upsert por guest). */
    upsert(input: NewRsvpResponse): RsvpResponse {
      const existing = this.findOneByGuestId(input.guestId);
      if (!existing) {
        return this.create(input);
      }
      updateStmt.run(
        input.attendance,
        JSON.stringify(input.companions),
        input.message ?? null,
        now(),
        existing.id,
      );
      return this.findOneByGuestId(input.guestId)!;
    },
  };
}

export type RsvpsRepository = ReturnType<typeof createRsvpsRepository>;