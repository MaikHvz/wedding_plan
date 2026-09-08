import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { productsRepo } from "@/lib/data";
import { deleteProductAction } from "./actions";

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default async function AdminProductosPage() {
  await requireAdmin();
  const products = productsRepo.findAll();

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Panel de administración
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold">Productos</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {products.length} productos registrados.
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700"
        >
          + Nuevo producto
        </Link>
      </header>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Duración</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="max-w-md truncate text-xs text-neutral-500">
                    {product.description}
                  </p>
                </td>
                <td className="px-4 py-3 font-medium">
                  {clp.format(product.price)}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {product.durationDays
                    ? `${product.durationDays} días`
                    : "Permanente"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs uppercase tracking-wide ${
                      product.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {product.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs hover:border-neutral-900"
                    >
                      Editar
                    </Link>
                    <form action={deleteProductAction.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:border-red-400"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-sm text-neutral-500">
            No hay productos.
          </p>
        )}
      </div>
    </div>
  );
}