import Link from "next/link";
import { getAdminStats } from "@/lib/admin/queries";

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-neutral-100 text-neutral-700",
  READY: "bg-sky-100 text-sky-700",
  PAYMENT_PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  EXPIRED: "bg-orange-100 text-orange-700",
  ARCHIVED: "bg-neutral-200 text-neutral-600",
};

export default async function AdminDashboardPage() {
  const stats = getAdminStats();

  const cards = [
    {
      label: "Usuarios",
      value: stats.totalUsers.toLocaleString("es-CL"),
      href: "/admin/usuarios",
    },
    {
      label: "Bodas",
      value: stats.totalWeddings.toLocaleString("es-CL"),
      href: "/admin/bodas",
    },
    {
      label: "Publicadas",
      value: stats.totalPublished.toLocaleString("es-CL"),
      href: "/admin/publicaciones",
    },
    {
      label: "Órdenes",
      value: stats.totalOrders.toLocaleString("es-CL"),
      href: "/admin/ordenes",
    },
    {
      label: "Ingresos (PAID)",
      value: clp.format(stats.paidRevenue),
      href: "/admin/ordenes",
    },
  ];

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Panel de administración
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold">Resumen</h1>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-neutral-200 bg-white p-5 hover:border-neutral-300"
          >
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {card.label}
            </p>
            <p className="mt-2 font-serif text-2xl font-semibold">
              {card.value}
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold">
            Bodas por estado
          </h2>
          <div className="flex flex-col gap-2">
            {stats.weddingsByStatus.map((row) => (
              <div
                key={row.status}
                className="flex items-center justify-between text-sm"
              >
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${
                    STATUS_COLORS[row.status] ?? "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {row.status}
                </span>
                <span className="font-medium">{row.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold">
            Últimas bodas
          </h2>
          <div className="flex flex-col divide-y divide-neutral-100">
            {stats.recentWeddings.map((wedding) => (
              <div
                key={wedding.id}
                className="flex items-center justify-between gap-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/bodas/${wedding.id}`}
                    className="truncate font-medium hover:underline"
                  >
                    {wedding.title}
                  </Link>
                  <p className="truncate text-xs text-neutral-500">
                    {wedding.ownerName} · {wedding.ownerEmail}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs uppercase tracking-wide ${
                    STATUS_COLORS[wedding.status] ?? "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {wedding.status}
                </span>
              </div>
            ))}
            {stats.recentWeddings.length === 0 && (
              <p className="py-4 text-sm text-neutral-500">
                No hay bodas aún.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold">
          Últimas órdenes
        </h2>
        <div className="flex flex-col divide-y divide-neutral-100">
          {stats.recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/ordenes/${order.id}`}
                  className="font-medium hover:underline"
                >
                  {order.weddingTitle || "—"} · {order.productName}
                </Link>
                <p className="truncate text-xs text-neutral-500">
                  {order.ownerEmail} · {order.createdAt}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs uppercase tracking-wide ${
                    order.status === "PAID"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {order.status}
                </span>
                <span className="font-medium">
                  {clp.format(order.amount)}
                </span>
              </div>
            </div>
          ))}
          {stats.recentOrders.length === 0 && (
            <p className="py-4 text-sm text-neutral-500">
              No hay órdenes aún.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
