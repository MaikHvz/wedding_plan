import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import {
  ordersRepo,
  productsRepo,
  usersRepo,
  weddingsRepo,
} from "@/lib/data";

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default async function AdminOrdenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const order = ordersRepo.findById(id);
  if (!order) {
    notFound();
  }
  const user = usersRepo.findById(order.userId);
  const wedding = weddingsRepo.findById(order.weddingId);
  const product = productsRepo.findById(order.productId);

  return (
    <div>
      <Link
        href="/admin/ordenes"
        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        ← Órdenes
      </Link>

      <header className="mt-4 mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Orden
        </p>
        <h1 className="mt-1 font-mono text-2xl font-semibold">{order.id}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Creada: {order.createdAt}
        </p>
      </header>

      <section className="rounded-xl border border-neutral-200 bg-white p-6">
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Usuario
            </dt>
            <dd className="font-medium">
              {user ? (
                <Link
                  href={`/admin/usuarios/${user.id}`}
                  className="hover:underline"
                >
                  {user.name} ({user.email})
                </Link>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Boda
            </dt>
            <dd className="font-medium">
              {wedding ? (
                <Link
                  href={`/admin/bodas/${wedding.id}`}
                  className="hover:underline"
                >
                  {wedding.title}
                </Link>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Producto
            </dt>
            <dd className="font-medium">{product?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Monto
            </dt>
            <dd className="font-medium">{clp.format(order.amount)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Estado
            </dt>
            <dd>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${
                  order.status === "PAID"
                    ? "bg-emerald-100 text-emerald-700"
                    : order.status === "PENDING"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {order.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Proveedor
            </dt>
            <dd className="font-medium">{order.provider}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Referencia del proveedor
            </dt>
            <dd className="font-mono text-xs">
              {order.providerReference ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Pagada en
            </dt>
            <dd className="font-medium">{order.paidAt ?? "—"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}