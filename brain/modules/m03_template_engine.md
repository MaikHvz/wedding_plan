# Módulo m03 — Template Engine

> Definición, versionado, variantes y temas de plantillas.
> Ver `brain/modules/_index.md` para el resumen global.

---

## Objetivo

Motor que define una plantilla como **metadata + version + theme + sections +
variants**, permitiendo agregar plantillas nuevas sin reescribir el Builder.

---

## Alcance

- `lib/templates` (Template Engine).
- Sistema de variantes por sección.
- Sistema de temas (colores, tipografías, botones, bordes, espaciado).
- Versionado (`template_id` + `template_version`).

---

## Reglas

- Una plantilla nueva (ej. `boho.json`) se incorpora sin reescribir el Builder (plan.md §112).
- Cada boda guarda versión de plantilla (ADR-003).
- Temas restringidos: sin CSS/HTML libre en MVP (plan.md §16).
- Las plantillas deben respetar licencias (`LICENSES.md`).

---

## Progreso

| # | Feature | Estado |
|---|---------|--------|
| 1 | Motor de plantillas (`lib/templates`) | ✅ |
| 2 | Sistema de variantes | ✅ |
| 3 | Sistema de temas | ✅ |
| 4 | Versionado de plantillas | ✅ |

> Feature documentada: `brain/features/template-engine.md`.
> Plantilla inicial: `src/templates/elegance.json` (v1); las 5 del catálogo
> completo llegan en m05 con la misma mecánica del engine.

---

## Relaciones

- Depende de: m02 (secciones que las plantillas componen).
- Usado por: m04 (Builder), m05 (plantillas concretas).
- Contexto: `brain/context/05_sistema_plantillas.md`.

---

## Decisiones

- Template Engine en lugar de páginas independientes (plan.md §12).
- **ADR-003:** templates versionados.
- Temas restringidos (plan.md §16).
- `DEFAULT_TEMPLATE` exportado del registro (primera plantilla = Elegante) para
  crear bodas sin pasar por el catálogo (dashboard "Nueva boda").
- **v2:** plantilla define estructura; el tema (`themeId` + `suggestedThemeIds`)
  es un color seleccionable. `LEGACY_TEMPLATE_MAP` re-mapea los slugs de la 1ª
  generación (romantic/minimal/garden/luxury) a `elegance` (retro-compat).

## Historial

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | Export `DEFAULT_TEMPLATE` en `registry.ts` (fuente única del engine); "Nueva boda" del dashboard lo usa con su `themeId` | ✅ |
| 2026-09-01 | v2: `TemplateConfig.suggestedThemeIds` + validación; `LEGACY_TEMPLATE_MAP`; 5 plantillas vigentes (elegance, boho, urbana, clasica, costa) | ✅ |
