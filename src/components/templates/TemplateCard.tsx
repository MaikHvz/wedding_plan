"use client";

import { useState } from "react";
import Link from "next/link";
import type { TemplateConfig, Theme } from "@/types";
import { useTemplateAction } from "@/app/plantillas/actions";
import { TemplatePreview } from "./TemplatePreview";

/**
 * Tarjeta del catálogo (v2, m05).
 * Muestra la miniatura renderizada con el token del tema y permite repintar la
 * plantilla eligiendo entre sus paletas de color (swatches). "Usar plantilla"
 * crea la boda con el tema seleccionado.
 */
export function TemplateCard({
  template,
  themes,
}: {
  template: TemplateConfig;
  themes: Theme[];
}) {
  const [themeId, setThemeId] = useState(template.themeId);
  const swatches = (template.suggestedThemeIds ?? themes.map((theme) => theme.id))
    .map((id) => themes.find((theme) => theme.id === id) ?? null)
    .filter((theme): theme is Theme => theme !== null);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <Link
        href={`/plantillas/${template.slug}`}
        className="block transition-opacity hover:opacity-90"
        aria-label={`Ver demo de ${template.name}`}
      >
        <TemplatePreview template={template} themeId={themeId} />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-serif text-lg font-semibold">{template.name}</h2>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-neutral-600">
            {template.category}
          </span>
        </div>
        <p className="line-clamp-2 flex-1 text-sm text-neutral-600">
          {template.description}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-neutral-400">
            Color
          </span>
          {swatches.map((theme) => {
            const color =
              theme.tokens["t-accent"] ?? theme.tokens["t-cta-bg"] ?? "#999";
            const active = theme.id === themeId;
            return (
              <button
                key={theme.id}
                type="button"
                title={theme.name}
                aria-label={`Aplicar tema ${theme.name}`}
                aria-pressed={active}
                onClick={() => setThemeId(theme.id)}
                className={`h-5 w-5 rounded-full transition-transform ${
                  active
                    ? "scale-110 ring-2 ring-neutral-900 ring-offset-2"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>

        <div className="mt-1 flex gap-2">
          <Link
            href={`/plantillas/${template.slug}`}
            className="flex-1 rounded-full border border-neutral-300 px-4 py-2 text-center text-sm font-medium hover:border-neutral-900"
          >
            Ver demo
          </Link>
          <form action={useTemplateAction} className="flex-1">
            <input type="hidden" name="slug" value={template.slug} />
            <input type="hidden" name="themeId" value={themeId} />
            <button
              type="submit"
              className="w-full rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
            >
              Usar plantilla
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}