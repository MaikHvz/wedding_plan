import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { seedBaseData, weddingsRepo } from "@/lib/data";
import { applyExpiryIfDue } from "@/lib/wedding/publish";
import { getActiveProducts } from "@/lib/payments";
import { weddingStatusMeta } from "@/lib/ui/format";
import type { Product } from "@/types";
import { completeCheckoutAction } from "./actions";

export const dynamic = "force-dynamic";

function productFeatures(product: Product): string[] {
  try {
    const parsed = JSON.parse(product.featuresJson) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  await seedBaseData();

  const wedding = weddingsRepo.findById(id);
  if (!wedding || wedding.userId !== user.id) {
    notFound();
  }
  applyExpiryIfDue(wedding.id);
  const current = weddingsRepo.findById(id) ?? wedding;

  const products = await getActiveProducts();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Publicar tu página
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold">
          Publica tu página
        </h1>
        <p className="mt-2 text-neutral-600">
          {current.title} ·{" "}
          <span className="font-medium text-neutral-900">
            {weddingStatusMeta(current.status).label.toLowerCase()}
          </span>
        </p>
      </header>

      {current.status === "PUBLISHED" ? (
        <section className="rounded-xl border border-neutral-200 p-6 text-center">
          <p className="font-medium text-neutral-800">
            Tu página ya está publicada.
          </p>
          <Link
            href={`/w/${current.slug}`}
            className="mt-4 inline-block rounded-full bg-neutral-900 px-6 py-2.5 text-sm text-white hover:bg-neutral-700"
          >
            Ver página pública
          </Link>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          {products.map((product) => (
            <form
              key={product.id}
              action={completeCheckoutAction}
              className="rounded-xl border border-neutral-200 p-5"
            >
              <input type="hidden" name="weddingId" value={wedding.id} />
              <input type="hidden" name="productId" value={product.id} />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-lg font-semibold">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    {product.description}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {productFeatures(product).map((feature) => (
                      <li
                        key={feature}
                        className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl font-semibold">
                    {clp.format(product.price)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Pago único{product.durationDays ? ` · ${product.durationDays} días` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-xs text-neutral-500">
                  Estás en modo demo: no hay cobro real.
                </p>
                <button
                  type="submit"
                  className="rounded-full bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700"
                >
                  Confirmar y publicar
                </button>
              </div>
            </form>
          ))}
        </section>
      )}
    </div>
  );
}