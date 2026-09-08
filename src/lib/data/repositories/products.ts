import type { DatabaseSync } from "node:sqlite";
import type { Product } from "@/types";
import { fromBool, newId, orNull, toBool } from "./utils";

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_days: number | null;
  features_json: string;
  active: number;
}

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    currency: row.currency,
    durationDays: row.duration_days,
    featuresJson: row.features_json,
    active: toBool(row.active),
  };
}

const SELECT_COLUMNS = `
  id, name, description, price, currency, duration_days, features_json, active
`;

export function createProductsRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO products
       (id, name, description, price, currency, duration_days, features_json, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const byIdStmt = db.prepare(`SELECT ${SELECT_COLUMNS} FROM products WHERE id = ?`);
  const upsertByNameStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM products WHERE name = ?`,
  );
  const listStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM products ORDER BY name ASC`,
  );
  const deleteStmt = db.prepare(`DELETE FROM products WHERE id = ?`);
  const updateStmt = db.prepare(
    `UPDATE products SET
       name = ?, description = ?, price = ?, currency = ?, duration_days = ?,
       features_json = ?, active = ?
     WHERE id = ?`,
  );

  return {
    findById(id: string): Product | null {
      const row = byIdStmt.get(id) as unknown as ProductRow | undefined;
      return row ? mapRow(row) : null;
    },
    findAll(): Product[] {
      return (listStmt.all() as unknown as ProductRow[]).map(mapRow);
    },
    update(id: string, input: Partial<Omit<Product, "id">>): Product {
      const current = this.findById(id);
      if (!current) {
        throw new Error(`Product not found: ${id}`);
      }
      updateStmt.run(
        input.name ?? current.name,
        input.description ?? current.description,
        input.price ?? current.price,
        input.currency ?? current.currency,
        orNull(input.durationDays ?? current.durationDays),
        input.featuresJson ?? current.featuresJson,
        fromBool(input.active ?? current.active),
        id,
      );
      return this.findById(id)!;
    },
    delete(id: string): void {
      deleteStmt.run(id);
    },
    findActive(): Product[] {
      const stmt = db.prepare(
        `SELECT ${SELECT_COLUMNS} FROM products WHERE active = 1 ORDER BY price ASC`,
      );
      return (stmt.all() as unknown as ProductRow[]).map(mapRow);
    },
    upsert(input: Omit<Product, "id">): Product {
      const existing = upsertByNameStmt.get(input.name) as unknown as
        | ProductRow
        | undefined;
      if (existing) {
        db.prepare(
          `UPDATE products SET
             description = ?, price = ?, currency = ?, duration_days = ?,
             features_json = ?, active = ? WHERE id = ?`,
        ).run(
          input.description,
          input.price,
          input.currency,
          orNull(input.durationDays),
          input.featuresJson,
          fromBool(input.active),
          existing.id,
        );
        return this.findById(existing.id)!;
      }
      const id = newId();
      const row: ProductRow = {
        id,
        name: input.name,
        description: input.description,
        price: input.price,
        currency: input.currency,
        duration_days: orNull(input.durationDays),
        features_json: input.featuresJson,
        active: fromBool(input.active),
      };
      insertStmt.run(
        row.id,
        row.name,
        row.description,
        row.price,
        row.currency,
        row.duration_days,
        row.features_json,
        row.active,
      );
      return mapRow(row);
    },
  };
}

export type ProductsRepository = ReturnType<typeof createProductsRepository>;