"use client";

import { useState } from "react";
import type { Template } from "@/types";

export type TemplateFormAction = (
  formData: FormData,
) => Promise<void>;

export function TemplateForm({
  template,
  action,
  submitLabel,
}: {
  template?: Template;
  action: TemplateFormAction;
  submitLabel: string;
}) {
  const [config, setConfig] = useState(() => {
    if (!template) {
      return JSON.stringify(
        {
          id: "",
          slug: "",
          name: "",
          description: "",
          category: "",
          version: 1,
          themeId: "ivory",
          suggestedThemeIds: [],
          sections: [],
        },
        null,
        2,
      );
    }
    try {
      return JSON.stringify(JSON.parse(template.configJson), null, 2);
    } catch {
      return template.configJson;
    }
  });

  return (
    <form
      action={action}
      className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Nombre *
          <input
            name="name"
            required
            defaultValue={template?.name ?? ""}
            placeholder="Mi plantilla"
            className="rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Slug *
          <input
            name="slug"
            required
            defaultValue={template?.slug ?? ""}
            placeholder="mi-plantilla"
            className="rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Categoría
          <input
            name="category"
            defaultValue={template?.category ?? ""}
            placeholder="Elegante"
            className="rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Versión
          <input
            name="version"
            type="number"
            min={1}
            defaultValue={template?.version ?? 1}
            className="rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1 text-sm">
        Descripción
        <textarea
          name="description"
          rows={2}
          defaultValue={template?.description ?? ""}
          className="rounded-lg border border-neutral-300 px-3 py-2"
        />
      </label>

      <label className="mt-4 flex flex-col gap-1 text-sm">
        Configuración (JSON del Template Engine)
        <textarea
          name="configJson"
          rows={14}
          value={config}
          onChange={(event) => setConfig(event.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 font-mono text-xs"
        />
      </label>

      <label className="mt-4 flex items-center gap-2 text-sm">
        <input
          name="active"
          type="checkbox"
          defaultChecked={template?.isActive ?? true}
          className="h-4 w-4"
        />
        Plantilla activa (visible en el catálogo)
      </label>

      <button
        type="submit"
        className="mt-6 rounded-full bg-neutral-900 px-6 py-2 text-sm text-white hover:bg-neutral-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}