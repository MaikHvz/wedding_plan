"use client";

import type { TemplateConfig, Theme } from "@/types";
import type { BuilderPageState } from "@/lib/builder/model";
import type { SectionType } from "@/types";
import type { BuilderTab } from "./Builder";
import { ContentEditor } from "./ContentEditor";
import { SectionManager } from "./SectionManager";
import { ThemeEditor } from "./ThemeEditor";

const TABS: Array<{ id: BuilderTab; label: string }> = [
  { id: "contenido", label: "Contenido" },
  { id: "secciones", label: "Secciones" },
  { id: "diseño", label: "Diseño" },
  { id: "plantilla", label: "Plantilla" },
];

export function BuilderSidebar({
  tab,
  onTab,
  page,
  weddingId,
  selectedId,
  onSelectSection,
  onWeddingField,
  onSectionField,
  onGallery,
  onMoveSection,
  onToggleSection,
  onRemoveSection,
  onAddSection,
  themes,
  onThemeSelect,
  template,
}: {
  tab: BuilderTab;
  onTab: (tab: BuilderTab) => void;
  page: BuilderPageState;
  weddingId: string;
  selectedId: string | null;
  onSelectSection: (id: string) => void;
  onWeddingField: (key: keyof BuilderPageState, value: string) => void;
  onSectionField: (sectionId: string, key: string, value: unknown) => void;
  onGallery: (sectionId: string, urls: string[]) => void;
  onMoveSection: (id: string, direction: -1 | 1) => void;
  onToggleSection: (id: string) => void;
  onRemoveSection: (id: string) => void;
  onAddSection: (type: SectionType) => void;
  themes: Theme[];
  onThemeSelect: (id: string) => void;
  template: TemplateConfig;
}) {
  return (
    <aside className="flex w-full max-w-sm shrink-0 flex-col border-r border-neutral-200 bg-white">
      <nav className="flex gap-1 border-b border-neutral-200 px-3 pt-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTab(id)}
            className={`rounded-t-lg px-3 py-2 text-xs font-medium transition ${
              tab === id
                ? "border-b-2 border-neutral-900 text-neutral-900"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "contenido" && (
          <ContentEditor
            weddingId={weddingId}
            page={page}
            selectedId={selectedId}
            onSelectSection={onSelectSection}
            onWeddingField={onWeddingField}
            onSectionField={onSectionField}
            onGallery={onGallery}
          />
        )}
        {tab === "secciones" && (
          <SectionManager
            sections={page.sections}
            selectedId={selectedId}
            onSelect={onSelectSection}
            onMove={onMoveSection}
            onToggle={onToggleSection}
            onRemove={onRemoveSection}
            onAdd={onAddSection}
          />
        )}
        {tab === "diseño" && (
          <ThemeEditor
            themes={themes}
            currentId={page.themeId}
            onSelect={onThemeSelect}
          />
        )}
        {tab === "plantilla" && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Plantilla actual
            </h3>
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="font-medium">{template.name}</p>
              <p className="mt-1 text-sm text-neutral-500">
                {template.description}
              </p>
              <p className="mt-3 text-xs text-neutral-400">
                Versión {template.version} · categoría {template.category}
              </p>
              <ul className="mt-3 space-y-1">
                {template.sections.map((section) => (
                  <li
                    key={`${section.type}-${section.variant}`}
                    className="flex justify-between text-xs text-neutral-500"
                  >
                    <span>{section.type}</span>
                    <span className="text-neutral-400">{section.variant}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-neutral-400">
              Elegir otra plantilla llega con el catálogo (m05). La boda guarda
              su versión (ADR-003).
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}