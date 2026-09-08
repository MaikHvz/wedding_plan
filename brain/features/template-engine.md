# Feature: Template Engine (m03)

> Motor que define una plantilla como metadata + versión + tema + secciones +
> variantes, e incorpora plantillas nuevas sin reescribir el Builder.

---

## Metadata

- **Feature ID:** `F-003`
- **Módulo(s):** `m03_template_engine`
- **Estado:** ✅
- **Fecha de creación:** 2026-09-01
- **Última actualización:** 2026-09-01

---

## Objetivo

Convertir "plantilla" en un recurso declarativo: `metadata + version + theme +
sections + variants` (plan.md §12). Que agregar una plantilla (ej.
`boho.json`) se limite a crear su definición; el Builder y el Renderer siguen
igual (plan.md §112), y que las bodas existentes nunca se rompan al actualizar
una plantilla (ADR-003, §13).

## Filosofía / Enfoque

- Las plantillas **no** son páginas independientes: se componen de secciones
  reutilizables + variantes + tema (§12, ADR-001).
- **Temas restringidos** (§16): sin CSS/HTML libre; solo claves de token
  conocidas y valores seguros (configuración profesional).
- **Versiones** (ADR-003): cada plantilla tiene `template_id` +
  `template_version`; cada boda guarda su versión; resolver una versión
  ausente cae a la disponible sin errores.
- Registro declarativo: definiciones en `src/templates/<slug>.json`
  importadas por `lib/templates/definitions/`. Validación al cargar
  (`assertValidTemplates`) → falla rápido si una plantilla es inválida.

## Flujo

```
src/templates/<slug>.json  (definición declarativa)
        │  import
lib/templates/definitions/index.ts  (registro; punto único de extensión)
        │
lib/templates/registry.ts  (validate / getAll / get / resolve(slug, version))
        │
lib/templates/seed.ts  →  syncTemplatesToDb(templatesRepo)  →  seedBaseData()
        │
lib/templates/themes.ts  (resolveTheme: base + overrides sanitizados)
        │
lib/wedding/render-data.ts  (resolveTemplateConfig / buildTheme)
        │
        ▼
WeddingRenderer (themeStyles → CSS variables; variant por sección)
```

## Integración con el sistema principal

- **Engine:** `lib/templates` (variants, themes, registry, seed, barrel
  `index.ts`).
- **Tipos:** `TemplateConfig` extendido (`slug`, `description`, `category`,
  `themeId`, `previewUrl?`) en `src/types`.
- **Definiciones:** `src/templates/elegance.json` (v1, variants según §14);
  m05 añadirá las otras plantillas con la misma mecánica.
- **Seed:** `seedBaseData()` (en `lib/data/index.ts`) ahora también sincroniza
  plantillas del engine a la tabla `templates` (UPSERT por slug) — se invoca
  desde login, dashboard y health.
- **Renderer/data:** `resolveTemplateConfig` (DB row → engine → fallback
  `DEFAULT_TEMPLATE`) y `buildTheme` (engine `resolveTheme` → fallback
  `DEFAULT_THEME`). `WeddingRenderer` pasa `variant` a cada sección.
- **Config:** `DEFAULT_THEME`/`DEFAULT_TEMPLATE` en `config/app.ts` deriven del
  engine (fuente única), con fallback hardcodeado defensivo.
- **Consumidores:** página pública `/w/[slug]`, demo `/demo`, y futuros
  Builder (m04) / catálogo (m05) / preview (m06).

## Datos

- Tabla `templates` (id, slug, name, description, category, preview_url,
  config_json, version, is_active): sembrada desde el engine.
- `weddings.template_id` + `weddings.template_version` (ya existentes)
  resueltos por el engine.
- `templates.config_json` guarda el `TemplateConfig` serializado que consume
  el renderer.
- Modelo completo: `brain/context/03_dominio_y_modelo_datos.md`.

## Reglas

- Nueva plantilla = JSON + una línea en `definitions/`; nunca se reescribe el
  Builder (plan.md §112) ni el Renderer.
- Versión obligatoria entera ≥ 1 por plantilla (ADR-003); `resolveTemplate`
  nunca rompe una boda al faltar la versión pedida.
- **v2:** `TemplateConfig.suggestedThemeIds?` (paletas sugeridas para la
  tarjeta; opcional) validado contra los temas del sistema en
  `validateTemplateConfig`. `LEGACY_TEMPLATE_MAP` (romantic/minimal/garden/
  luxury → elegance) mantiene resolviendo slugs de la 1ª generación.
- Variantes validadas contra `SECTION_VARIANTS` (§14: hero classic/fullscreen/
  split/minimal; gallery carousel/grid/masonry/editorial; story classic/
  timeline/editorial/minimal; location classic/split/centered; resto `classic`
  + variantes propias). Variante desconocida → `classic`.
- Tokens de tema solo de `THEME_TOKEN_KEYS` y con valor CSS seguro (rechaza
  `;`, `{}`, `url(`, `expression`, `javascript:`, `@import`).
- Recursos: licencias compatibles registradas en `LICENSES.md` (plan.md §68–69).

## UX / Responsive

- El engine no renderiza UI; expone datos para que el renderer (m02) y el
  selector de plantillas (m04/m05) respeten el diseño responsive existente.

## Tests / Validación

- `npm run typecheck`, `npm run lint`, `npm run build`: limpios ✅.
- Validación en carga: `assertValidTemplates()` corre al importar
  `lib/templates` (durante el build bajo los 7 workers; falla el build si una
  definición es inválida).
- Pendiente (demo/runtime): smoke HTTP de `/demo`, `/api/health` y `/w/[slug]`
  a la espera de levantar dev server.

## Relaciones

- Depende de m01 (tipos, DB) y m02 (secciones que componen las plantillas).
- Habilita m04 (Builder), m05 (plantillas concretas), m07 (publicación usa
  template+versión).
- Contexto: `brain/context/05_sistema_plantillas.md`,
  `brain/context/02_arquitectura.md`, `brain/context/03_dominio_y_modelo_datos.md`.
- Skills: `feature-doc`, `module-progress`.

## Decisiones

- **ADR-003:** templates versionados; boda guarda `template_id` +
  `template_version`.
- Definiciones como **JSON standalone** (`src/templates/*.json`) en lugar de
  TS: el registro las valida y se incorporan sin tocar el Builder.
- Temas restringidos (§16): keys fijas + sanitización de valores; el usuario
  (vía m04) no puede inyectar CSS/HTML.
- `DEFAULT_THEME`/`DEFAULT_TEMPLATE` **derivados del engine** (evita drift
  entre config y registros), con fallback hardcodeado por seguridad.
- Seeding de templates por **UPSERT por slug** dentro de `seedBaseData()`.

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | `lib/templates` (variants/themes/registry/seed/index), `src/templates/elegance.json`, `TemplateConfig` extendido, 6 temas del sistema, seed a BD, integración en render-data/demo/config, `LICENSES.md`; typecheck + lint + build limpios | ✅ |
| 2026-09-01 | **v2:** `TemplateConfig.suggestedThemeIds` + validación (tema desconocido → error en `assertValidTemplates`); `LEGACY_TEMPLATE_MAP` (romantic/minimal/garden/luxury → elegance) con retro-compat para bodas de la 1ª generación | ✅ |