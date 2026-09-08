import type { DatabaseSync } from "node:sqlite";
import type { WeddingMedia } from "@/types";
import { newId, now } from "./utils";

interface MediaRow {
  id: string;
  wedding_id: string;
  storage_path: string;
  alt_text: string;
  position: number;
  created_at: string;
}

function mapRow(row: MediaRow): WeddingMedia {
  return {
    id: row.id,
    weddingId: row.wedding_id,
    storagePath: row.storage_path,
    altText: row.alt_text,
    position: row.position,
    createdAt: row.created_at,
  };
}

const SELECT_COLUMNS =
  "id, wedding_id, storage_path, alt_text, position, created_at";

export type NewMedia = Pick<
  WeddingMedia,
  "weddingId" | "storagePath" | "position"
> &
  Partial<Omit<WeddingMedia, "id" | "weddingId" | "createdAt">>;

export type MediaUpdate = Partial<
  Omit<WeddingMedia, "id" | "weddingId" | "createdAt">
>;

export function createWeddingMediaRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO wedding_media
       (id, wedding_id, storage_path, alt_text, position, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const byIdStmt = db.prepare(`SELECT ${SELECT_COLUMNS} FROM wedding_media WHERE id = ?`);
  const byWeddingStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM wedding_media WHERE wedding_id = ? ORDER BY position ASC`,
  );
  const deleteStmt = db.prepare(`DELETE FROM wedding_media WHERE id = ?`);
  const deleteByWeddingStmt = db.prepare(
    `DELETE FROM wedding_media WHERE wedding_id = ?`,
  );
  const updateStmt = db.prepare(
    `UPDATE wedding_media SET storage_path = ?, alt_text = ?, position = ? WHERE id = ?`,
  );

  return {
    create(input: NewMedia): WeddingMedia {
      const media: WeddingMedia = {
        id: newId(),
        weddingId: input.weddingId,
        storagePath: input.storagePath,
        altText: input.altText ?? "",
        position: input.position ?? 0,
        createdAt: now(),
      };
      insertStmt.run(
        media.id,
        media.weddingId,
        media.storagePath,
        media.altText,
        media.position,
        media.createdAt,
      );
      return media;
    },
    findById(id: string): WeddingMedia | null {
      const row = byIdStmt.get(id) as unknown as MediaRow | undefined;
      return row ? mapRow(row) : null;
    },
    findManyByWedding(weddingId: string): WeddingMedia[] {
      return (byWeddingStmt.all(weddingId) as unknown as MediaRow[]).map(mapRow);
    },
    update(id: string, input: MediaUpdate): WeddingMedia {
      const current = this.findById(id);
      if (!current) {
        throw new Error(`Media not found: ${id}`);
      }
      updateStmt.run(
        input.storagePath ?? current.storagePath,
        input.altText ?? current.altText,
        input.position ?? current.position,
        id,
      );
      return this.findById(id)!;
    },
    delete(id: string): void {
      deleteStmt.run(id);
    },
    deleteManyByWedding(weddingId: string): void {
      deleteByWeddingStmt.run(weddingId);
    },
  };
}

export type WeddingMediaRepository = ReturnType<
  typeof createWeddingMediaRepository
>;