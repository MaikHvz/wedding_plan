import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { ordersRepo, usersRepo, weddingsRepo } from "@/lib/data";

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default async function AdminUsuarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const user = usersRepo.findById(id);
  if (!user) {
    notFound();
  }
  const weddings = weddingsRepo.findManyByUser(user.id);
  const orders = ordersRepo.findManyByUser(user.id);

  return (
    <div>
      <Link
        href="/admin/usuarios"
        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        ← Usuarios
      </Link>

      <header className="mt-4 mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Usuario
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold">{user.name}</h1>
        <p className="mt-1 text-neutral-600">{user.email}</p>
        <p className="mt-2 text-xs text-neutral-500">
          Rol:{" "}
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-medium uppercase tracking-wide">
            {user.role}
          </span>{" "}
          · Registrado: {new Date(user.createdAt).toLocaleDateString("es-CL")}
        </p>
      </header>

      <section className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold">
          Bodas de {user.name}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {weddings.map((wedding) => (
            <Link
              key={wedding.id}
              href={`/admin/bodas/${wedding.id}`}
              className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:border-neutral-300"
            >
              <div>
                <p className="font-medium">{wedding.title}</p>
                <p className="text-xs text-neutral-500">
                  /w/{wedding.slug} · {wedding.templateId} v
                  {wedding.templateVersion}
                </p>
              </div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs uppercase tracking-wide text-neutral-600">
                {wedding.status}
              </span>
            </Link>
          ))}
          {weddings.length === 0 && (
            <p className="col-span-full py-4 text-sm text-neutral-500">
              Este usuario no tiene bodas.
            </p>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-semibold">Órdenes</h2>
        <div className="flex flex-col divide-y divide-neutral-100">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/ordenes/${order.id}`}
                  className="font-medium hover:underline"
                >
                  Orden {order.id.slice(0, 8)}
                </Link>
                <p className="truncate text-xs text-neutral-500">
                  {order.productId} · {order.provider}
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
                <span className="font-medium">{clp.format(order.amount)}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="py-4 text-sm text-neutral-500">
              Este usuario no tiene órdenes.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}