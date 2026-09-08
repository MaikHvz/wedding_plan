"use client";

import { useMemo, useState } from "react";
import type { TemplateConfig, Theme } from "@/types";
import { TemplateCard } from "./TemplateCard";

/**
 * Catálogo de plantillas (v2, m05).
 * Filtra por categoría (client-side) y pinta las tarjetas con swatches de color.
 */
export function Catalog({
  templates,
  themes,
}: {
  templates: TemplateConfig[];
  themes: Theme[];
}) {
  const categories = useMemo(
    () => ["Todas", ...new Set(templates.map((template) => template.category))],
    [templates],
  );
  const [category, setCategory] = useState("Todas");

  const filtered =
    category === "Todas"
      ? templates
      : templates.filter((template) => template.category === category);

  if (templates.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
        <p className="font-medium text-neutral-700">
          Próximamente: nuestras primeras plantillas
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              category === item
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <TemplateCard key={template.slug} template={template} themes={themes} />
        ))}
      </section>
    </>
  );
}