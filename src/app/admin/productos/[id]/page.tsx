import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { productsRepo } from "@/lib/data";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProductAction } from "../actions";

export default async function AdminEditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const product = productsRepo.findById(id);
  if (!product) {
    notFound();
  }
  const action = updateProductAction.bind(null, product.id);

  return (
    <div>
      <Link
        href="/admin/productos"
        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        ← Productos
      </Link>
      <header className="mt-4 mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Producto
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold">
          {product.name}
        </h1>
      </header>
      <ProductForm
        product={product}
        action={action}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}