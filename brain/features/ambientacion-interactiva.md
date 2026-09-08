# Feature: Ambientación interactiva (m02)

> Mejora de la experiencia visual de la web de boda: fondos fiables con Ken
> Burns, animaciones por scroll, destellos de carga, música ambiental, galería
> interactiva, dresscode y "firma" animada por plantilla.

---

## Metadata

- **Feature ID:** `F-009`
- **Módulo(s):** `m02_renderer`, `m05_plantillas`
- **Estado:** ✅
- **Fecha de creación:** 2026-09-01
- **Última actualización:** 2026-09-01

---

## Objetivo

Elevar la ambientación de la web pública de boda a una experiencia rica y
"firma" de cada plantilla: fondos que respiran (Ken Burns), entrada escalonada
del hero, secciones que aparecen al hacer scroll, destellos/brillo de carga,
música ambiental opcional, galería con lightbox y zoom, sección de código de
vestimenta, tipografía editorial (pull-quote, drop-cap, countdown audaz) y
marca de agua ambiental — todo respetando `prefers-reduced-motion`.

## Filosofía / Enfoque

- **Un renderer, sin HTML persistido:** estas mejoras viven en los componentes
  del renderer y en CSS global; nunca en HTML guardado.
- **SSR-safe:** todos los efectos interactivos (IntersectionObserver, mousemove,
  autoplay, temporizador) son client components y se activan en evento, NO con
  `setState` síncrono en el cuerpo de un effect (regla `react-hooks/set-state-in-effect`).
- **Accesibilidad por defecto:** `prefers-reduced-motion` desactiva todas las
  animaciones (keyframes + reveal + trail + glint + ken-burns).
- **Capas explícitas:** fondo `z-0`, shader `z-[1]`, sparkles/glint `z-[2]`,
  contenido `z-10` — elimina el apilado frágil con z-negativos que ocultaba los
  fondos.

## Flujo

```
WeddingRenderer (server)
  ├─ themeStyles → CSS vars
  ├─ por sección: SectionDivider (más grande) + Reveal (scroll) + componente
  └─ alm de plantilla:
       urban   → CustomCursor (punto + anillo, cursor:none)
       elegance→ TrailSparkles (rastro de chispas)
     + MusicPlayer (flotante, autoplay con fallback)
```

## Integración con el sistema principal

- **Renderer:** `WeddingRenderer.tsx` monta `Reveal` (cada sección con delay
  escalonado), `SectionDivider` entre secciones, `MusicPlayer`, y el cursor /
  rastro según ambientación.
- **Componentes nuevos** (`components/wedding/`):
  - `BackgroundImage.tsx` (client) — fondo `z-0` con fade-in (`bg-reveal`),
    fallback `onError` a gradiente, `kenBurns`.
  - `Reveal.tsx` — IntersectionObserver, direcciones up/left/right/scale,
    `once`, rootMargin, delay.
  - `Sparkles.tsx` — `Sparkles` (chispitas) + `HeroGlint` (brillo de lente).
  - `MusicPlayer.tsx` — botón flotante, `Audio` loop, autoplay con catch,
    session storage.
  - `CustomCursor.tsx` (urbana) y `TrailSparkles.tsx` (elegance).
  - `DresscodeSection.tsx` — parsea colores (array o string separado por coma).
- **CSS global** (`globals.css`): `bg-reveal`, `ken-burns`, `hero-in`,
  `[data-reveal]`/`.is-revealed`, `countdown-flip`, `trail-fade`/`trail-spark`,
  `.lead-drop-cap`, cursor custom, `music-pulse`/`music-spin`, y el bloque
  `prefers-reduced-motion`.
- **Tipos/config:** `dresscode` en `SectionType`/`SectionDataMap` + `musicUrl`
  en `TemplateConfig`; `DEFAULT_WEDDING_MUSIC` y `SECTION_ORDER` con dresscode
  en `config/app.ts`.
- **Cadena dresscode completa:** `lib/builder/model.ts` (label+campos),
  `lib/templates/variants.ts` (`["classic","swatch","card"]`),
  demos (×5) y `/demo`, sección añadida a los 5 JSON.
- **Tipografía:** `StorySection` con `pull-quote` (editorial) y `lead-drop-cap`
  (classic); `CountdownSection` con dígitos audaces + variante `flip` (costa).
- **Motivos:** `SectionDivider` agrandado (scale) entre secciones y `Watermark`
  de fondo en el footer según ambientación.

## Datos

- `musicUrl?: string` por plantilla (5 JSON); si falta, se usa
  `DEFAULT_WEDDING_MUSIC` (Clair de Lune, archive.org).
- Colores del dresscode persistidos como texto hex separado por comas desde el
  builder; el componente acepta array o string.

## Reglas

- Etiquetar con `"use client"` todo componente con hooks de efecto/estado.
- No `setState()` síncrono directo en el cuerpo de effects (linter).
- Los efectos de puntero se activan solo con `(hover:hover) and (pointer:fine)`.
- Los motivos decorativos usan `aria-hidden`/`pointer-events-none`.
- Imágenes externas con `<img>` y `eslint-disable @next/next/no-img-element`.
- `prefers-reduced-motion` desactiva TODA animación.

## UX / Responsive

- Ken Burns real (zoom lento 22s, no zoom fijo) en hero fullscreen/split.
- Hero escalonado: monograma → subtítulo → nombre → fecha, con `heroIn(delay)`.
- Garía: hover zoom + overlay; lightbox con prev/next, teclado, contador y
  bloqueo de scroll; masonry/aspects variados.
- Música: sin autoplay forzado — botón de play si el navegador lo rechaza.

## Tests / Validación

- `npm run typecheck` ✅, `npm run lint` ✅.
- Dev server: `/demo`, `/plantillas/{elegance,urbana,costa,...}` devuelven 200.
- Fix de runtime: `BackgroundImage` requiere `"use client"` (usa `useState`).

## Relaciones

- Contexto: `brain/context/06_web_builder_y_renderer.md`.
- Features relacionadas: `renderer.md` (F-002), `catalogo-plantillas.md` (F-005).
- Skills: `feature-doc`, `module-progress`.

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | BackgroundImage (fondo fiable + Ken Burns), capas z explícitas, hero escalonado, Reveal por scroll, Sparkles/HeroGlint, MusicPlayer, DresscodeSection (cadena completa), galería con lightbox, countdown flip, pull-quote/drop-cap, SectionDivider grande, Watermark footer, CustomCursor (urbana) + TrailSparkles (elegance). Lint + typecheck limpios; páginas 200 | ✅ |
