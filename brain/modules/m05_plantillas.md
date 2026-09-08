# Módulo m05 — Plantillas

> Catálogo, demos y las plantillas vigentes, diferenciadas por estructura y
> recolorizadas por tema desde la tarjeta. **v2.**
> **v2.1:** cada plantilla tiene ambientación visual propia (motivos reales).
> Ver `brain/modules/_index.md` para el resumen global.

---

## Objetivo

Ofrecer un catálogo navegable de plantillas con demos completas que generen deseo,
y construir plantillas excelentes (no muchas mediocres).

---

## Alcance

- Catálogo `/plantillas` (tarjetas con preview repintable por tema, nombre,
  categoría, Ver demo / Usar plantilla) + filtro por categoría.
- Demo `/plantillas/[slug]` con datos ficticios (usa `WeddingRenderer`).
- 5 plantillas vigentes con **estructura propia**: Elegance, Boho, Urbana,
  Clásica, Costa.
- Categorías: Elegante, Boho · Natural, Urbana · Moderna, Clásica · Solemne,
  Costa · Aire libre.

---

## Reglas

- Cada plantilla usa el Template Engine (secciones + variantes + tema).
- **v2:** la plantilla define estructura; el color es un tema ortogonal
  (`themeId` + `suggestedThemeIds`) seleccionable con swatches en la tarjeta.
- Las plantillas de la 1ª generación (romantic/minimal/garden/luxury) se
  fusionaron como paletas de `elegance`; `LEGACY_TEMPLATE_MAP` mantiene
  resolviendo bodas ya creadas.
- Cada plantilla: demo, mobile, desktop, variantes, tema y sus secciones.
- Respetar licencias (originales o recursos con licencia compatible).
- Lanzar 5 plantillas excelentes, no 20 mediocres.

---

## Progreso

| # | Feature | Estado |
|---|---------|--------|
| 1 | Catálogo `/plantillas` (con swatches + filtros) | ✅ |
| 2 | Demo `/plantillas/[slug]` | ✅ |
| 3 | Plantilla 01 Elegance (base, recolorizable) | ✅ |
| 4 | Plantilla 02 Boho | ✅ |
| 5 | Plantilla 03 Urbana | ✅ |
| 6 | Plantilla 04 Clásica | ✅ |
| 7 | Plantilla 05 Costa | ✅ |
| 8 | Ambientación visual real (motivos + variantes implementadas) | ✅ |
| 9 | Firma por plantilla (musicUrl, countdown flip, dresscode, cursor/trail) | ✅ |

> Feature documentada: `brain/features/catalogo-plantillas.md` y
> `brain/features/admin-panel.md` (CRUD admin de plantillas).
> Plantillas registradas en `lib/templates/definitions`; demos usan
> `lib/templates/demos.ts` (ficticias, SSG).
> **v2.1:** `Motifs.tsx` (SVG por ambientación) + `SectionComponentProps.templateId`;
> las variantes de `SECTION_VARIANTS` son layouts distintos de verdad.
> **v2.2 (firma por plantilla):** `musicUrl` (Clair de Lune default) + sección
> dresscode en los 5 JSON; countdown variante `flip` (costa); cursor custom
> (urbana) y rastro de chispas (elegance); SectionDivider agrandado y watermark
> según ambientación.
> **v2.3 (SEO):** las demos `/plantillas/[slug]` son SSG indexables con metadata
> propia + `BreadcrumbList`; `/plantillas` con metadata y breadcrumb; sitemap
> incluye las 5 demos (ver `brain/features/seo.md`).

---

## Relaciones

- Depende de: m02, m03.
- Usado por: m04 (Builder usa la plantilla elegida con tema), m06, m07, landing.
- Contexto: `brain/context/05_sistema_plantillas.md`, `brain/context/04_rutas_y_estructura.md`.

---

## Decisiones

- **v2:** fusionar la 1ª generación como paletas de `elegance`; diferenciar por
  estructura; 5 plantillas vigentes.
- **v2.1:** identidad visual por ambientación (`Motifs.tsx`) + implementar las
  variantes de `SECTION_VARIANTS` con layouts reales en cada sección.
- Swatches de color en tarjetas: repintan el preview y "Usar plantilla" crea la
  boda con ese tema.
- Preview de tarjeta generado con tokens del tema (sin screenshots ni plugins).
- Demos SSG con `generateStaticParams` + `dynamicParams=false`.

---

## Historial

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | Catálogo desde el engine (preview temático + Ver demo/Usar plantilla), demo `/plantillas/[slug]` SSG con datos ficticios, plantillas romantic/minimal/garden/luxury + registradas, `useTemplateAction`; typecheck + lint + build limpios | ✅ |
| 2026-09-01 | **v2:** fusión de 1ª generación como paletas + plantillas nuevas (boho, urbana, clasica, costa) con estructura original; `suggestedThemeIds`; `TemplateCard` con swatches; filtro por categoría en `Catalog`; `LEGACY_TEMPLATE_MAP`; demos re-mapeadas; landing rediseñada con previews del engine. typecheck + lint + build limpios (13 páginas, 5 demos) | ✅ |
| 2026-09-01 | **v2.1 (ambientación real):** `Motifs.tsx` con SVG decorativos por ambientación + fondo ambiental + `SectionDivider` en `WeddingRenderer`; `SectionComponentProps.templateId`; variantes implementadas con layouts distintos en las 9 secciones (Hero fullscreen/classic/split/minimal, Couple classic/editorial/portrait, Story classic/timeline/editorial/minimal, Gallery grid/masonry/carousel/editorial, Countdown classic/minimal/full, Event classic/timeline/compact, Location classic/split/centered, Drive classic/button/card, Footer classic/minimal/centered). `visuals.tsx` eliminado. Verificado: lint + typecheck + build limpios y motivos en SSR de las 5 demos | ✅ |
| 2026-09-06 | Admin: `templatesRepo.findAll/delete` + CRUD de plantillas en `/admin/plantillas` (lista, nueva, detalle, activar/desactivar, eliminar, `TemplateForm`) | ✅ |