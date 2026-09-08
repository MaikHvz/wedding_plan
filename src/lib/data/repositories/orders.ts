import type { DatabaseSync } from "node:sqlite";
import type { Order, OrderStatus } from "@/types";
import { newId, now, orNull } from "./utils";

interface OrderRow {
  id: string;
  user_id: string;
  wedding_id: string;
  product_id: string;
  provider: string;
  provider_reference: string | null;
  amount: number;
  currency: string;
  status: OrderStatus;
  created_at: string;
  paid_at: string | null;
}

function mapRow(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id,
    weddingId: row.wedding_id,
    productId: row.product_id,
    provider: row.provider,
    providerReference: row.provider_reference,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    createdAt: row.created_at,
    paidAt: row.paid_at,
  };
}

const SELECT_COLUMNS = `
  id, user_id, wedding_id, product_id, provider, provider_reference,
  amount, currency, status, created_at, paid_at
`;

export type NewOrder = Pick<
  Order,
  "userId" | "weddingId" | "productId" | "provider"
> &
  Partial<Omit<Order, "id" | "createdAt">>;

export function createOrdersRepository(db: DatabaseSync) {
  const insertStmt = db.prepare(
    `INSERT INTO orders
       (id, user_id, wedding_id, product_id, provider, provider_reference, amount, currency, status, created_at, paid_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const byIdStmt = db.prepare(`SELECT ${SELECT_COLUMNS} FROM orders WHERE id = ?`);
  const byWeddingStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM orders WHERE wedding_id = ? ORDER BY created_at DESC`,
  );
  const byUserStmt = db.prepare(
    `SELECT ${SELECT_COLUMNS} FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
  );
  const setStatusStmt = db.prepare(
    `UPDATE orders SET status = ?, paid_at = ? WHERE id = ?`,
  );
  const deleteStmt = db.prepare(`DELETE FROM orders WHERE id = ?`);

  return {
    create(input: NewOrder): Order {
      const timestamp = now();
      const row: OrderRow = {
        id: newId(),
        user_id: input.userId,
        wedding_id: input.weddingId,
        product_id: input.productId,
        provider: input.provider,
        provider_reference: orNull(input.providerReference),
        amount: input.amount ?? 0,
        currency: input.currency ?? "CLP",
        status: input.status ?? "PENDING",
        created_at: timestamp,
        paid_at: orNull(input.paidAt),
      };
      insertStmt.run(
        row.id,
        row.user_id,
        row.wedding_id,
        row.product_id,
        row.provider,
        row.provider_reference,
        row.amount,
        row.currency,
        row.status,
        row.created_at,
        row.paid_at,
      );
      return mapRow(row);
    },
    findById(id: string): Order | null {
      const row = byIdStmt.get(id) as unknown as OrderRow | undefined;
      return row ? mapRow(row) : null;
    },
    findManyByWedding(weddingId: string): Order[] {
      return (byWeddingStmt.all(weddingId) as unknown as OrderRow[]).map(mapRow);
    },
    findManyByUser(userId: string): Order[] {
      return (byUserStmt.all(userId) as unknown as OrderRow[]).map(mapRow);
    },
    setStatus(id: string, status: OrderStatus): Order {
      setStatusStmt.run(status, status === "PAID" ? now() : null, id);
      return this.findById(id)!;
    },
    delete(id: string): void {
      deleteStmt.run(id);
    },
  };
}

export type OrdersRepository = ReturnType<typeof createOrdersRepository>;