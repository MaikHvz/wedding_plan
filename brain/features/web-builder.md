# Feature: Web Builder (m04)

> Editor visual por bloques: el usuario personaliza plantilla, secciones, tema y
> contenido de su web de boda con autosave y vista responsive. **El corazón del MVP (P0).**

---

## Metadata

- **Feature ID:** `F-004`
- **Módulo(s):** `m04_web_builder`
- **Estado:** ✅
- **Fecha de creación:** 2026-09-01
- **Última actualización:** 2026-09-01

---

## Objetivo

Permitir que una persona sin conocimientos técnicos cree y edite su web de boda
desde el dashboard: elegir plantilla, editar contenido e imágenes, reordenar /
ocultar / agregar secciones, cambiar el tema, y ver el resultado al instante en
el canvas, guardando cambios automáticamente (plan.md §17–32, §52–53, §90–91,
§111). Toda edición queda en **datos**, no en HTML.

## Filosofía / Enfoque

- **Editor especializado por bloques, nunca editor libre** (§111): Templates +
  Sections + Variants + Themes + Content; conclusión del modelo
  página-como-datos (§22–23).
- **Modelo compartido** `lib/builder/model.ts` (cliente + servidor) con
  `SECTION_FIELDS` por sección y `buildWeddingFields`; fuente única para lo que
  el Builder edita y el Renderer pinta.
- **Separación de responsabilidades** (§91): el Builder controla estado,
  edición e interacción; el Renderer (ADR-002) solo representa. Sin duplicar
  lógica en `Builder.tsx`: se descompone en componentes especializados.
- **Persistencia local (ADR-007):** los cambios se persisten con server actions
  sobre la BD SQLite; el renderer consume los mismos datos en canvas, preview y
  página pública.

## Flujo

```
Dashboard /bodas → "Editar" →
/dashboard/bodas/[id] (server page; force-dynamic; owner)
   ├─ datos iniciales: getWeddingPageData (data actual de BD) + getAllThemes
   └─ <Builder> (client)
        ├─ Sidebar (Contenido | Secciones | Diseño | Plantilla)
        ├─ Canvas (WeddingRenderer con datos editados + tema actual)
        │    └─ BuilderCanvas: viewport Desktop (100%) / Tablet (768px) / Mobile (375px)
        └─ top bar: LOGO + estado Guardado/Guardando + Preview + Publicar
            PreviewToolbar (bottom): Desktop | Tablet | Mobile + estado save
        → onEdit → diff state → mark dirty → autosave debounce ~800 ms
        → saveWeddingPageAction (server action, owner check)
             ├─ wedding: campos de datos + template_id + themeJson { id }
             ├─ secciones: update / insert / delete por id (replaceSections)
             └─ uploads: uploadWeddingImageAction (saveFile → weddings/<id>/<sección>)
```

## Integración con el sistema principal

- **Renderer (m02):** el canvas usa `WeddingRenderer` con los datos editados
  (misma fuente que `/w/[slug]` y `/demo`); el engine pasa `variant` a cada
  sección. Para ello `lib/maps` dejó de ser `server-only` (validación pura,
  segura en cliente).
- **Template Engine (m03):** `getAllThemes` para el selector (tab Diseño);
  `saveWeddingPageAction` guarda `themeJson = { id }` vía `resolveTheme`;
  variantes sanitizadas (`safeVariant`). La plantilla de la boda se cambia
  desde el Builder (tab Plantilla) y se guarda `template_id` + `template_version`.
- **Capas `lib/*`:** `lib/builder/model` (modelo compartido), `lib/data`
  (`weddingsRepo`, sectionsRepo.updateOne/insert/deleteByWeddingId),
  `lib/templates` (temas/registry), `lib/storage` (saveFile → `weddings/<id>/
  <sección>`, límite 10 MB, MIME jpeg/png/webp/gif/avif).
- **Server actions:** `saveWeddingPageAction` y `uploadWeddingImageAction`
  en `src/app/dashboard/bodas/[id]/actions.ts` (requieren sesión +
  propietario; reintento ante "database is locked").
- **Server-only:** `lib/data`, `lib/wedding/render-data` y el resto de capas de
  infraestructura se usan únicamente en la página servidor y las acciones;
  el cliente solo recibe props serializables (`BuilderPageData`).

## Datos

- `weddings`: campos de datos (`spouse1_name`, `date`, `venue`, `maps_url`,
  `drive_url`, `gallery*`, …) + `template_id`/`template_version` +
  `theme_json` (`{"id": "<themeId>"}`).
- `sections` (por boda): `id`, `section_type`, `data`, `order`,
  `is_hidden`, `variant` — reescritas por `replaceSections` (upsert + delete
  por conjunto de ids) sin borrar/crear a ciegas.
- `uploads` → filesystem local bajo `storageRoot()/weddings/<boda>/<sección>/`
  servidos por `/api/uploads/[...path]`.
- Modelo completo: `brain/context/03_dominio_y_modelo_datos.md`.

## Reglas

- El Builder guarda **datos**, nunca HTML (plan.md §23); el renderer construye
  la página pública a partir de los mismos datos.
- Autosave con **debounce ~800 ms** (sin petición por tecla); `SaveStatus`:
  `idle | dirty | saving | saved | error`.
- Validaciones: IMAGE MIME whitelist + tamaño ≤ 10 MB; fechas parseadas de
  `yyyy-mm-dd`; URLs de mapas/drive con `validateMapsOrDriveUrl`; variantes
  contra `SECTION_VARIANTS`; `seed` no editable en esta versión.
- Solo el propietario (o admin) puede guardar la boda; server action valida
  sesión y propiedad.
- No se persiste nada hasta el debounce; estado local controla la UI.

## UX / Responsive

- **Layout:** Sidebar con 4 tabs (Contenido / Secciones / Diseño / Plantilla) +
  canvas central + top bar (LOGO / estado guardado / Preview / Publicar) +
  bottom bar (Desktop / Tablet / Mobile).
- **Viewport:** Desktop = ancho full, Tablet = 768px y Mobile = 375px, con el
  canvas centrado y fondo neutro; el renderer ya es responsive por sí mismo.
- **Detalles:** arrastrar y soltar no contemplado (P1); reordenar con botones
  ↑/↓; toggles de visibilidad por sección; ícono "Agregar sección" abre el
  selector de plantilla disponible.

## Tests / Validación

- `npm run typecheck`, `npm run lint`, `npm run build`: limpios ✅
  (build completo de 8 páginas, incluye ruta dinámica `/dashboard/bodas/[id]`).
- Criterios de aceptación de `motion planning`:
  - seleccionar plantilla / ver demo / editar contenido / modificar imágenes /
    cambiar tema / reordenar y ocultar secciones / ver mobile y desktop /
    cambios guardados / preview / página pública usa los mismos datos.
- Pendiente (demo/runtime): smoke del flujo real (dev server + navegador) de
  edición → autosave → página pública.

## Relaciones

- Depende de m01 (DB/auth), m02 (renderer), m03 (engine de plantillas).
- Usado por m05 (plantillas), m06 (preview responsive), m07 (publicación).
- Contexto: `brain/context/06_web_builder_y_renderer.md`,
  `brain/context/05_sistema_plantillas.md`, `brain/context/02_arquitectura.md`,
  `brain/context/03_dominio_y_modelo_datos.md`.
- Skills: `feature-doc`, `module-progress`.

## Decisiones

- **ADR-007:** sistema local (SQLite + storage local) con server actions como
  puente cliente↔servidor, migrable a Supabase sin reescritura.
- Renderer único (ADR-002) también dentro del canvas del Builder: cero
  duplicación entre edición y página pública.
- Modelo compartido `lib/builder/model.ts` sin `server-only` para usarse en
  cliente y servidor; `lib/maps` purificado para consumo client.
- Guardar solo datos + secciones por id; `replaceSections` upsert/delete
  idempotente; reintento ante "database is locked" (PRAGMA busy_timeout).

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | `lib/builder/model.ts` (modelo compartido + `SECTION_FIELDS`), página servidor `/dashboard/bodas/[id]` + actions (save + upload), componentes `Builder`/`BuilderCanvas`/`BuilderSidebar`/`ContentEditor`/`SectionManager`/`ThemeEditor`/`PreviewToolbar`/`fields`, botón "Editar" en dashboard, autosave debounce 800 ms, viewports Desktop/Tablet/Mobile, fix `lib/maps` server-only; typecheck + lint + build limpios | ✅ |
| 2026-09-01 | **Autosave solo con cambios:** el effect guarda únicamente si `JSON.stringify(page)` difiere del último estado guardado (`savedJson` ref, sin save al montar); fallo muestra "Error al guardar" en rojo. "Nueva boda" crea con `DEFAULT_TEMPLATE` del engine (themeId incluido) en vez de elegance hardcodeado | ✅ |