import type { DatabaseSync } from "node:sqlite";
import type { SectionType, WeddingSection } from "@/types";
import { fromBool, newId, now, toBool } from "./utils";

interface SectionRow {
  id: string;
  wedding_id: string;
  type: string;
  variant: string;
  position: number;
  enabled: number;
  data_json: string;
  created_at: string;
  updated_at: string;
}

function mapRow(row: SectionRow): WeddingSection {
  return {
    id: row.id,
    weddingId: row.wedding_id,
    type: row.type as SectionType,
    variant: row.variant,
    position: row.position,
    enabled: toBool(row.enabled),
    dataJson: row.data_json,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const SELECT_COLUMNS =
  "id, wedding_id, type, variant, position, enabled, data_json, created_at, updated_at";

export type NewSection = Pick<
  WeddingSection,
  "weddingId" | "type" | "variant" | "position" | "enabled" | "dataJson"
>;

export type SectionUpdate = Partial<
  Omit<WeddingSection, "id" | "weddingId" | "createdAt">
>;

export function createWeddingSectionsRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO wedding_sections
       (id, wedding_id, type, variant, position, enabled, data_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const byIdStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM wedding_sections WHERE id = ?`,
  );
  const byWeddingStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM wedding_sections WHERE wedding_id = ? ORDER BY position ASC`,
  );
  const deleteStmt = db.prepare(`DELETE FROM wedding_sections WHERE id = ?`);
  const deleteByWeddingStmt = db.prepare(
    `DELETE FROM wedding_sections WHERE wedding_id = ?`,
  );
  const updateStmt = db.prepare(
    `UPDATE wedding_sections SET variant = ?, position = ?, enabled = ?, data_json = ?, updated_at = ? WHERE id = ?`,
  );

  return {
    create(input: NewSection): WeddingSection {
      const timestamp = now();
      const row: SectionRow = {
        id: newId(),
        wedding_id: input.weddingId,
        type: input.type,
        variant: input.variant,
        position: input.position,
        enabled: fromBool(input.enabled),
        data_json: input.dataJson,
        created_at: timestamp,
        updated_at: timestamp,
      };
      insertStmt.run(
        row.id,
        row.wedding_id,
        row.type,
        row.variant,
        row.position,
        row.enabled,
        row.data_json,
        row.created_at,
        row.updated_at,
      );
      return mapRow(row);
    },
    findById(id: string): WeddingSection | null {
      const row = byIdStmt.get(id) as unknown as SectionRow | undefined;
      return row ? mapRow(row) : null;
    },
    findManyByWedding(weddingId: string): WeddingSection[] {
      return (byWeddingStmt.all(weddingId) as unknown as SectionRow[]).map(mapRow);
    },
    update(id: string, input: SectionUpdate): WeddingSection {
      const current = this.findById(id);
      if (!current) {
        throw new Error(`Section not found: ${id}`);
      }
      updateStmt.run(
        input.variant ?? current.variant,
        input.position ?? current.position,
        fromBool(input.enabled ?? current.enabled),
        input.dataJson ?? current.dataJson,
        now(),
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

export type WeddingSectionsRepository = ReturnType<
  typeof createWeddingSectionsRepository
>;