# Feature: Preview Responsive (m06)

> Preview limpia que oculta las herramientas del Builder y conmutación de
> viewport Desktop/Tablet/Mobile. Mobile-first (ADR-006).

---

## Metadata

- **Feature ID:** `F-006`
- **Módulo(s):** `m06_preview_responsive`
- **Estado:** ✅
- **Fecha de creación:** 2026-09-01
- **Última actualización:** 2026-09-01

---

## Objetivo

Que el usuario vea cómo quedará su página como una página real (sin las
herramientas del Builder) y pueda comprobar el diseño en distintos dispositivos
incluyendo mobile, que es donde se consumen las invitaciones (plan.md §38;
RF-015; ADR-006).

## Filosofía / Enfoque

- **Un solo renderer (ADR-002, §53):** la preview usa exactamente el mismo
  `WeddingRenderer` que el Builder y la página pública. Preview ≠ Página
  publicada solo en el acceso (requiere login/owner), nunca en el renderizado.
- **Los datos mandan:** la preview se monta con `getWeddingPageData` sobre los
  datos guardados de la boda (modelo página-como-datos, §23), igual que la
  página pública.
- **Viewports dentro del Builder (m04):** la conmutación Desktop/Tablet/Mobile
  vive en `BuilderCanvas` + `PreviewToolbar`; la preview limpia añade la ruta
  `/dashboard/bodas/[id]/preview` sin herramientas.

## Flujo

```
Builder (m04)                    Preview limpia (m06)
────────────────────             ──────────────────────
PreviewToolbar                    /dashboard/bodas/[id]/preview (force-dynamic)
 [Desktop→100%]                    requireUser + owner → getWeddingPageData
 [Tablet →768px]                   → <WeddingRenderer> directo
 [Mobile →375px]                   → barra fina "← Volver al editor"
   └─ BuilderCanvas (vue en vivo,      (sin sidebar, sin toolbar, sin autosave)
      cambios sin guardar reflejados)
```

## Integración con el sistema principal

- **Builder (m04):** `BuilderCanvas` resuelve el ancho por viewport y centra el
  canvas en fondo neutro; `PreviewToolbar` (bottom bar) conmuta
  Desktop/Tablet/Mobile. La top bar del Builder enlaza "Preview" a la nueva ruta.
- **Renderer (m02):** la preview usa `WeddingRenderer` + `EffectiveSection`
  (`getWeddingPageData`) — cero duplicación frente a la página pública.
- **Auth/servidor:** `requireUser` + chequeo de propietario (misma regla que la
  página del Builder); `seedBaseData()` asegura plantillas en BD.

## Datos

- Ninguna tabla nueva: reutiliza `weddings`, `sections`, `wedding_media` y el
  resultado tipado de `getWeddingPageData`.

## Reglas

- La preview **oculta las herramientas del Builder** (sin sidebar, sin panel de
  edición, sin autosave); solo una barra mínima de navegación.
- La preview **requiere sesión y propiedad** (no es la página pública `/w/[slug]`).
- Mobile-first: el renderer es responsive por sí mismo; `metadata.robots`
  desindexa la preview (no es contenido público).

## UX / Responsive

- **En el Builder:** Desktop (100% del canvas), Tablet (768px), Mobile (375px),
  con el página centrada y sombra en un fondo neutro — refleja los cambios sin
  guardar en vivo.
- **Preview limpia:** barra sticky "← Volver al editor" + nombre de la boda;
  debajo la página real, idéntica a la pública.

## Tests / Validación

- `npm run typecheck`, `npm run lint`, `npm run build`: limpios ✅
  (14/13 páginas: se añade `/dashboard/bodas/[id]/preview`).
- Criterio: Preview funciona y la página pública usa los mismos datos (ADR-002).
- Pendiente (runtime): navegar Builder → Preview → volver al editor (dev server).

## Relaciones

- Depende de m02 (renderer), m04 (builder + viewports), m05 (plantillas).
- Habilita m07 (publicación: Preview → Publicar).
- Contexto: `brain/context/06_web_builder_y_renderer.md`.
- Skills: `feature-doc`, `module-progress`.

## Decisiones

- **Vistas Desktop/Tablet/Mobile** implementadas en el Builder (m04) como ancho
  controlado del canvas, no como rutas separadas.
- **Preview limpia como ruta propia** `/dashboard/bodas/[id]/preview`
  (plan.md §38); protegida por owner; renderiza idéntico a la pública (ADR-002).

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | Vistas Desktop/Tablet/Mobile en el Builder (BuilderCanvas 100%/768px/375px + PreviewToolbar). Preview limpia `/dashboard/bodas/[id]/preview` (server, owner, noindex) con WeddingRenderer + barra "Volver al editor"; botón "Preview" en la top bar del Builder; typecheck + lint + build limpios | ✅ |