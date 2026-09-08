import type { SectionType, TemplateConfig } from "@/types";
import { TEMPLATE_DEFINITIONS } from "./definitions";
import { isValidVariant } from "./variants";
import { getTheme } from "./themes";

/** Plantillas de la primera generación que se fusionaron como paletas de color
 * de `elegance` (m05→v2). Las bodas creadas con esos slugs siguen resolviendo
 * la estructura base (sus secciones viven en la BD), sin romper páginas. */
const LEGACY_TEMPLATE_MAP: Record<string, string> = {
  romantic: "elegance",
  minimal: "elegance",
  garden: "elegance",
  luxury: "elegance",
};

/** Valida una configuración de plantilla; devuelve lista de errores. */
export function validateTemplateConfig(config: TemplateConfig): string[] {
  const errors: string[] = [];
  if (!config.id) {
    errors.push(`${config.name ?? "(sin nombre)"}: id requerido`);
  }
  if (!config.slug) {
    errors.push(`${config.id}: slug requerido`);
  }
  if (!Number.isInteger(config.version) || config.version < 1) {
    errors.push(`${config.id}: versión inválida`);
  }
  if (!config.themeId) {
    errors.push(`${config.id}: themeId requerido`);
  }
  if (
    config.suggestedThemeIds &&
    config.suggestedThemeIds.some((themeId) => getTheme(themeId) === null)
  ) {
    errors.push(
      `${config.id}: suggestedThemeIds con tema desconocido "${config.suggestedThemeIds.find(
        (themeId) => getTheme(themeId) === null,
      )}"`,
    );
  }
  if (!Array.isArray(config.sections) || config.sections.length === 0) {
    errors.push(`${config.id}: secciones requeridas`);
  } else {
    for (const section of config.sections) {
      if (!isValidVariant(section.type as SectionType, section.variant)) {
        errors.push(
          `${config.id}: variante "${section.variant}" no válida para la sección "${section.type}"`,
        );
      }
    }
  }
  return errors;
}

/** Lista todas las plantillas del registro (engine). */
export function getAllTemplateConfigs(): TemplateConfig[] {
  return TEMPLATE_DEFINITIONS.map((config) => ({
    ...config,
    sections: config.sections.map((section) => ({ ...section })),
  }));
}

/** Plantilla por defecto: la primera del registro (Elegante hoy). */
export const DEFAULT_TEMPLATE: TemplateConfig = getAllTemplateConfigs()[0];

/** Devuelve la plantilla del registro por slug, o null. */
export function getTemplateConfig(slug: string): TemplateConfig | null {
  const effective = LEGACY_TEMPLATE_MAP[slug] ?? slug;
  const found = TEMPLATE_DEFINITIONS.find((config) => config.slug === effective);
  return found ? { ...found, sections: found.sections.map((section) => ({ ...section })) } : null;
}

/**
 * Versiones disponibles de una plantilla (ADR-003). Hoy el registro guarda la
 * versión vigente de cada plantilla; en el futuro se podrán retener históricas.
 */
export function getTemplateVersions(slug: string): number[] {
  const config = getTemplateConfig(slug);
  return config ? [config.version] : [];
}

/**
 * Resuelve una plantilla por slug+versión.
 * Regla ADR-003/plan.md §13: si la versión pedida no está registrada, se cae a
 * la versión disponible (nunca rompe páginas ya creadas). Devuelve null solo
 * si no existe ninguna plantilla con ese slug.
 */
export function resolveTemplate(
  slug: string,
  requestedVersion?: number | null,
): TemplateConfig | null {
  const config = getTemplateConfig(slug);
  if (!config) {
    return null;
  }
  if (requestedVersion != null && requestedVersion !== config.version) {
    return { ...config, version: requestedVersion };
  }
  return config;
}

/** Falla en el arranque si alguna definición del registro es inválida. */
export function assertValidTemplates(): void {
  for (const config of TEMPLATE_DEFINITIONS) {
    const errors = validateTemplateConfig(config);
    if (errors.length > 0) {
      throw new Error(`Plantilla inválida: ${errors.join("; ")}`);
    }
  }
}