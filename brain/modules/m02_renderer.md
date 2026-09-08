# Módulo m02 — Renderer

> `WeddingRenderer` + componentes de sección. Núcleo técnico del producto.
> Ver `brain/modules/_index.md` para el resumen global.

---

## Objetivo

Construir el componente central `WeddingRenderer` que convierte los datos de una
boda (wedding + template + theme + sections) en una página visual, y todos los
componentes de sección reutilizables.

---

## Alcance

- `components/wedding/WeddingRenderer.tsx`
- `components/wedding/Motifs.tsx` (ambientación: SVG por plantilla + divisores + Watermark)
- Secciones: Hero, Couple, Story, Gallery, Countdown, Event, Location, Drive, Dresscode, Footer.
- Capa de ambientación interactiva: `BackgroundImage`, `Reveal`, `Sparkles`,
  `MusicPlayer`, `CustomCursor`, `TrailSparkles`, `DresscodeSection`.
- Se usa en Demo, Builder, Preview y Página pública (renderer único).

---

## Reglas

- **ADR-002:** un solo renderer (no `BuilderRenderer` + `PublicRenderer`).
- El renderer recibe datos; no consulta BD directamente (plan.md §113).
- El Builder controla estado/edición; el Renderer controla representación visual (plan.md §91).

---

## Progreso

| # | Feature | Estado |
|---|---------|--------|
| 1 | Componente `WeddingRenderer` | ✅ |
| 2 | Sección Hero | ✅ |
| 3 | Sección Couple | ✅ |
| 4 | Sección Story | ✅ |
| 5 | Sección Gallery | ✅ |
| 6 | Sección Countdown | ✅ |
| 7 | Sección Event | ✅ |
| 8 | Sección Location | ✅ |
| 9 | Sección Drive | ✅ |
| 10 | Sección Footer | ✅ |
| 11 | Ambientación por plantilla (`Motifs.tsx` + `templateId`) | ✅ |
| 12 | Fondos fiables con Ken Burns (`BackgroundImage`) | ✅ |
| 13 | Animaciones por scroll (`Reveal`) + destellos de carga (`Sparkles`) | ✅ |
| 14 | Música ambiental (`MusicPlayer`) | ✅ |
| 15 | Sección Dresscode | ✅ |
| 16 | Galería interactiva (lightbox + zoom + masonry) | ✅ |
| 17 | Firma animada por plantilla (cursor/trail) + tipografía editorial + watermark | ✅ |

> Feature documentada: `brain/features/renderer.md` y
> `brain/features/ambientacion-interactiva.md`.
> **v2.1:** `Motifs.tsx` (SVG por ambientación, fondo ambiental, `SectionDivider`)
> y `SectionComponentProps.templateId` (slug) inyectado por el renderer a cada
> sección; variantes de sección implementadas con layouts reales.
> **v2.2 (ambientación interactiva):** Ken Burns, reveal por scroll, hero
> escalonado, sparkles/glint, música ambiental, dresscode, galería lightbox,
> countdown flip, pull-quote/drop-cap, SectionDivider agrandado, watermark en
> footer, y firma por plantilla (cursor urbana, trail elegance). Todo
> SSR-safe y respetando `prefers-reduced-motion`.

---

## Relaciones

- Depende de: m01, m03 (templates/themes).
- Usado por: m04 (Builder), m05 (demos), m06 (preview), m07 (página pública).
- Contexto: `brain/context/06_web_builder_y_renderer.md`.

---

## Decisiones

- **ADR-001:** editor por secciones.
- **ADR-002:** renderer único.
- **ADR-006:** mobile-first.
- **v2.1:** ambientación = identidad de plantilla (no del tema); los motivos se
  resuelven por `templateId` (slug) en `Motifs.tsx` y llegan a las secciones
  vía `SectionComponentProps.templateId`.
