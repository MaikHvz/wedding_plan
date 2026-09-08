import "server-only";

import type {
  SectionType,
  Template,
  TemplateConfig,
  Theme,
  Wedding,
} from "@/types";
import {
  DEFAULT_TEMPLATE,
  DEFAULT_THEME,
} from "@/config/app";
import { resolveTemplate, resolveTheme } from "@/lib/templates";
import { templatesRepo, weddingMediaRepo, weddingSectionsRepo } from "@/lib/data";
import { publicUrl } from "@/lib/storage";

export interface EffectiveSection {
  id: string;
  type: SectionType;
  variant: string;
  position: number;
  enabled: boolean;
  /** Datos ya parseados de la sección. */
  data: Record<string, unknown>;
}

export interface WeddingPageData {
  wedding: Wedding;
  template: TemplateConfig;
  theme: Theme;
  sections: EffectiveSection[];
  /** URLs públicas de las imágenes de la boda (para galería). */
  mediaUrls: string[];
}

function parseJsonSafe<T>(raw: string | null | undefined): T | null {
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function resolveTemplateConfig(
  template: Template | null,
  requestedVersion?: number | null,
): TemplateConfig {
  const parsed =
    template && parseJsonSafe<TemplateConfig>(template.configJson);
  if (parsed?.sections?.length) {
    return { ...parsed, version: requestedVersion ?? parsed.version };
  }
  const engineTemplate = resolveTemplate(template?.slug ?? "elegance", requestedVersion);
  return engineTemplate ?? DEFAULT_TEMPLATE;
}

export function buildTheme(wedding: Wedding): Theme {
  const stored = parseJsonSafe<{ id?: string; tokens?: Record<string, string> }>(
    wedding.themeJson,
  );
  if (stored?.id) {
    const themed = resolveTheme(stored.id, stored.tokens);
    if (themed) {
      return themed;
    }
  }
  if (stored?.tokens && Object.keys(stored.tokens).length > 0) {
    return { id: "custom", name: wedding.title, tokens: stored.tokens };
  }
  return DEFAULT_THEME;
}

import { getTemplateDemo } from "@/lib/templates/demos";

function defaultSectionData(type: SectionType, templateSlug: string): Record<string, unknown> {
  const demo = getTemplateDemo(templateSlug);
  if (demo?.data?.[type]) {
    return { ...demo.data[type] };
  }
  return emptySectionData(type);
}

function emptySectionData(type: SectionType): Record<string, unknown> {
  switch (type) {
    case "hero":
    case "couple":
    case "story":
    case "event":
    case "dresscode":
    case "location":
    case "drive":
    case "footer":
      return {};
    case "gallery":
      return { images: [] };
    case "countdown":
      return {};
    default:
      return {};
  }
}

/** Ensambla los datos que consume el WeddingRenderer para una boda. */
export function getWeddingPageData(wedding: Wedding): WeddingPageData {
  const template = resolveTemplateConfig(
    templatesRepo.findBySlug(wedding.templateId),
    wedding.templateVersion,
  );

  const storedSections = weddingSectionsRepo.findManyByWedding(wedding.id);
  const hasStored = storedSections.length > 0;

  const sections: EffectiveSection[] = hasStored
    ? storedSections
        .filter((section) => section.enabled)
        .sort((a, b) => a.position - b.position)
        .map((section) => ({
          id: section.id,
          type: section.type,
          variant: section.variant,
          position: section.position,
          enabled: true,
          data: {
            ...defaultSectionData(section.type, template.slug),
            ...(parseJsonSafe(section.dataJson) ?? {}),
          },
        }))
    : template.sections.map((section, index) => ({
        id: `${section.type}-default-${index}`,
        type: section.type,
        variant: section.variant,
        position: index + 1,
        enabled: true,
        data: defaultSectionData(section.type, template.slug),
      }));

  const mediaUrls = weddingMediaRepo
    .findManyByWedding(wedding.id)
    .map((media) => publicUrl(media.storagePath));

  return {
    wedding,
    template,
    theme: buildTheme(wedding),
    sections,
    mediaUrls,
  };
}