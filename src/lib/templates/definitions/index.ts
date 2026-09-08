import type { TemplateConfig } from "@/types";
import boho from "@/templates/boho.json";
import clasica from "@/templates/clasica.json";
import costa from "@/templates/costa.json";
import elegance from "@/templates/elegance.json";
import urbana from "@/templates/urbana.json";

/**
 * Registro de definiciones de plantillas (plan.md §112).
 * Cada plantilla vive en `src/templates/<slug>.json`. Para incorporar una
 * plantilla nueva basta con crear su JSON y añadir una línea aquí; el Builder
 * y el Renderer no se reescriben.
 *
 * v2: las plantillas de la primera generación (romantic/minimal/garden/luxury)
 * se fusionaron como paletas de color de `elegance`; las plantillas del
 * registro ahora se diferencian por ESTRUCTURA (secciones + variantes) y su
 * color es un tema seleccionable (`themeId` por defecto + `suggestedThemeIds`).
 */
export const TEMPLATE_DEFINITIONS: readonly TemplateConfig[] = [
  elegance as TemplateConfig,
  boho as TemplateConfig,
  urbana as TemplateConfig,
  clasica as TemplateConfig,
  costa as TemplateConfig,
];