import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "../actions";

export default async function AdminNuevoProductoPage() {
  await requireAdmin();
  return (
    <div>
      <Link
        href="/admin/productos"
        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        ← Productos
      </Link>
      <header className="mt-4 mb-8">
        <h1 className="font-serif text-3xl font-semibold">Nuevo producto</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Define el plan que se mostrará en el checkout.
        </p>
      </header>
      <ProductForm action={createProductAction} submitLabel="Crear producto" />
    </div>
  );
}