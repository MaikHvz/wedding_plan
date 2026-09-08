import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminOrders } from "@/lib/admin/queries";

const ORDER_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED", "CANCELLED"] as const;

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export const dynamic = "force-dynamic";

export default async function AdminOrdenesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const rawStatus = params.status ?? "";
  const rawSearch = params.q ?? "";

  const status =
    typeof rawStatus === "string" &&
    (ORDER_STATUSES as readonly string[]).includes(rawStatus)
      ? rawStatus
      : undefined;
  const search = typeof rawSearch === "string" ? rawSearch.trim() : undefined;

  const orders = listAdminOrders({ status, search });

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Panel de administración
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold">Órdenes</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {orders.length} órdenes encontradas.
        </p>
      </header>

      <form
        method="get"
        className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4"
      >
        <input
          type="search"
          name="q"
          defaultValue={search ?? ""}
          placeholder="Buscar por usuario, email o boda…"
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {ORDER_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700"
        >
          Filtrar
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Boda</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3 text-right">Monto</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/ordenes/${order.id}`}
                    className="font-mono text-xs font-medium hover:underline"
                  >
                    {order.id.slice(0, 8)}…
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs text-neutral-600">{order.ownerName}</p>
                  <p className="text-xs text-neutral-400">{order.ownerEmail}</p>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {order.weddingTitle ? (
                    <Link
                      href={`/admin/bodas/${order.weddingId}`}
                      className="hover:underline"
                    >
                      {order.weddingTitle}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {order.productName ?? "—"}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {clp.format(order.amount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs uppercase tracking-wide ${
                      order.status === "PAID"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.status === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString("es-CL")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-sm text-neutral-500">
            No hay órdenes que coincidan con los filtros.
          </p>
        )}
      </div>
    </div>
  );
}