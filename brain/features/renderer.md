# Feature: Renderer (m02)

> Renderer único que convierte los datos de una boda (wedding + template +
> theme + sections) en la página visual.

---

## Metadata

- **Feature ID:** `F-002`
- **Módulo(s):** `m02_renderer`
- **Estado:** ✅
- **Fecha de creación:** 2026-09-01
- **Última actualización:** 2026-09-01

---

## Objetivo

Construir el componente central `WeddingRenderer` y los 9 componentes de sección
reutilizables (Hero, Couple, Story, Gallery, Countdown, Event, Location, Drive,
Footer), de modo que **un solo renderer** sirva a Demo, Builder, Preview y Página
pública (ADR-002).

## Filosofía / Enfoque

- **ADR-002 (renderer único):** no existe `BuilderRenderer` + `PublicRenderer`;
  el mismo `WeddingRenderer` recibe `WeddingPageData` y renderiza.
- **El renderer recibe datos; no consulta BD** (plan.md §113): la preparación de
  datos la hace `lib/wedding/render-data.ts` (`getWeddingPageData`).
- Server Components por defecto; **Countdown es Client** (temporizador
  reactivo). Demo y Preview pueden montar secciones igual que la página pública.
- Los temas se aplican como **CSS variables** (`--t-*`) sobre tokens
  tipados (`ThemeTokens`); la sección Countdown usa `wedding.eventDate` y
  media desde `weddingMediaRepo` vía `publicUrl`.
- **v2.1 — ambientación por plantilla:** cada sección recibe `templateId`
  (slug de plantilla vía `SectionComponentProps`). El renderer aplica un fondo
  ambiental según la ambientación (`Motifs.tsx`) e inyecta un `SectionDivider`
  decorativo entre secciones (guirnalda, arco, ola, laural, línea según slug).

## Flujo

```
getWeddingPageData(wedding)
   ├─ templatesRepo.findBySlug → TemplateConfig (fallback DEFAULT_TEMPLATE)
   ├─ buildTheme(template.theme) → ThemeTokens (fallback DEFAULT_THEME)
   ├─ weddingSectionsRepo… → EffectiveSection[] (fallback SECTION_ORDER/classic)
   └─ weddingMediaRepo.findManyByWedding → mediaUrls[]
              │
              ▼
      WeddingRenderer (themeStyles → CSS vars) — demo en /demo
              │            w/[slug] (página pública)
              └─ secciones → datos tipados SectionDataMap
```

## Integración con el sistema principal

- **Nuevo:** `lib/wedding/render-data.ts` (`getWeddingPageData`, tipos
  `EffectiveSection`, `WeddingPageData`).
- **Nuevo:** `lib/data/repositories/media.ts` (`weddingMediaRepo`:
  create/findById/findManyByWedding/update/delete/deleteManyByWedding).
- **Renderer:** `components/wedding/WeddingRenderer.tsx` con
  `SECTION_COMPONENTS` (mapa tipo→componente vía `createElement`) y secciones
  en el mismo directorio; `themeStyles` vuelca los tokens como variables CSS.
- **Motivos:** `components/wedding/Motifs.tsx` — `ambientOf(templateId)`,
  `ambientBackgroundClass`, `SectionDivider` y los SVG por ambientación
  (`GardenGarland`, `BohoArch`, `UrbanaShape`, `LaurelWreath`, `Wave`,
  `EleganceLine`). `SectionComponentProps.templateId` llega a cada sección.
- **Tipos:** `SectionDataMap` (hero/couple/story/gallery/countdown/event/
  location/drive/footer), `Theme`, `ThemeTokens`, `TemplateConfig` (extiende
  `src/types/index.ts`).
- **Config:** `DEFAULT_THEME` (id `ivory`) y `DEFAULT_TEMPLATE` (id
  `elegance`, versión 1, secciones `SECTION_ORDER`) en `src/config/app.ts`.
- **Consumidores:** `/demo` (fixture Andrea & Sebastián) y `/w/[slug]`
  (página pública real, `dynamic="force-dynamic"`), ambos con enlaces desde la
  landing y `/plantillas`.
- Integrable luego con: m04 (Builder usa el mismo renderer), m05 (demos por
  plantilla), m06 (preview), m07 (publicación).

## Datos

- Tablas usadas: `weddings`, `wedding_sections` (fallback a `SECTION_ORDER`),
  `wedding_media` (imágenes → `mediaUrls`), `templates` (config + theme).
  Modelo completo en `brain/context/03_dominio_y_modelo_datos.md`.
- `SectionDataMap` tipa el contenido de cada sección; `TemplateConfig` define
  orden de secciones y variantes; `ThemeTokens` tipo `Record<string,string>`
  para CSS variables.

## Reglas

- Renderer único (ADR-002): Demo/Builder/Preview/página pública comparten
  `WeddingRenderer`.
- El renderer no consulta BD: toda la data llega por `getWeddingPageData`.
- Countdown: sección client (temporizador), difiere a `wedding.eventDate`.
- Location/Drive validan la URL con `lib/maps` (solo HTTPS de Google
  Maps/Drive) antes de renderizar.
- Imágenes: `mediaUrls` de `wedding_media` + `gallery.images`;
  `<img>` estándar con `eslint-disable` al tope del archivo (no `next/image`
  para URLs externas).
- Las variantes de `SECTION_VARIANTS` se implementan como layouts distintos por
  sección (m05 v2.1); si una variante es desconocida cae al layout por defecto.
- Los motivos decorativos no tienen contenido ni interacción: `aria-hidden`,
  `pointer-events-none`, `select-none`.

## UX / Responsive

- Mobile-first (ADR-006): hero `min-h-[85svh]`, textos `text-balance` y tamaños
  escalados (`sm:`); galería en grid que colapsa a 1 columna; countdown en
  fila (divide en móvil vía media queries); footer con plantilla e info.
- Temas por CSS variables → cambio de tema sin tocar componentes.

## Tests / Validación

- `npm run typecheck`, `npm run lint`, `npm run build`: limpios ✅.
- Build con 7 workers confirmado tras fix de "database is locked"
  (`PRAGMA busy_timeout = 5000` + reintentos transitorios en `getDb`).
- Smoke HTTP pendiente en este check (ver Historial); renderizado validado vía
  `/demo` y `/w/[slug]` en dev.

## Relaciones

- Contexto: `brain/context/06_web_builder_y_renderer.md`,
  `brain/context/03_dominio_y_modelo_datos.md`.
- Depende de m01; habilita m04/m05/m06/m07.
- Skills: `feature-doc`, `module-progress`.

## Decisiones

- **ADR-002:** renderer único compartido por Demo/Builder/Preview/pública.
- **DEFAULT_THEME `ivory`** y **DEFAULT_TEMPLATE `elegance`**: los temas y
  plantillas reales vendrán en m03/m05; se proveen defaults tipados ahora.
- Imágenes demo vía `picsum.photos` (placeholder hasta storage/uploads).
- `SectionDataMap` con `drive`/`location` obligatorios pero con datos vacíos
  por defecto (el renderer los oculta si no hay contenido).

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | `WeddingRenderer` + 9 secciones, `lib/wedding/render-data`, `weddingMediaRepo`, `SectionDataMap`/`Theme`/`TemplateConfig`, defaults `ivory`/`elegance`, demo `/demo`, página pública `/w/[slug]`; lint+typecheck+build limpios; fix "database is locked" en build (busy_timeout + retry) | ✅ |
| 2026-09-01 | **v2.1 (ambientación):** `Motifs.tsx` (SVG por ambientación + fondo + `SectionDivider`), `SectionComponentProps.templateId` inyectado por `WeddingRenderer`, y variantes de sección con layouts reales (Hero fullscreen/classic/split/minimal, Couple classic/editorial/portrait, Gallery grid/masonry/carousel/editorial, etc.). Verificado: lint + typecheck + build limpios, motivos presentes en SSR de las 5 demos | ✅ |