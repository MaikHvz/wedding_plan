import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminPublications } from "@/lib/admin/queries";

export default async function AdminPublicacionesPage() {
  await requireAdmin();
  const publications = listAdminPublications();

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Panel de administración
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold">
          Publicaciones
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          {publications.length} publicaciones registradas.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Boda</th>
              <th className="px-4 py-3">Dueño</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Publicada</th>
              <th className="px-4 py-3">Expira</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {publications.map((publication) => (
              <tr key={publication.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/w/${publication.slug}`}
                    className="font-medium hover:underline"
                  >
                    /w/{publication.slug}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/bodas/${publication.weddingId}`}
                    className="text-neutral-600 hover:underline"
                  >
                    {publication.weddingTitle}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">
                  {publication.ownerEmail}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs uppercase tracking-wide ${
                      publication.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-700"
                        : publication.status === "EXPIRED"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {publication.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">
                  {publication.publishedAt
                    ? new Date(publication.publishedAt).toLocaleDateString("es-CL")
                    : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">
                  {publication.expiresAt
                    ? new Date(publication.expiresAt).toLocaleDateString("es-CL")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {publications.length === 0 && (
          <p className="p-8 text-center text-sm text-neutral-500">
            No hay publicaciones.
          </p>
        )}
      </div>
    </div>
  );
}