import { NextResponse } from "next/server";
import { db, seedBaseData } from "@/lib/data";

export async function GET() {
  await seedBaseData();
  const counts = (row: { users: number; weddings: number; products: number }) =>
    row;

  const row = db
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM profiles) AS users,
         (SELECT COUNT(*) FROM weddings) AS weddings,
         (SELECT COUNT(*) FROM products) AS products`,
    )
    .get() as unknown as { users: number; weddings: number; products: number };

  return NextResponse.json({
    ok: true,
    service: "wedding-web-builder",
    stack: "local",
    counts: counts(row),
  });
}