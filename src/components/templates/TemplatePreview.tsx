/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from "react";
import type { TemplateConfig } from "@/types";
import { getTheme } from "@/lib/templates";
import { getTemplateDemo } from "@/lib/templates/demos";
import {
  ambientOf,
  BohoArch,
  LaurelWreath,
  Wave,
  UrbanaShape,
  EleganceLine,
} from "@/components/wedding/Motifs";

/**
 * Miniatura enriquecida y representativa de cada plantilla (m05 / v2.2).
 * Refleja fielmente la identidad, proporción de colores, fotografía de portada
 * y ornamentación específica de cada estilo.
 */
export function TemplatePreview({
  template,
  themeId,
}: {
  template: TemplateConfig;
  themeId?: string;
}) {
  const theme = getTheme(themeId ?? template.themeId);
  const tokens = theme?.tokens ?? {};
  const demo = getTemplateDemo(template.slug);
  const heroImage = (demo?.data?.hero?.image as string) || template.previewUrl;
  const ambient = ambientOf(template.slug);

  const style: Record<string, string> = {
    "--t-bg": tokens["t-bg"] ?? "#faf7f2",
    "--t-surface": tokens["t-surface"] ?? "#ffffff",
    "--t-accent": tokens["t-accent"] ?? "#b98a5e",
    "--t-accent-soft": tokens["t-accent-soft"] ?? "#e9d9c8",
    "--t-text": tokens["t-text"] ?? "#3d3a36",
    "--t-muted": tokens["t-muted"] ?? "#8a8377",
    "--t-border": tokens["t-border"] ?? "rgba(0,0,0,0.1)",
    "--t-radius": tokens["t-radius"] ?? "0.75rem",
  };

  const partner1 = demo?.partner1 ?? "Novia";
  const partner2 = demo?.partner2 ?? "Novio";

  // 1. URBANA (Split layout editorial)
  if (ambient === "urbana") {
    return (
      <div
        style={style as CSSProperties}
        className="relative grid aspect-[4/3] grid-cols-2 overflow-hidden rounded-t-xl bg-[var(--t-bg)] text-[var(--t-text)]"
      >
        <div className="relative h-full overflow-hidden bg-neutral-900">
          {heroImage && (
            <img
              src={heroImage}
              alt=""
              className="h-full w-full object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-3 left-3 rounded-none border border-white/30 bg-black/60 px-2 py-0.5 text-[9px] uppercase tracking-widest text-white backdrop-blur-sm">
            Metropolis
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <UrbanaShape className="mb-2 h-5 w-5 opacity-80" />
          <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--t-muted)]">
            Editorial Chic
          </p>
          <div className="my-1 font-serif text-lg font-semibold leading-tight text-[var(--t-text)]">
            {partner1[0]} / {partner2[0]}
          </div>
          <div className="h-px w-8 bg-[var(--t-accent)] my-1" />
          <p className="text-[10px] uppercase tracking-widest text-[var(--t-muted)]">
            {partner1} &amp; {partner2}
          </p>
        </div>
      </div>
    );
  }

  // 2. BOHO (Warm ambient & arched card)
  if (ambient === "boho") {
    return (
      <div
        style={style as CSSProperties}
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-xl bg-[var(--t-bg)] p-4 text-[var(--t-text)]"
      >
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--t-bg)]/90 via-[var(--t-bg)]/60 to-[var(--t-bg)]/40" />
        <div className="relative flex w-full max-w-[85%] flex-col items-center rounded-2xl border border-[var(--t-border)] bg-[var(--t-surface)]/85 px-4 py-3 shadow-md backdrop-blur-sm">
          <BohoArch className="h-6 w-10 text-[var(--t-accent)]" />
          <span className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[var(--t-muted)]">
            Alma Botánica
          </span>
          <div className="font-serif text-lg font-semibold leading-tight text-[var(--t-text)]">
            {partner1} &amp; {partner2}
          </div>
          <span className="mt-1 rounded-full bg-[var(--t-accent-soft)] px-2.5 py-0.5 text-[8px] font-medium tracking-wider text-[var(--t-text)]">
            JARDÍN · BOHO CHIC
          </span>
        </div>
      </div>
    );
  }

  // 3. CLÁSICA (Imperial Grandeur & Laurel)
  if (ambient === "clasica") {
    return (
      <div
        style={style as CSSProperties}
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-xl bg-[var(--t-bg)] p-4 text-[var(--t-text)]"
      >
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--t-bg)]/85 via-[var(--t-bg)]/60 to-[var(--t-bg)]/90" />
        <div className="relative flex flex-col items-center text-center">
          <LaurelWreath className="h-6 w-20 text-[var(--t-accent)]" />
          <p className="mt-1 text-[9px] uppercase tracking-[0.35em] text-[var(--t-muted)]">
            Ceremonia Solemne
          </p>
          <div className="my-1 font-serif text-xl font-normal leading-tight tracking-wide text-[var(--t-text)]">
            {partner1} &amp; {partner2}
          </div>
          <div className="flex items-center gap-2 text-[var(--t-accent)]">
            <div className="h-px w-6 bg-[var(--t-accent)]" />
            <span className="text-[10px]">❦</span>
            <div className="h-px w-6 bg-[var(--t-accent)]" />
          </div>
        </div>
      </div>
    );
  }

  // 4. COSTA (Coastal Ocean & Waves)
  if (ambient === "costa") {
    return (
      <div
        style={style as CSSProperties}
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-xl bg-[var(--t-bg)] p-4 text-[var(--t-text)]"
      >
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--t-bg)]/80 via-[var(--t-bg)]/50 to-[var(--t-bg)]/85" />
        <div className="relative flex flex-col items-center text-center">
          <Wave className="h-5 w-24 text-[var(--t-accent)]" />
          <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[var(--t-muted)]">
            Riviera · Brisa de Mar
          </p>
          <div className="my-1 font-serif text-xl font-semibold leading-tight text-[var(--t-text)]">
            {partner1} &amp; {partner2}
          </div>
          <div className="h-px w-10 bg-[var(--t-accent)]" />
        </div>
      </div>
    );
  }

  // 5. ELEGANCE (Haute Couture & Monogram)
  return (
    <div
      style={style as CSSProperties}
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-xl bg-[var(--t-bg)] p-4 text-[var(--t-text)]"
    >
      {heroImage && (
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--t-bg)]/85 via-[var(--t-bg)]/55 to-[var(--t-bg)]/90" />
      <div className="relative flex flex-col items-center text-center">
        <EleganceLine className="h-3 w-16 text-[var(--t-accent)]" />
        <div className="my-1.5 inline-flex items-center rounded-full border border-[var(--t-border)] bg-[var(--t-surface)]/70 px-3 py-0.5 backdrop-blur-md">
          <span className="font-serif text-[11px] tracking-widest text-[var(--t-accent)]">
            {partner1[0]} &amp; {partner2[0]}
          </span>
        </div>
        <div className="font-serif text-xl font-semibold leading-tight text-[var(--t-text)]">
          {partner1} &amp; {partner2}
        </div>
        <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[var(--t-muted)]">
          Alta Costura
        </p>
      </div>
    </div>
  );
}