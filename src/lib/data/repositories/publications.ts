import type { DatabaseSync } from "node:sqlite";
import type { Publication, WeddingStatus } from "@/types";
import { newId, now, orNull } from "./utils";

interface PublicationRow {
  id: string;
  wedding_id: string;
  slug: string;
  status: WeddingStatus;
  published_at: string | null;
  expires_at: string | null;
}

function mapRow(row: PublicationRow): Publication {
  return {
    id: row.id,
    weddingId: row.wedding_id,
    slug: row.slug,
    status: row.status,
    publishedAt: row.published_at,
    expiresAt: row.expires_at,
  };
}

const SELECT_COLUMNS = "id, wedding_id, slug, status, published_at, expires_at";

export type NewPublication = Pick<Publication, "weddingId" | "slug"> &
  Partial<Omit<Publication, "id" | "weddingId" | "slug">>;

export function createPublicationsRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO publications (id, wedding_id, slug, status, published_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const bySlugStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM publications WHERE slug = ?`,
  );
  const byIdStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM publications WHERE id = ?`,
  );
  const byWeddingStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM publications WHERE wedding_id = ? ORDER BY published_at DESC`,
  );
  const updateStmt = db.prepare(
    `UPDATE publications SET status = ?, published_at = ?, expires_at = ? WHERE id = ?`,
  );
  const deleteStmt = db.prepare(`DELETE FROM publications WHERE id = ?`);

  return {
    create(input: NewPublication): Publication {
      const timestamp = now();
      const row: PublicationRow = {
        id: newId(),
        wedding_id: input.weddingId,
        slug: input.slug,
        status: input.status ?? "PUBLISHED",
        published_at: input.publishedAt ?? timestamp,
        expires_at: orNull(input.expiresAt),
      };
      insertStmt.run(
        row.id,
        row.wedding_id,
        row.slug,
        row.status,
        row.published_at,
        row.expires_at,
      );
      return mapRow(row);
    },
    findBySlug(slug: string): Publication | null {
      const row = bySlugStmt.get(slug) as unknown as PublicationRow | undefined;
      return row ? mapRow(row) : null;
    },
    findManyByWedding(weddingId: string): Publication[] {
      return (byWeddingStmt.all(weddingId) as unknown as PublicationRow[]).map(
        mapRow,
      );
    },
    update(id: string, input: Partial<Omit<Publication, "id">>): Publication {
      const current = this.findById(id);
      if (!current) {
        throw new Error(`Publication not found: ${id}`);
      }
      updateStmt.run(
        input.status ?? current.status,
        input.publishedAt ?? current.publishedAt,
        input.expiresAt ?? current.expiresAt,
        id,
      );
      return this.findById(id)!;
    },
    findById(id: string): Publication | null {
      const row = byIdStmt.get(id) as unknown as PublicationRow | undefined;
      return row ? mapRow(row) : null;
    },
    delete(id: string): void {
      deleteStmt.run(id);
    },
  };
}

export type PublicationsRepository = ReturnType<
  typeof createPublicationsRepository
>;