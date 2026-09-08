import type { SectionType } from "@/types";

/**
 * Catálogo de variantes por sección (plan.md §14).
 * Las variantes permiten reutilizar secciones en muchas plantillas sin
 * reescribir componentes. Si una sección no tiene variante en este mapa,
 * se usa `DEFAULT_SECTION_VARIANT`.
 */
export const SECTION_VARIANTS: Record<SectionType, readonly string[]> = {
  hero: ["classic", "fullscreen", "split", "minimal"],
  couple: ["classic", "editorial", "portrait"],
  story: ["classic", "timeline", "editorial", "minimal"],
  gallery: ["carousel", "grid", "masonry", "editorial"],
  countdown: ["classic", "minimal", "full", "flip"],
  event: ["classic", "timeline", "compact"],
  dresscode: ["classic", "swatch", "card"],
  location: ["classic", "split", "centered"],
  drive: ["classic", "button", "card"],
  footer: ["classic", "minimal", "centered"],
};

export const DEFAULT_SECTION_VARIANT = "classic";

/** True si la variante es válida para el tipo de sección. */
export function isValidVariant(type: SectionType, variant: string): boolean {
  const allowed = SECTION_VARIANTS[type];
  if (!allowed) {
    return false;
  }
  return allowed.includes(variant);
}

/** Variante válida o la por defecto (para datos legacy/desconocidos). */
export function safeVariant(type: SectionType, variant: string | null | undefined): string {
  if (variant && isValidVariant(type, variant)) {
    return variant;
  }
  return DEFAULT_SECTION_VARIANT;
}