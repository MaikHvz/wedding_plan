"use client";

import { WeddingRenderer } from "@/components/wedding/WeddingRenderer";
import type { SectionType, TemplateConfig, Theme, Wedding } from "@/types";
import type { BuilderPageState } from "@/lib/builder/model";

export type BuilderViewport = "desktop" | "tablet" | "mobile";

interface CanvasSection {
  id: string;
  type: SectionType;
  variant: string;
  position: number;
  enabled: boolean;
  data: Record<string, unknown>;
}

const VIEWPORT_WIDTH: Record<BuilderViewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

export function BuilderCanvas({
  wedding,
  template,
  theme,
  sections,
  viewport,
}: {
  wedding: Wedding;
  template: TemplateConfig;
  theme: Theme;
  sections: CanvasSection[];
  viewport: BuilderViewport;
}) {
  return (
    <div className="flex-1 overflow-auto bg-neutral-200/60 p-4 lg:p-8">
      <div
        style={{ width: VIEWPORT_WIDTH[viewport] }}
        className="mx-auto overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-black/5"
      >
        <WeddingRenderer
          wedding={wedding}
          template={template}
          theme={theme}
          sections={sections}
        />
      </div>
    </div>
  );
}

/** Convierte el estado del builder en el modelo que consume el renderer. */
export function sectionsToCanvas(sections: BuilderPageState["sections"]): CanvasSection[] {
  return sections.map((section) => ({
    id: section.id,
    type: section.type,
    variant: section.variant,
    position: section.position,
    enabled: section.enabled,
    data: section.data,
  }));
}