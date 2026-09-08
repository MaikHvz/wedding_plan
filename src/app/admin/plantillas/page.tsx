import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { templatesRepo } from "@/lib/data";
import { deleteTemplateAction, toggleTemplateAction } from "./actions";

export default async function AdminPlantillasPage() {
  await requireAdmin();
  const templates = templatesRepo.findAll();

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Panel de administración
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold">Plantillas</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {templates.length} plantillas registradas.
          </p>
        </div>
        <Link
          href="/admin/plantillas/nueva"
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700"
        >
          + Nueva plantilla
        </Link>
      </header>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Versión</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {templates.map((template) => (
              <tr key={template.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/plantillas/${template.id}`}
                    className="font-medium hover:underline"
                  >
                    {template.name}
                  </Link>
                  <p className="max-w-md truncate text-xs text-neutral-500">
                    {template.description}
                  </p>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {template.slug}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {template.category}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  v{template.version}
                </td>
                <td className="px-4 py-3">
                  <form
                    action={toggleTemplateAction.bind(
                      null,
                      template.id,
                      template.isActive,
                    )}
                  >
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${
                        template.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {template.isActive ? "Activa" : "Inactiva"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/plantillas/${template.slug}`}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs hover:border-neutral-900"
                    >
                      Demo
                    </Link>
                    <Link
                      href={`/admin/plantillas/${template.id}`}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs hover:border-neutral-900"
                    >
                      Editar
                    </Link>
                    <form action={deleteTemplateAction.bind(null, template.id)}>
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
        {templates.length === 0 && (
          <p className="p-8 text-center text-sm text-neutral-500">
            No hay plantillas.
          </p>
        )}
      </div>
    </div>
  );
}