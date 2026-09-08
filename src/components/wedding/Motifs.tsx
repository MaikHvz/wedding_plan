/**
 * Motivos decorativos por plantilla (m05 v2.1 — ambientación propia).
 *
 * Cada plantilla tiene una identidad visual además del color. Estos motivos
 * (SVG inline) se usan en hero, divisores y secciones para que cada
 * ambientación se distinga de verdad (no solo por el tema):
 *
 *  - elegance → monograma fino + líneas.
 *  - garden   → bordes con ramas y hojas (guirnalda verde).
 *  - boho     → arco + mandala / flecos.
 *  - urbana   → líneas y formas geométricas (bloque moderno).
 *  - clasica  → guirnalda de laurel / óvalo clásico.
 *  - costa    → olas y horizonte.
 *
 * Funcionan con `currentColor` / CSS vars (var(--t-accent), var(--t-accent-soft))
 * para adaptarse a cualquier tema sin re-escritura.
 */

export type TemplateAmbient = "elegance" | "garden" | "boho" | "urbana" | "clasica" | "costa";

const AMBIENTS = ["elegance", "garden", "boho", "urbana", "clasica", "costa"] as const;

export function ambientOf(templateId?: string): TemplateAmbient {
  const value = (templateId ?? "").toLowerCase();
  return (AMBIENTS as readonly string[]).includes(value)
    ? (value as TemplateAmbient)
    : "elegance";
}

/** Sombra/patrón de fondo por ambientación (subtle, no invasivo). */
export function ambientBackgroundClass(ambient: TemplateAmbient): string {
  switch (ambient) {
    case "garden":
      return "bg-[radial-gradient(circle_at_1px_1px,var(--t-accent-soft)_1px,transparent_0)] [background-size:22px_22px]";
    case "boho":
      return "bg-[radial-gradient(circle_at_25%_0%,var(--t-accent-soft)_0,transparent_45%)]";
    case "urbana":
      return "bg-[linear-gradient(115deg,transparent_40%,var(--t-accent-soft)_40%,var(--t-accent-soft)_42%,transparent_42%)]";
    case "clasica":
      return "bg-[radial-gradient(ellipse_at_top,var(--t-accent-soft)_0,transparent_50%)]";
    case "costa":
      return "bg-[linear-gradient(0deg,var(--t-accent-soft)_0,transparent_60%)]";
    case "elegance":
    default:
      return "bg-[linear-gradient(90deg,transparent_0,var(--t-accent-soft)_50%,transparent_100%)]";
  }
}

/* ───────────────────────── Motivos SVG (wrappers) ───────────────────────── */

/** Guirnalda inferior: rama con hojas (garden). */
export function GardenGarland({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none ${className ?? ""}`}>
      <svg
        viewBox="0 0 220 28"
        preserveAspectRatio="xMidYMax meet"
        className="mx-auto h-7 w-44 text-[var(--t-accent)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <path d="M6 24 C 16 8, 40 8, 56 16 C 74 26, 96 26, 110 12" />
        <path d="M110 12 C 124 26, 146 26, 164 16 C 180 8, 204 8, 214 24" />
        <path d="M56 16 c6 -10, 14 -10, 16 -2 M110 12 c-2 -9, 5 -13, 8 -6 M164 16 c2 -10, 10 -10, 16 -2" />
        <circle cx="32" cy="14" r="2.4" fill="var(--t-accent)" stroke="none" />
        <circle cx="80" cy="22" r="2.4" fill="var(--t-accent)" stroke="none" />
        <circle cx="140" cy="22" r="2.4" fill="var(--t-accent)" stroke="none" />
        <circle cx="188" cy="14" r="2.4" fill="var(--t-accent)" stroke="none" />
      </svg>
    </div>
  );
}

/** Arco con mandala (boho) — SVG delicado. */
export function BohoArch({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none ${className ?? ""}`}>
      <svg
        viewBox="0 0 120 90"
        className="mx-auto h-24 w-32 text-[var(--t-accent)] opacity-80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      >
        <path d="M10 90 v-30 a50 50 0 0 1 100 0 v30" />
        <path d="M22 90 v-30 a38 38 0 0 1 76 0 v30" />
        <circle cx="60" cy="40" r="16" strokeDasharray="2 3" />
        <circle cx="60" cy="40" r="7" />
        <path d="M60 20 v10 M48 40 h10 M52 30 l10 10 M68 30 l-10 10" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Motivo geométrico moderno (urbana). */
export function UrbanaShape({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none ${className ?? ""}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9 text-[var(--t-accent)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <rect x="8" y="8" width="24" height="24" />
        <path d="M8 20 h10 M30 20 h-6 M20 8 v12" />
      </svg>
    </div>
  );
}

/** Guirnalda de laurel (clásica). */
export function LaurelWreath({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none ${className ?? ""}`}>
      <svg
        viewBox="0 0 120 40"
        className="mx-auto h-10 w-32 text-[var(--t-accent)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M60 6 c-10 2 -20 8 -26 16 c-5 7 -10 9 -20 9 c8 2 16 2 22 -2 c-4 8 -8 14 -12 18" />
        <path d="M60 6 c10 2 20 8 26 16 c5 7 10 9 20 9 c-8 2 -16 2 -22 -2 c4 8 8 14 12 18" />
        <ellipse cx="60" cy="14" rx="7" ry="9" />
      </svg>
    </div>
  );
}

/** Olas (costa). */
export function Wave({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none ${className ?? ""}`}>
      <svg
        viewBox="0 0 200 24"
        preserveAspectRatio="xMidYMax meet"
        className="mx-auto h-7 w-56 text-[var(--t-accent)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <path d="M0 14 q10 -8 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
        <path d="M0 20 q10 -8 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" opacity="0.5" />
      </svg>
    </div>
  );
}

/** Monograma/motivo fino (elegancia). */
export function EleganceLine({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none ${className ?? ""}`}>
      <svg
        viewBox="0 0 80 10"
        className="mx-auto h-3 w-24 text-[var(--t-accent)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0 5 h28 M52 5 h28" />
        <circle cx="40" cy="5" r="2" />
      </svg>
    </div>
  );
}

/** Decoración superior de sección según ambientación (usar como separador).
 *  Se repite entre TODAS las secciones del renderer (firma visual de la
 *  página) y se muestra más grande que en el hero para que se note. */
export function SectionDivider({ templateId }: { templateId?: string }) {
  const ambient = ambientOf(templateId);
  const wrap = "flex justify-center py-4 opacity-80";
  switch (ambient) {
    case "garden":
      return <div className={wrap}><GardenGarland className="scale-[1.6]" /></div>;
    case "boho":
      return <div className={wrap}><BohoArch className="scale-[1.5]" /></div>;
    case "urbana":
      return <div className={wrap}><UrbanaShape className="scale-[1.8]" /></div>;
    case "clasica":
      return <div className={wrap}><EleganceLine className="scale-[1.8]" /></div>;
    case "costa":
      return <div className={wrap}><Wave className="scale-[1.6]" /></div>;
    case "elegance":
    default:
      return <div className={wrap}><EleganceLine className="scale-[1.8]" /></div>;
  }
}

/** Marca de agua grande y sutil según ambientación (cierre visual en footer). */
export function Watermark({ templateId, className }: { templateId?: string; className?: string }) {
  const ambient = ambientOf(templateId);
  const common = `pointer-events-none select-none text-[var(--t-accent)] ${className ?? ""}`;
  switch (ambient) {
    case "garden":
      return (
        <div aria-hidden className={`${common} absolute inset-0 flex items-center justify-center`}>
          <GardenGarland className="scale-[3.2] opacity-[0.08]" />
        </div>
      );
    case "boho":
      return (
        <div aria-hidden className={`${common} absolute inset-0 flex items-center justify-center`}>
          <BohoArch className="scale-[2.6] opacity-[0.08]" />
        </div>
      );
    case "urbana":
      return (
        <div aria-hidden className={`${common} absolute inset-0 flex items-center justify-center`}>
          <UrbanaShape className="scale-[3] opacity-[0.07]" />
        </div>
      );
    case "clasica":
      return (
        <div aria-hidden className={`${common} absolute inset-0 flex items-center justify-center`}>
          <LaurelWreath className="scale-[2.8] opacity-[0.08]" />
        </div>
      );
    case "costa":
      return (
        <div aria-hidden className={`${common} absolute inset-0 flex items-center justify-center`}>
          <Wave className="scale-[3] opacity-[0.08]" />
        </div>
      );
    case "elegance":
    default:
      return (
        <div aria-hidden className={`${common} absolute inset-0 flex items-center justify-center`}>
          <EleganceLine className="scale-[3] opacity-[0.08]" />
        </div>
      );
  }
}
