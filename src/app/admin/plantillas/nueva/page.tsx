import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { TemplateForm } from "@/components/admin/TemplateForm";
import { createTemplateAction } from "../actions";

export default async function AdminNuevaPlantillaPage() {
  await requireAdmin();
  return (
    <div>
      <Link
        href="/admin/plantillas"
        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        ← Plantillas
      </Link>
      <header className="mt-4 mb-8">
        <h1 className="font-serif text-3xl font-semibold">
          Nueva plantilla
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Define la configuración (JSON) del Template Engine.
        </p>
      </header>
      <TemplateForm action={createTemplateAction} submitLabel="Crear plantilla" />
    </div>
  );
}