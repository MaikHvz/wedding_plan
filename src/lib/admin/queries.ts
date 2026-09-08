import { db } from "@/lib/data";

export interface AdminStats {
  totalUsers: number;
  totalWeddings: number;
  totalPublished: number;
  totalOrders: number;
  paidRevenue: number;
  weddingsByStatus: Array<{ status: string; count: number }>;
  recentWeddings: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    createdAt: string;
    ownerName: string;
    ownerEmail: string;
  }>;
  recentOrders: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    ownerEmail: string;
    weddingTitle: string;
    productName: string;
  }>;
}

interface CountRow {
  count: number;
}

export function getAdminStats(): AdminStats {
  const count = (sql: string): number => {
    const row = db.prepare(sql).get() as unknown as CountRow | undefined;
    return Number(row?.count ?? 0);
  };

  const totalUsers = count(`SELECT COUNT(*) AS count FROM profiles`);
  const totalWeddings = count(`SELECT COUNT(*) AS count FROM weddings`);
  const totalPublished = count(
    `SELECT COUNT(*) AS count FROM weddings WHERE status = 'PUBLISHED'`,
  );
  const totalOrders = count(`SELECT COUNT(*) AS count FROM orders`);
  const paidRevenue = count(
    `SELECT COALESCE(SUM(amount), 0) AS count FROM orders WHERE status = 'PAID'`,
  );

  const weddingsByStatus = (
    db
      .prepare(
        `SELECT status, COUNT(*) AS count FROM weddings GROUP BY status ORDER BY count DESC`,
      )
      .all() as Array<{ status: string; count: number }>
  ).map((row) => ({ status: row.status, count: Number(row.count) }));

  const recentWeddings = (
    db
      .prepare(
        `SELECT w.id, w.title, w.slug, w.status, w.created_at AS createdAt,
                p.name AS ownerName, p.email AS ownerEmail
         FROM weddings w
         JOIN profiles p ON p.id = w.user_id
         ORDER BY w.created_at DESC
         LIMIT 10`,
      )
      .all() as Array<{
      id: string;
      title: string;
      slug: string;
      status: string;
      createdAt: string;
      ownerName: string;
      ownerEmail: string;
    }>
  ).map((row) => ({
    ...row,
    status: row.status,
  }));

  const recentOrders = (
    db
      .prepare(
        `SELECT o.id, o.amount, o.currency, o.status, o.created_at AS createdAt,
                p.email AS ownerEmail, w.title AS weddingTitle, pr.name AS productName
         FROM orders o
         JOIN profiles p ON p.id = o.user_id
         LEFT JOIN weddings w ON w.id = o.wedding_id
         LEFT JOIN products pr ON pr.id = o.product_id
         ORDER BY o.created_at DESC
         LIMIT 10`,
      )
      .all() as Array<{
      id: string;
      amount: number;
      currency: string;
      status: string;
      createdAt: string;
      ownerEmail: string;
      weddingTitle: string;
      productName: string;
    }>
  ).map((row) => ({ ...row, amount: Number(row.amount) }));

  return {
    totalUsers: Number(totalUsers),
    totalWeddings: Number(totalWeddings),
    totalPublished: Number(totalPublished),
    totalOrders: Number(totalOrders),
    paidRevenue: Number(paidRevenue),
    weddingsByStatus,
    recentWeddings,
    recentOrders,
  };
}

export interface AdminWeddingRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  templateId: string;
  createdAt: string;
  updatedAt: string;
  ownerName: string;
  ownerEmail: string;
  publishedAt: string | null;
  expiresAt: string | null;
}

export function listAdminWeddings(filters?: {
  status?: string;
  templateId?: string;
  search?: string;
}): AdminWeddingRow[] {
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (filters?.status) {
    conditions.push("w.status = ?");
    params.push(filters.status);
  }
  if (filters?.templateId) {
    conditions.push("w.template_id = ?");
    params.push(filters.templateId);
  }
  if (filters?.search) {
    conditions.push("(w.title LIKE ? OR p.name LIKE ? OR p.email LIKE ?)");
    const like = `%${filters.search}%`;
    params.push(like, like, like);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = db
    .prepare(
      `SELECT w.id, w.title, w.slug, w.status, w.template_id AS templateId,
              w.created_at AS createdAt, w.updated_at AS updatedAt,
              w.published_at AS publishedAt, w.expires_at AS expiresAt,
              p.name AS ownerName, p.email AS ownerEmail
       FROM weddings w
       JOIN profiles p ON p.id = w.user_id
       ${where}
       ORDER BY w.updated_at DESC`,
    )
    .all(...params);

  return rows as unknown as AdminWeddingRow[];
}

export function listAllTemplatesSimple(): Array<{ slug: string; name: string }> {
  return db
    .prepare(`SELECT slug, name FROM templates ORDER BY name ASC`)
    .all() as unknown as Array<{ slug: string; name: string }>;
}

export interface AdminOrderRow {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
  ownerName: string;
  ownerEmail: string;
  weddingId: string | null;
  weddingTitle: string | null;
  productName: string | null;
}

export function listAdminOrders(filters?: {
  status?: string;
  search?: string;
}): AdminOrderRow[] {
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (filters?.status) {
    conditions.push("o.status = ?");
    params.push(filters.status);
  }
  if (filters?.search) {
    conditions.push("(p.name LIKE ? OR p.email LIKE ? OR w.title LIKE ?)");
    const like = `%${filters.search}%`;
    params.push(like, like, like);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = db
    .prepare(
      `SELECT o.id, o.amount, o.currency, o.status, o.created_at AS createdAt,
              o.paid_at AS paidAt, p.name AS ownerName, p.email AS ownerEmail,
              w.id AS weddingId, w.title AS weddingTitle, pr.name AS productName
       FROM orders o
       JOIN profiles p ON p.id = o.user_id
       LEFT JOIN weddings w ON w.id = o.wedding_id
       LEFT JOIN products pr ON pr.id = o.product_id
       ${where}
       ORDER BY o.created_at DESC`,
    )
    .all(...params);

  return (rows as unknown as AdminOrderRow[]).map((row) => ({
    ...row,
    amount: Number(row.amount),
  }));
}

export interface AdminPublicationRow {
  id: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  expiresAt: string | null;
  weddingId: string;
  weddingTitle: string;
  ownerEmail: string;
}

export function listAdminPublications(): AdminPublicationRow[] {
  const rows = db
    .prepare(
      `SELECT pub.id, pub.slug, pub.status, pub.published_at AS publishedAt,
              pub.expires_at AS expiresAt, w.id AS weddingId,
              w.title AS weddingTitle, p.email AS ownerEmail
       FROM publications pub
       JOIN weddings w ON w.id = pub.wedding_id
       JOIN profiles p ON p.id = w.user_id
       ORDER BY pub.published_at DESC`,
    )
    .all();
  return rows as unknown as AdminPublicationRow[];
}
