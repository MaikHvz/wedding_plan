# Módulo m06 — Preview Responsive

> Preview limpia + conmutación Desktop/Tablet/Mobile.
> Ver `brain/modules/_index.md` para el resumen global.

---

## Objetivo

Permitir ver cómo se ve la página en distintos dispositivos y mostrar una preview
limpia (sin herramientas del Builder) que parezca una página real.

---

## Alcance

- PreviewToolbar con Desktop / Tablet / Mobile.
- Preview limpia en `/dashboard/bodas/[id]/preview`.
- Mobile-first (ADR-006).

---

## Reglas

- La preview usa el mismo `WeddingRenderer` que la página pública (ADR-002).
- La preview oculta las herramientas del Builder.
- Mobile-first: las invitaciones se consumen en móvil.

---

## Progreso

| # | Feature | Estado |
|---|---------|--------|
| 1 | Vista Desktop | ✅ |
| 2 | Vista Tablet | ✅ |
| 3 | Vista Mobile | ✅ |
| 4 | Preview limpia (`/preview`) | ✅ |

> Feature documentada: `brain/features/preview-responsive.md`.
> Vistas 1–3 implementadas en m04 (`BuilderCanvas` + `PreviewToolbar`).

---

## Relaciones

- Depende de: m02 (renderer), m04 (builder), m05 (plantillas).
- Habilita: m07 (flujo Preview → Publicar).
- Contexto: `brain/context/06_web_builder_y_renderer.md`.

---

## Decisiones

- **ADR-006:** mobile-first.
- **ADR-002:** renderer único (preview = pública).
- Preview limpia como ruta propia `/dashboard/bodas/[id]/preview`, protegida por
  owner y noindex.

---

## Historial

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | Viewports Desktop/Tablet/Mobile en el Builder (100%/768px/375px); preview limpia `/dashboard/bodas/[id]/preview` con WeddingRenderer + "← Volver al editor"; botón "Preview" en top bar del Builder; typecheck + lint + build limpios | ✅ |