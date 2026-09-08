import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import {
  ordersRepo,
  publicationsRepo,
  usersRepo,
  weddingSectionsRepo,
  weddingsRepo,
} from "@/lib/data";
import type { WeddingStatus } from "@/types";
import { deleteWeddingAction, setWeddingStatusAction } from "../actions";

const ALLOWED_STATUSES: WeddingStatus[] = [
  "DRAFT",
  "READY",
  "PAYMENT_PENDING",
  "PAID",
  "PUBLISHED",
  "EXPIRED",
  "ARCHIVED",
];

export default async function AdminBodaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const wedding = weddingsRepo.findById(id);
  if (!wedding) {
    notFound();
  }
  const owner = usersRepo.findById(wedding.userId);
  const sections = weddingSectionsRepo.findManyByWedding(id);
  const orders = ordersRepo.findManyByWedding(id);
  const publications = publicationsRepo.findManyByWedding(id);

  return (
    <div>
      <Link
        href="/admin/bodas"
        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        ← Bodas
      </Link>

      <header className="mt-4 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Boda
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold">
            {wedding.title}
          </h1>
          <p className="mt-1 text-neutral-600">
            {wedding.partner1} & {wedding.partner2}
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Dueño:{" "}
            {owner ? (
              <Link
                href={`/admin/usuarios/${owner.id}`}
                className="underline"
              >
                {owner.name} ({owner.email})
              </Link>
            ) : (
              "desconocido"
            )}{" "}
            · Slug: /w/{wedding.slug} · {wedding.templateId} v
            {wedding.templateVersion}
          </p>
          {wedding.status === "PUBLISHED" && (
            <Link
              href={`/w/${wedding.slug}`}
              className="mt-2 inline-block rounded-full border border-neutral-300 px-3 py-1 text-xs hover:border-neutral-900"
            >
              Ver página pública
            </Link>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs uppercase tracking-wide">
            {wedding.status}
          </span>
          <form action={setWeddingStatusAction.bind(null, wedding.id)}>
            <select
              name="status"
              defaultValue={wedding.status}
              onChange={(event) => event.currentTarget.form?.requestSubmit()}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs"
            >
              {ALLOWED_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </form>
          <form action={deleteWeddingAction.bind(null, wedding.id)}>
            <button
              type="submit"
              className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:border-red-400"
            >
              Eliminar boda
            </button>
          </form>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-neutral-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 font-serif text-lg font-semibold">
            Datos de la pareja
          </h2>
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">
                Fecha
              </dt>
              <dd className="font-medium">{wedding.eventDate ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">
                Hora
              </dt>
              <dd className="font-medium">{wedding.eventTime ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">
                Lugar
              </dt>
              <dd className="font-medium">{wedding.locationName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">
                Dirección
              </dt>
              <dd className="font-medium">{wedding.locationAddress ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">
                Maps
              </dt>
              <dd className="break-all font-medium">{wedding.mapsUrl ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">
                Drive
              </dt>
              <dd className="break-all font-medium">{wedding.driveUrl ?? "—"}</dd>
            </div>
          </dl>

          <h2 className="mt-8 mb-4 font-serif text-lg font-semibold">
            Secciones
          </h2>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <span
                key={section.id}
                className={`rounded-full px-3 py-1 text-xs ${
                  section.enabled
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {section.type} · {section.variant}
                {!section.enabled && " (oculta)"}
              </span>
            ))}
            {sections.length === 0 && (
              <p className="text-sm text-neutral-500">
                Sin secciones definidas.
              </p>
            )}
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-serif text-lg font-semibold">Órdenes</h2>
            <div className="flex flex-col divide-y divide-neutral-100">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/ordenes/${order.id}`}
                  className="flex items-center justify-between py-2 text-sm hover:underline"
                >
                  <span className="text-neutral-600">
                    {order.id.slice(0, 8)}
                  </span>
                  <span className="font-medium">{order.status}</span>
                </Link>
              ))}
              {orders.length === 0 && (
                <p className="py-2 text-sm text-neutral-500">Sin órdenes.</p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-serif text-lg font-semibold">
              Publicaciones
            </h2>
            <div className="flex flex-col divide-y divide-neutral-100">
              {publications.map((publication) => (
                <div key={publication.id} className="py-2 text-sm">
                  <p className="font-medium">{publication.slug}</p>
                  <p className="text-xs text-neutral-500">
                    {publication.publishedAt ?? "—"} · {publication.status}
                  </p>
                </div>
              ))}
              {publications.length === 0 && (
                <p className="py-2 text-sm text-neutral-500">
                  Sin publicaciones.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}