"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { saveWeddingPageAction } from "@/app/dashboard/bodas/[id]/actions";
import type { TemplateConfig, Theme, Wedding } from "@/types";
import type {
  BuilderPageState,
  BuilderSection,
} from "@/lib/builder/model";
import { emptyBuilderSection } from "@/lib/builder/model";
import type { SectionType } from "@/types";
import { BuilderCanvas, sectionsToCanvas } from "./BuilderCanvas";
import { BuilderSidebar } from "./BuilderSidebar";
import { PreviewToolbar } from "./PreviewToolbar";
import type { BuilderViewport, SaveStatus } from "./PreviewToolbar";

export type BuilderTab = "contenido" | "secciones" | "diseño" | "plantilla";

export function Builder({
  weddingId,
  wedding,
  initial,
  template,
  themes,
  saveAction = saveWeddingPageAction,
  homeHref = "/dashboard",
  previewHref = `/dashboard/bodas/${weddingId}/preview`,
  publishHref = `/dashboard/bodas/${weddingId}/checkout`,
  guestsHref = `/dashboard/bodas/${weddingId}/invitados`,
}: {
  weddingId: string;
  wedding: Wedding;
  initial: BuilderPageState;
  template: TemplateConfig;
  themes: Theme[];
  saveAction?: typeof saveWeddingPageAction;
  homeHref?: string;
  previewHref?: string;
  publishHref?: string;
  guestsHref?: string;
}) {
  const [page, setPage] = useState<BuilderPageState>(initial);
  const [tab, setTab] = useState<BuilderTab>("contenido");
  const [selectedId, setSelectedId] = useState<string | null>(
    initial.sections.find((section) => section.enabled)?.id ?? null,
  );
  const [viewport, setViewport] = useState<BuilderViewport>("desktop");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  const latest = useRef(page);
  latest.current = page;

  const savedJson = useRef(JSON.stringify(initial));

  useEffect(() => {
    const currentJson = JSON.stringify(page);
    if (currentJson === savedJson.current) {
      return;
    }
    const timer = setTimeout(() => {
      setSaveStatus("saving");
      saveAction(weddingId, latest.current)
        .then((result) => {
          setSaveStatus(result.ok ? "saved" : "error");
          if (result.ok) {
            savedJson.current = JSON.stringify(latest.current);
          }
        })
        .catch(() => setSaveStatus("error"));
    }, 800);
    return () => clearTimeout(timer);
  }, [page, weddingId, saveAction]);

  // --- mutaciones del estado (sin lógica pesada aquí; editores son los paneles) ---

  function patchSection(id: string, patch: Partial<BuilderSection>) {
    setPage((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === id ? { ...section, ...patch } : section,
      ),
    }));
  }

  function onWeddingField(key: keyof BuilderPageState, value: string) {
    setPage((current) => ({ ...current, [key]: value }));
  }

  function onSectionField(sectionId: string, key: string, value: unknown) {
    patchSection(sectionId, {
      data: { ...(latestData(sectionId) ?? {}), [key]: value },
    });
  }

  function latestData(sectionId: string): Record<string, unknown> | null {
    return latest.current.sections.find((s) => s.id === sectionId)?.data ?? null;
  }

  function onMoveSection(id: string, direction: -1 | 1) {
    setPage((current) => {
      const index = current.sections.findIndex((section) => section.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.sections.length) {
        return current;
      }
      const next = [...current.sections];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return {
        ...current,
        sections: next.map((section, position) => ({
          ...section,
          position: position + 1,
        })),
      };
    });
  }

  function onToggleSection(id: string) {
    setPage((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === id ? { ...section, enabled: !section.enabled } : section,
      ),
    }));
  }

  function onRemoveSection(id: string) {
    setPage((current) => ({
      ...current,
      sections: current.sections
        .filter((section) => section.id !== id)
        .map((section, index) => ({ ...section, position: index + 1 })),
    }));
    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  function onAddSection(type: SectionType) {
    setPage((current) => ({
      ...current,
      sections: [...current.sections, emptyBuilderSection(type, current.sections.length + 1)],
    }));
  }

  function onSelectSection(id: string) {
    setSelectedId(id);
  }

  function onGallery(sectionId: string, urls: string[]) {
    patchSection(sectionId, { data: { ...(latestData(sectionId) ?? {}), images: urls } });
  }

  function onThemeSelect(themeId: string) {
    setPage((current) => ({ ...current, themeId }));
  }

  // Renderer recibe la boda con los campos editados
  const weddingForRenderer: Wedding = {
    ...wedding,
    title: page.title,
    partner1: page.partner1,
    partner2: page.partner2,
    eventDate: page.eventDate || null,
    eventTime: page.eventTime || null,
    locationName: page.locationName || null,
    locationAddress: page.locationAddress || null,
    mapsUrl: page.mapsUrl || null,
    driveUrl: page.driveUrl || null,
    themeJson: page.themeId ? JSON.stringify({ id: page.themeId }) : null,
  };

  const theme =
    themes.find((candidate) => candidate.id === page.themeId) ?? themes[0] ?? {
      id: "ivory",
      name: "Ivory",
      tokens: {},
    };

  return (
    <div className="flex h-dvh flex-col bg-neutral-50 text-neutral-900">
      <header className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-2.5">
        <Link href={homeHref} className="text-sm font-semibold">
          Wedding Builder
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs ${
              saveStatus === "error" ? "text-red-600" : "text-neutral-500"
            }`}
          >
            {saveStatus === "saving"
              ? "Guardando..."
              : saveStatus === "saved"
                ? "Guardado"
                : "Error al guardar"}
          </span>
          <Link
            href={previewHref}
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs hover:border-neutral-900"
          >
            Preview
          </Link>
          <Link
            href={guestsHref}
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs hover:border-neutral-900"
          >
            Invitados
          </Link>
          {wedding.status === "PUBLISHED" && (
            <Link
              href={`/w/${wedding.slug}`}
              className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs hover:border-neutral-900"
            >
              Página pública
            </Link>
          )}
          <Link
            href={publishHref}
            className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs text-white hover:bg-neutral-700"
          >
            Publicar
          </Link>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <BuilderSidebar
          tab={tab}
          onTab={setTab}
          page={page}
          weddingId={weddingId}
          selectedId={selectedId}
          onSelectSection={onSelectSection}
          onWeddingField={onWeddingField}
          onSectionField={onSectionField}
          onGallery={onGallery}
          onMoveSection={onMoveSection}
          onToggleSection={onToggleSection}
          onRemoveSection={onRemoveSection}
          onAddSection={onAddSection}
          themes={themes}
          onThemeSelect={onThemeSelect}
          template={template}
        />
        <BuilderCanvas
          wedding={weddingForRenderer}
          template={template}
          theme={theme}
          sections={sectionsToCanvas(page.sections)}
          viewport={viewport}
        />
      </div>

      <PreviewToolbar
        viewport={viewport}
        onViewport={setViewport}
        saveStatus={saveStatus}
      />
    </div>
  );
}