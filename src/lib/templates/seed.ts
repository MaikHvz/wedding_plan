import type { TemplatesRepository } from "@/lib/data/repositories/templates";
import { getAllTemplateConfigs } from "./registry";

/**
 * Sincroniza las definiciones del engine con la tabla `templates`.
 * Se invoca dentro de `seedBaseData()`: hace UPSERT por slug para que las
 * bodas encuentren su plantilla y su versión en la BD.
 */
export function syncTemplatesToDb(repo: TemplatesRepository): void {
  for (const config of getAllTemplateConfigs()) {
    const configJson = JSON.stringify(config);
    const existing = repo.findBySlug(config.slug);
    if (existing) {
      repo.update(existing.id, {
        name: config.name,
        description: config.description,
        category: config.category,
        configJson,
        version: config.version,
      });
    } else {
      repo.create({
        slug: config.slug,
        name: config.name,
        description: config.description,
        category: config.category,
        previewUrl: null,
        configJson,
        version: config.version,
        isActive: true,
      });
    }
  }
}