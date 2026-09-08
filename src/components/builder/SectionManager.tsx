"use client";

import type { SectionType } from "@/types";
import type { BuilderSection } from "@/lib/builder/model";
import { SECTION_LABELS, BUILDER_SECTION_ORDER } from "@/lib/builder/model";

export function SectionManager({
  sections,
  onMove,
  onToggle,
  onRemove,
  onAdd,
  onSelect,
  selectedId,
}: {
  sections: BuilderSection[];
  onMove: (id: string, direction: -1 | 1) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (type: SectionType) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  const present = new Set(sections.map((section) => section.type));
  const available = BUILDER_SECTION_ORDER.filter((type) => !present.has(type));

  return (
    <div className="space-y-2">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`rounded-lg border p-3 ${
            selectedId === section.id
              ? "border-neutral-900 bg-neutral-50"
              : "border-neutral-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onSelect(section.id)}
                className="block truncate text-sm font-medium text-left hover:underline"
              >
                {section.enabled ? (
                  SECTION_LABELS[section.type]
                ) : (
                  <span className="text-neutral-400 line-through">
                    {SECTION_LABELS[section.type]}
                  </span>
                )}
              </button>
              <p className="text-[11px] text-neutral-400">
                {section.variant} · posición {index + 1}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                disabled={index === 0}
                aria-label="Subir sección"
                className="rounded-md border border-neutral-200 px-2 py-1 text-xs disabled:opacity-40"
                onClick={() => onMove(section.id, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === sections.length - 1}
                aria-label="Bajar sección"
                className="rounded-md border border-neutral-200 px-2 py-1 text-xs disabled:opacity-40"
                onClick={() => onMove(section.id, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                aria-label={section.enabled ? "Ocultar sección" : "Mostrar sección"}
                className={`rounded-full px-2.5 py-1 text-xs ${
                  section.enabled
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-200 text-neutral-600"
                }`}
                onClick={() => onToggle(section.id)}
              >
                {section.enabled ? "Visible" : "Oculta"}
              </button>
              <button
                type="button"
                aria-label="Eliminar sección"
                className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                onClick={() => onRemove(section.id)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}

      {available.length > 0 && (
        <div className="pt-2">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Agregar sección
          </p>
          <div className="flex flex-wrap gap-1.5">
            {available.map((type) => (
              <button
                key={type}
                type="button"
                className="rounded-full border border-dashed border-neutral-300 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                onClick={() => onAdd(type)}
              >
                + {SECTION_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}