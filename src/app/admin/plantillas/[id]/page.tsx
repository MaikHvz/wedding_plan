import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { templatesRepo } from "@/lib/data";
import { TemplateForm } from "@/components/admin/TemplateForm";
import { updateTemplateAction } from "../actions";

export default async function AdminEditarPlantillaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const template = templatesRepo.findById(id);
  if (!template) {
    notFound();
  }
  const action = updateTemplateAction.bind(null, template.id);

  return (
    <div>
      <Link
        href="/admin/plantillas"
        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        ← Plantillas
      </Link>
      <header className="mt-4 mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Plantilla
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold">
          {template.name}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Slug: {template.slug} · v{template.version}
        </p>
      </header>
      <TemplateForm
        template={template}
        action={action}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}