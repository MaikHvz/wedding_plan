import type { DatabaseSync } from "node:sqlite";
import type { Template } from "@/types";
import { fromBool, newId, now, orNull, toBool } from "./utils";

interface TemplateRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  preview_url: string | null;
  config_json: string;
  version: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

function mapRow(row: TemplateRow): Template {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category,
    previewUrl: row.preview_url,
    configJson: row.config_json,
    version: row.version,
    isActive: toBool(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const SELECT_COLUMNS = `
  id, slug, name, description, category, preview_url, config_json, version,
  is_active, created_at, updated_at
`;

export type NewTemplate = Omit<
  Template,
  "id" | "createdAt" | "updatedAt" | "isActive"
> &
  Partial<Pick<Template, "isActive">>;

export function createTemplatesRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO templates
       (id, slug, name, description, category, preview_url, config_json, version, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const byIdStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM templates WHERE id = ?`,
  );
  const bySlugStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM templates WHERE slug = ?`,
  );
  const activeStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM templates WHERE is_active = 1 ORDER BY name ASC`,
  );
  const listStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM templates ORDER BY name ASC`,
  );
  const deleteStmt = db.prepare(`DELETE FROM templates WHERE id = ?`);
  const updateStmt = db.prepare(
    `UPDATE templates SET name = ?, description = ?, category = ?, preview_url = ?, config_json = ?, version = ?, is_active = ?, updated_at = ? WHERE id = ?`,
  );

  return {
    create(input: NewTemplate): Template {
      const timestamp = now();
      const row: TemplateRow = {
        id: newId(),
        slug: input.slug,
        name: input.name,
        description: input.description,
        category: input.category,
        preview_url: orNull(input.previewUrl),
        config_json: input.configJson,
        version: input.version,
        is_active: fromBool(input.isActive ?? true),
        created_at: timestamp,
        updated_at: timestamp,
      };
      insertStmt.run(
        row.id,
        row.slug,
        row.name,
        row.description,
        row.category,
        row.preview_url,
        row.config_json,
        row.version,
        row.is_active,
        row.created_at,
        row.updated_at,
      );
      return mapRow(row);
    },
    findById(id: string): Template | null {
      const row = byIdStmt.get(id) as unknown as TemplateRow | undefined;
      return row ? mapRow(row) : null;
    },
    findBySlug(slug: string): Template | null {
      const row = bySlugStmt.get(slug) as unknown as TemplateRow | undefined;
      return row ? mapRow(row) : null;
    },
    findActive(): Template[] {
      return (activeStmt.all() as unknown as TemplateRow[]).map(mapRow);
    },
    findAll(): Template[] {
      return (listStmt.all() as unknown as TemplateRow[]).map(mapRow);
    },
    delete(id: string): void {
      deleteStmt.run(id);
    },
    update(id: string, input: Partial<Omit<Template, "id" | "createdAt">>): Template {
      const current = this.findById(id);
      if (!current) {
        throw new Error(`Template not found: ${id}`);
      }
      updateStmt.run(
        input.name ?? current.name,
        input.description ?? current.description,
        input.category ?? current.category,
        input.previewUrl ?? current.previewUrl,
        input.configJson ?? current.configJson,
        input.version ?? current.version,
        fromBool(input.isActive ?? current.isActive),
        now(),
        id,
      );
      return this.findById(id)!;
    },
  };
}

export type TemplatesRepository = ReturnType<typeof createTemplatesRepository>;