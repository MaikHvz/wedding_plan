import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminWeddings, listAllTemplatesSimple } from "@/lib/admin/queries";

const WEDDING_STATUSES = [
  "DRAFT",
  "READY",
  "PAYMENT_PENDING",
  "PAID",
  "PUBLISHED",
  "EXPIRED",
  "ARCHIVED",
] as const;

export const dynamic = "force-dynamic";

export default async function AdminBodasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const rawStatus = params.status ?? "";
  const rawTemplate = params.template ?? "";
  const rawSearch = params.q ?? "";

  const status =
    typeof rawStatus === "string" &&
    (WEDDING_STATUSES as readonly string[]).includes(rawStatus)
      ? rawStatus
      : undefined;
  const templateId = typeof rawTemplate === "string" ? rawTemplate : undefined;
  const search = typeof rawSearch === "string" ? rawSearch.trim() : undefined;

  const weddings = listAdminWeddings({ status, templateId, search });
  const templates = listAllTemplatesSimple();

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Panel de administración
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold">Bodas</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {weddings.length} bodas encontradas.
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
          placeholder="Buscar por boda, nombre o email…"
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {WEDDING_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          name="template"
          defaultValue={templateId ?? ""}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Todas las plantillas</option>
          {templates.map((template) => (
            <option key={template.slug} value={template.slug}>
              {template.name}
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
              <th className="px-4 py-3">Boda</th>
              <th className="px-4 py-3">Dueño</th>
              <th className="px-4 py-3">Plantilla</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Actualizada</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {weddings.map((wedding) => (
              <tr key={wedding.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/bodas/${wedding.id}`}
                    className="font-medium hover:underline"
                  >
                    {wedding.title}
                  </Link>
                  <p className="text-xs text-neutral-500">/w/{wedding.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs text-neutral-600">{wedding.ownerName}</p>
                  <p className="text-xs text-neutral-400">{wedding.ownerEmail}</p>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {wedding.templateId}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs uppercase tracking-wide text-neutral-600">
                    {wedding.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">
                  {new Date(wedding.updatedAt).toLocaleDateString("es-CL")}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/bodas/${wedding.id}`}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs hover:border-neutral-900"
                    >
                      Detalle
                    </Link>
                    <Link
                      href={`/admin/bodas/${wedding.id}/edit`}
                      className="rounded-full bg-neutral-900 px-3 py-1 text-xs text-white hover:bg-neutral-700"
                    >
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {weddings.length === 0 && (
          <p className="p-8 text-center text-sm text-neutral-500">
            No hay bodas que coincidan con los filtros.
          </p>
        )}
      </div>
    </div>
  );
}