import type { DatabaseSync } from "node:sqlite";
import type { Guest, GuestStatus } from "@/types";
import { newId, now, orNull } from "./utils";

interface GuestRow {
  id: string;
  wedding_id: string;
  name: string;
  email: string;
  phone: string | null;
  group_name: string | null;
  status: GuestStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

function mapRow(row: GuestRow): Guest {
  return {
    id: row.id,
    weddingId: row.wedding_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    groupName: row.group_name,
    status: row.status,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const SELECT_COLUMNS = `
  id, wedding_id, name, email, phone, group_name, status, created_by,
  created_at, updated_at
`;

export type NewGuest = Pick<
  Guest,
  "weddingId" | "name" | "email" | "createdBy"
> &
  Partial<Omit<Guest, "id" | "weddingId" | "createdAt" | "updatedAt">>;

export type GuestUpdate = Partial<
  Omit<Guest, "id" | "weddingId" | "createdBy" | "createdAt">
>;

export function createGuestsRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO guests
       (id, wedding_id, name, email, phone, group_name, status, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const byIdStmt = db.prepare(`SELECT ${SELECT_COLUMNS} FROM guests WHERE id = ?`);
  const byWeddingStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM guests WHERE wedding_id = ? ORDER BY created_at ASC`,
  );
  const updateStmt = db.prepare(
    `UPDATE guests SET name = ?, email = ?, phone = ?, group_name = ?, status = ?, updated_at = ?
     WHERE id = ?`,
  );
  const setStatusStmt = db.prepare(
    `UPDATE guests SET status = ?, updated_at = ? WHERE id = ?`,
  );
  const deleteStmt = db.prepare(`DELETE FROM guests WHERE id = ?`);

  return {
    create(input: NewGuest): Guest {
      const timestamp = now();
      const row: GuestRow = {
        id: newId(),
        wedding_id: input.weddingId,
        name: input.name,
        email: input.email,
        phone: orNull(input.phone),
        group_name: orNull(input.groupName),
        status: input.status ?? "INVITED",
        created_by: input.createdBy,
        created_at: timestamp,
        updated_at: timestamp,
      };
      insertStmt.run(
        row.id,
        row.wedding_id,
        row.name,
        row.email,
        row.phone,
        row.group_name,
        row.status,
        row.created_by,
        row.created_at,
        row.updated_at,
      );
      return mapRow(row);
    },
    findById(id: string): Guest | null {
      const row = byIdStmt.get(id) as unknown as GuestRow | undefined;
      return row ? mapRow(row) : null;
    },
    findManyByWedding(weddingId: string): Guest[] {
      return (byWeddingStmt.all(weddingId) as unknown as GuestRow[]).map(mapRow);
    },
    update(id: string, input: GuestUpdate): Guest {
      const current = this.findById(id);
      if (!current) {
        throw new Error(`Guest not found: ${id}`);
      }
      const merged: Guest = { ...current, ...input, updatedAt: now() };
      updateStmt.run(
        merged.name,
        merged.email,
        merged.phone,
        merged.groupName,
        merged.status,
        merged.updatedAt,
        id,
      );
      return this.findById(id)!;
    },
    setStatus(id: string, status: GuestStatus): Guest {
      setStatusStmt.run(status, now(), id);
      return this.findById(id)!;
    },
    delete(id: string): void {
      deleteStmt.run(id);
    },
  };
}

export type GuestsRepository = ReturnType<typeof createGuestsRepository>;