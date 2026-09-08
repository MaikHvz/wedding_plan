import type { SectionComponentProps } from "./WeddingRenderer";
import type { SectionDataMap } from "@/types";

/**
 * DresscodeSection — código de vestimenta para los invitados (m09).
 *
 * Muestra el código (ej. "Formal", "Elegante sport"), una descripción y una
 * paleta de colores sugeridos como muestras. Los colores pueden venir como
 * array (`string[]`) o como string separado por comas (persistido por el
 * builder en un campo de texto).
 */

function parseColors(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter((c) => typeof c === "string" && /^#?[0-9a-fA-F]{3,8}$/.test(c.trim()));
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[,;]/)
      .map((c) => c.trim())
      .filter((c) => /^#?[0-9a-fA-F]{3,8}$/.test(c));
  }
  return [];
}

const DEFAULT_COLORS = ["#b98a5e", "#f5f0e8", "#3d3a36"];

function ColorSwatchRow({ colors }: { colors: string[] }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
      {colors.map((color, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <span
            className="h-12 w-12 rounded-full border border-[var(--t-border)] shadow-sm"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <span className="text-[11px] uppercase tracking-widest text-[var(--t-muted)]">
            {color.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DresscodeSection({ data, variant }: SectionComponentProps) {
  const dresscode = data as SectionDataMap["dresscode"];
  const title = dresscode.title || "Código de vestimenta";
  const code = dresscode.code || "Elegante sport";
  const description = dresscode.description;
  const colors = parseColors(dresscode.colors);
  const palette = colors.length > 0 ? colors : DEFAULT_COLORS;
  const v = variant ?? "classic";

  if (v === "card") {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-md rounded-[var(--t-radius)] bg-[var(--t-surface)] px-8 py-12 text-center shadow-sm">
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-[var(--t-accent)]">Vestimenta</p>
          <h2 className="font-serif text-3xl font-semibold">{title}</h2>
          <p className="mt-4 font-serif text-lg italic text-[var(--t-accent)]">{code}</p>
          {description && (
            <p className="mt-4 text-pretty text-sm leading-relaxed text-[var(--t-muted)]">
              {description}
            </p>
          )}
          <ColorSwatchRow colors={palette} />
        </div>
      </section>
    );
  }

  if (v === "swatch") {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto w-full max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">
            Dress code
          </p>
          <h2 className="font-serif text-3xl font-semibold">{title}</h2>
          <span className="mt-6 inline-flex items-center rounded-full border border-[var(--t-accent)]/40 bg-[var(--t-accent-soft)]/50 px-6 py-2 text-sm uppercase tracking-[0.25em] text-[var(--t-text)]">
            {code}
          </span>
          {description && (
            <p className="mt-6 text-pretty leading-relaxed text-[var(--t-muted)]">{description}</p>
          )}
          <ColorSwatchRow colors={palette} />
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20">
      <div className="mx-auto w-full max-w-xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">
          Dress code
        </p>
        <h2 className="font-serif text-3xl font-semibold">{title}</h2>
        <p className="mt-5 font-serif text-xl italic text-[var(--t-accent)]">{code}</p>
        {description && (
          <p className="mt-4 text-pretty leading-relaxed text-[var(--t-muted)]">{description}</p>
        )}
        <ColorSwatchRow colors={palette} />
      </div>
    </section>
  );
}
