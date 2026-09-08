# Feature: Catálogo y Plantillas (m05)

> Catálogo navegable de plantillas con demos completas que generan deseo.
> **v2:** las plantillas de la 1ª generación se fusionaron como paletas de color
> de `elegance`; la diferenciación ahora es por ESTRUCTURA (secciones/variantes)
> y el color se repinta con swatches desde la propia tarjeta.
> **v2.1:** además de estructura y color, cada plantilla tiene **ambientación
> visual propia** (motivos decorativos reales, no solo paleta).

---

## Metadata

- **Feature ID:** `F-005`
- **Módulo(s):** `m05_plantillas`
- **Estado:** ✅
- **Fecha de creación:** 2026-09-01
- **Última actualización:** 2026-09-01

---

## Objetivo

Ofrecer un catálogo en `/plantillas` con tarjetas (preview, nombre, categoría,
descripción, "Ver demo" y "Usar plantilla") y una demo por plantilla en
`/plantillas/<slug>` que parezca una boda real para generar deseo (plan.md §9–11).
Construir las 5 primeras plantillas excelentes, no 20 mediocres (plan.md §131).

## Filosofía / Enfoque

- Cada plantilla es **una definición JSON** (`src/templates/<slug>.json`)
  registrada en `lib/templates/definitions` (plan.md §112): el Builder y el
  Renderer no se reescriben al agregar plantillas.
- **v2 — estructura ≠ color:** cada plantilla define su ESTRUCTURA (secciones +
  variantes + orden) y un tema por defecto; el color es un **tema ortogonal**
  seleccionable con swatches en la tarjeta (`suggestedThemeIds`). Las plantillas
  de la 1ª generación (romantic/minimal/garden/luxury) pasaron a ser paletas de
  `elegance` (`LEGACY_TEMPLATE_MAP` mantiene resolviendo bodas ya creadas).
- **v2.1 — ambientación real ≠ tema:** cada plantilla tiene su **identidad
  visual** además del color. `components/wedding/Motifs.tsx` provee motivos SVG
  inline por ambientación (garden = guirnaldas de ramas, boho = arcos + mandalas,
  urbana = formas geométricas, clasica = laureles, costa = olas, elegance =
  líneas finas) y `WeddingRenderer` inyecta fondo ambiental + `SectionDivider`
  entre secciones según el `templateId` (slug). Las secciones reciben
  `templateId` (`SectionComponentProps`) y renderizan **variantes con layouts
  realmente distintos** (no solo color).
- Las demos reutilizan **el mismo `WeddingRenderer`** (ADR-002) con datos
  ficticios + tema por defecto de la plantilla: lo que ves en la demo es
  exactamente lo que producirá el Builder.
- El catálogo lee del **engine** (`getAllTemplateConfigs`), fuente única de
  verdad, en lugar de la tabla `templates` (que se siembra de forma asíncrona).
- `previewUrl` no es obligatorio: el preview de tarjeta se genera con los
  **tokens del tema** (monograma serif + colores del tema), siempre disponible
  y sin dependencias externas.

## Flujo

```
Catálogo /plantillas (force-dynamic, engine) → <Catalog> (client: filtro por categoría)
   └─ <TemplateCard> (client, state tema seleccionado)
        ├─ TemplatePreview(template, themeId seleccionado)   ← se repinta al tocar swatch
        ├─ swatches de color: themes filtrados por template.suggestedThemeIds ?? todos
        │     (dot = token t-accent/t-cta-bg del tema)
        ├─ "Ver demo"      → /plantillas/<slug>
        └─ "Usar plantilla" → useTemplateAction(slug, themeId): requireUser → resolveTemplate
                              → valida getTheme(themeId) → crea boda (templateId+version+themeJson)
                              → /dashboard/bodas/<id>
   Demo /plantillas/<slug> (SSG, generateStaticParams, dynamicParams=false)
         demo = getTemplateDemo(slug)   (nombres, fecha, venue, galería ficticias)
         template = getTemplateConfig(slug)
         theme = resolveTheme(template.themeId)   ← tema por defecto de la plantilla
         sections = template.sections → EffectiveSection[] con data del demo
         → <WeddingRenderer> (+ barra "← Volver al catálogo")
```

## Integración con el sistema principal

- **Engine (m03):** `getAllTemplateConfigs`, `getTemplateConfig`,
  `resolveTemplate`, `resolveTheme`; `syncTemplatesToDb` sigue sembrando las 5
  plantillas a la tabla `templates` (UPSERT por slug en `seedBaseData()`).
- **Renderer (m02):** `WeddingRenderer` + `EffectiveSection` montan las demos;
  los datos viven en `src/lib/templates/demos.ts` (pure, sin server-only).
  `WeddingRenderer` pasa `templateId` (slug) a cada sección, aplica el fondo
  ambiental y separa secciones con `SectionDivider` (ambos de `Motifs.tsx`).
- **Builder (m04):** "Usar plantilla" crea la boda con
  `templateId`/`templateVersion`/`themeJson {id}` y redirige al Builder
  (`/dashboard/bodas/<id>`), que recibe la plantilla elegida.
- **Datos:** `weddings` (template + theme) y `templates` (seeder) como en m03;
  ninguna tabla nueva.
- **Recursos:** demos usan fotografías de `picsum.photos` (registrado en
  `LICENSES.md` desde m03) y Google Maps/Drive de ejemplo (mismo validador
  `lib/maps`).

## Datos

- Definiciones: `src/templates/{elegance,boho,urbana,clasica,costa}.json`
  (`id`, `slug`, `name`, `description`, `category`, `version: 1`, `themeId`,
  `suggestedThemeIds` opcional, `sections` con variantes válidas según
  `SECTION_VARIANTS`).
- `TemplateConfig.suggestedThemeIds` (v2): paletas que muestra la tarjeta;
  si se omite se ofrecen las 6 del sistema. Validado por `validateTemplateConfig`.
- Demo data: `src/lib/templates/demos.ts` (`TemplateDemo`);
  `getTemplateDemo(slug)` / `getAllTemplateDemos()` (re-mapeada a los 5 slugs
  vigentes; el contenido de la 1ª generación se reutilizó por afinidad).
- Tabla `templates` poblada por seed (que el catálogo no requiere).

## Reglas

- Las 9 secciones (Hero…Footer) presentes en cada plantilla (contexto 05),
  con combinaciones de variantes/orden **distintas** entre plantillas (originalidad).
- **v2.1:** las variantes definidas en `SECTION_VARIANTS` **se implementan de
  verdad** en los componentes de sección (layouts distintos, no recolor):
  Hero classic/fullscreen/split/minimal; Couple classic/editorial/portrait;
  Story classic/timeline/editorial/minimal; Gallery grid/masonry/carousel/editorial;
  Countdown classic/minimal/full; Event classic/timeline/compact; Location
  classic/split/centered; Drive classic/button/card; Footer classic/minimal/centered.
- Los motivos (`Motifs.tsx`) usan `currentColor` / CSS vars (`--t-accent*`):
  se adaptan al tema elegido sin re-escritura.
- Las variantes de cada plantilla deben pasar `validateTemplateConfig`
  (`assertValidTemplates` al cargar el engine; si no, falla el build).
- Tema restringido: `themeId` y los `suggestedThemeIds` apuntan a los temas del
  sistema (sin CSS/HTML libre).
- `LEGACY_TEMPLATE_MAP` (romantic/minimal/garden/luxury → elegance) mantiene
  resolviendo bodas de la 1ª generación (sus secciones ya viven en la BD).
- Demo con datos ficticios plausibles (nombres, fecha futura, venue, galería).
- "Usar plantilla" es una server action: valida sesión, existencia de la
  plantilla y que el `themeId` sea un tema conocido (fallback al default);
  bodas sin sesión → `/login`.

## UX / Responsive

- Tarjeta v2: preview temático repintable + swatches de color + nombre + badge
  de categoría + acción doble (demo / usar) — mobile-friendly (grid 1→2→3).
- Catálogo con **filtro por categoría** (chips "Todas" + categorías únicas).
- Demo: barra sticky con "← Volver al catálogo" + nombre de plantilla; el resto
  es el renderer responsive habitual (mobile-first, ADR-006).

## Tests / Validación

- `npm run typecheck`, `npm run lint`, `npm run build`: limpios ✅
  (13 páginas; 5 demos SSG con `generateStaticParams`).
- `assertValidTemplates()` valida las 5 definiciones (incl. `suggestedThemeIds`)
  al importar el engine.
- Pendiente (runtime): smoke HTTP de `/plantillas` (+ swatches y filtros) y
  flujo "Usar plantilla" → Builder (dev server).

## Relaciones

- Depende de m02 (renderer), m03 (engine).
- Usado por m04 ("Usar plantilla" entra al Builder con tema), m06 (preview), m07
  (publicación usa template+versión), landing (/ usa TemplatePreview del engine).
- Contexto: `brain/context/05_sistema_plantillas.md`,
  `brain/context/04_rutas_y_estructura.md`.
- Skills: `feature-doc`, `module-progress`.

## Decisiones

- **v2:** fusionar la 1ª generación (romantic, minimal, garden, luxury) como
  paletas de `elegance` y diferenciar por estructura; 5 plantillas vigentes:
  Elegance (Elegante), Boho (Natural), Urbana (Moderna), Clásica (Solemne),
  Costa (Aire libre).
- Swatch en tarjetas: seleccionar repinta el preview y "Usar plantilla" crea la
  boda con ese tema (color elegido desde el catálogo, no solo en el Builder).
- Preview generado con **tokens del tema** en vez de screenshots/imágenes.
- Demos **SSG** (`generateStaticParams` + `dynamicParams = false`), tema por
  defecto de cada plantilla; los datos ficticios viven en `lib/templates/demos.ts`.

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | Catálogo `/plantillas` desde el engine (TemplatePreview con tokens, "Ver demo"/"Usar plantilla"), demo `/plantillas/[slug]` SSG con datos ficticios (`lib/templates/demos.ts`), plantillas romantic/minimal/garden/luxury.json + registradas en definitions, action `useTemplateAction`; typecheck + lint + build limpios | ✅ |
| 2026-09-01 | **v2:** fusión de las 4 plantillas en paletas de `elegance` + 4 nuevas con estructura original (boho, urbana, clasica, costa). `TemplateConfig.suggestedThemeIds` + validación; `LEGACY_TEMPLATE_MAP` (retro-compat). Tarjeta cliente `TemplateCard` con swatches de color que repintan el preview y pasan `themeId` a `useTemplateAction`. Filtro por categoría en `Catalog`. Demos re-mapeadas. Landing rediseñada usando `TemplatePreview` del engine. typecheck + lint + build limpios (13 páginas, 5 demos) | ✅ |
| 2026-09-01 | **v2.1 (ambientación real):** `components/wedding/Motifs.tsx` con SVG decorativos por ambientación (guirnaldas, arcos+mandala, geométrico, laurel, olas, líneas finas) + fondo ambiental + `SectionDivider` en `WeddingRenderer`. `SectionComponentProps.templateId` (slug) inyectado a todas las secciones. Implementación real de las variantes de `SECTION_VARIANTS` con layouts distintos en Hero, Couple, Story, Gallery, Countdown, Event, Location, Drive, Footer (antes eran recolor). `visuals.tsx` eliminado (redundante). typecheck + lint + build limpios; motivos verificados en el SSR de las 5 demos | ✅ |