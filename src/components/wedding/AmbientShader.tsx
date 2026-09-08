/**
 * AmbientShader — capa de luz y movimiento por plantilla (m05 v2.2).
 *
 * Añade la "vida" que los motivos estáticos (`Motifs.tsx`) no dan: brillos,
 * partículas y barridos de luz muy sutiles, pensados para sentirse como
 * un shader (glow, bloom, movimiento lento) sin usar WebGL — solo CSS
 * (blur + animación + blend modes), 100% SSR-safe y liviano.
 *
 * Reglas de diseño:
 *  - Nunca compite con el texto: opacidades bajas, blur alto, blend "screen"
 *    en fondos oscuros / "soft-light" en fondos claros.
 *  - Usa `var(--t-accent)` / `var(--t-accent-soft)` → se adapta a cualquier
 *    tema sin tocar esta capa.
 *  - `prefers-reduced-motion` desactiva toda animación (ver globals.css).
 *  - Se coloca SIEMPRE entre la imagen de fondo y el contenido
 *    (z-index intermedio), como una capa `aria-hidden`.
 */

import { ambientOf, type TemplateAmbient } from "./Motifs";

interface AmbientShaderProps {
  templateId?: string;
  /** Si el fondo detrás es una foto oscura (aumenta el blend a "screen"). */
  onImage?: boolean;
  className?: string;
}

/** Bokeh dorado + barrido de luz diagonal (elegance / clasica). */
function EleganceGlow({ onImage }: { onImage?: boolean }) {
  const blend = onImage ? "mix-blend-screen" : "mix-blend-soft-light";
  return (
    <>
      <div
        className={`absolute -top-[10%] left-[8%] h-64 w-64 rounded-full bg-[var(--t-accent)] opacity-30 ${blend}`}
        style={{ animation: "ambient-pulse-glow 9s ease-in-out infinite" }}
      />
      <div
        className={`absolute bottom-[-8%] right-[10%] h-72 w-72 rounded-full bg-[var(--t-accent-soft)] opacity-25 ${blend}`}
        style={{ animation: "ambient-pulse-glow 11s ease-in-out infinite 2s" }}
      />
      <div
        className={`absolute inset-0 w-[60%] bg-gradient-to-r from-transparent via-[var(--t-accent-soft)] to-transparent opacity-40 ${blend}`}
        style={{ animation: "ambient-sweep 14s ease-in-out infinite", filter: "blur(30px)" }}
      />
    </>
  );
}

/** Partículas cálidas cayendo muy lento (boho / garden). */
function GardenParticles({ onImage }: { onImage?: boolean }) {
  const blend = onImage ? "mix-blend-screen" : "mix-blend-multiply";
  const dots = [
    { left: "12%", size: 6, delay: "0s", dur: "16s" },
    { left: "28%", size: 4, delay: "3s", dur: "20s" },
    { left: "47%", size: 8, delay: "6s", dur: "18s" },
    { left: "63%", size: 5, delay: "1.5s", dur: "22s" },
    { left: "81%", size: 6, delay: "8s", dur: "17s" },
    { left: "92%", size: 4, delay: "4.5s", dur: "19s" },
  ];
  return (
    <>
      <div
        className={`absolute -top-[6%] left-[15%] h-56 w-56 rounded-full bg-[var(--t-accent-soft)] opacity-30 ${blend}`}
        style={{ animation: "ambient-pulse-glow 10s ease-in-out infinite" }}
      />
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full bg-[var(--t-accent)] opacity-50"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            animation: `ambient-fall ${d.dur} linear infinite ${d.delay}, ambient-sway 3s ease-in-out infinite`,
          }}
        />
      ))}
    </>
  );
}

/** Línea de luz que recorre el frame + pulso geométrico (urbana). */
function UrbanaSweep({ onImage }: { onImage?: boolean }) {
  const blend = onImage ? "mix-blend-screen" : "mix-blend-soft-light";
  return (
    <>
      <div
        className={`absolute inset-y-0 left-0 w-[2px] bg-[var(--t-accent)] opacity-0 ${blend}`}
        style={{ animation: "ambient-sweep 12s linear infinite", filter: "blur(1px)" }}
      />
      <div
        className={`absolute top-[-10%] right-[6%] h-80 w-80 rounded-full bg-[var(--t-accent)] opacity-20 ${blend}`}
        style={{ animation: "ambient-pulse-glow 8s ease-in-out infinite" }}
      />
    </>
  );
}

/** Reflejo de luz sobre el agua, avanzando muy lento (costa). */
function CostaShimmer({ onImage }: { onImage?: boolean }) {
  const blend = onImage ? "mix-blend-screen" : "mix-blend-soft-light";
  return (
    <>
      <div
        className={`absolute bottom-[8%] left-0 h-24 w-[140%] -translate-x-[10%] bg-gradient-to-r from-transparent via-[var(--t-accent-soft)] to-transparent opacity-45 ${blend}`}
        style={{ animation: "ambient-shimmer 5s ease-in-out infinite", filter: "blur(18px)" }}
      />
      <div
        className={`absolute top-[6%] right-[12%] h-52 w-52 rounded-full bg-[var(--t-accent-soft)] opacity-25 ${blend}`}
        style={{ animation: "ambient-pulse-glow 9s ease-in-out infinite 1.5s" }}
      />
    </>
  );
}

const RENDERERS: Record<TemplateAmbient, (p: { onImage?: boolean }) => React.JSX.Element> = {
  elegance: EleganceGlow,
  clasica: EleganceGlow,
  garden: GardenParticles,
  boho: GardenParticles,
  urbana: UrbanaSweep,
  costa: CostaShimmer,
};

/**
 * Capa de luz ambiental. Colocar dentro de un contenedor `relative
 * overflow-hidden`, típicamente justo después del fondo (imagen/gradiente)
 * y antes del contenido.
 */
export function AmbientShader({ templateId, onImage, className }: AmbientShaderProps) {
  const ambient = ambientOf(templateId);
  const Renderer = RENDERERS[ambient];
  return (
    <div
      aria-hidden
      data-ambient-shader
      className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className ?? ""}`}
    >
      <Renderer onImage={onImage} />
    </div>
  );
}
