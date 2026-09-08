# Módulo m04 — Web Builder

> Editor visual por bloques. **El corazón del MVP (P0).**
> Ver `brain/modules/_index.md` para el resumen global.

---

## Objetivo

Permitir que una persona sin conocimientos técnicos cree una web de boda completa
personalizando plantillas, secciones, temas y contenido, con autosave y vista
responsive.

---

## Alcance

- Layout Builder: Sidebar + Canvas.
- Editor de contenido (nombres, fecha, textos, ubicación, enlaces).
- Editor de secciones (agregar, eliminar, ocultar, reordenar).
- Editor de temas.
- Autosave con debounce.
- Upload de imágenes.
- Responsive Desktop/Tablet/Mobile.

---

## Reglas

- Builder restringido a Templates + Sections + Variants + Themes + Content (plan.md §111).
- No convertir el Builder en editor libre.
- El Builder controla estado/edición/interacción; el Renderer la representación (plan.md §91).
- No poner toda la lógica en `Builder.tsx`.
- Autosave con debounce (~800 ms), no petición por tecla.
- El Builder guarda datos (modelo página-como-datos, §23), nunca HTML.

---

## Progreso

| # | Feature | Estado |
|---|---------|--------|
| 1 | Layout Builder (Sidebar + Canvas) | ✅ |
| 2 | Editor de contenido | ✅ |
| 3 | Editor de secciones | ✅ |
| 4 | Editor de temas | ✅ |
| 5 | Autosave (debounce) | ✅ |
| 6 | Upload de imágenes | ✅ |

> Feature documentada: `brain/features/web-builder.md`.
> **v3 (admin):** el mismo `Builder` edita bodas ajenas desde
> `/admin/bodas/[id]/edit` — props `saveAction/homeHref/previewHref/publishHref`,
> con `saveWeddingPageAdminAction` como `saveAction` y `publishHref="#"`
> (ver `brain/features/admin-panel.md`).

---

## Criterios de aceptación

```
[x] elegir/seleccionar plantilla   [ ] ver demo (pendiente runtime)
[x] editar contenido               [x] modificar imágenes (upload)
[x] cambiar tema                   [x] reordenar secciones
[x] ocultar secciones              [x] ver mobile/desktop
[x] cambios guardados (autosave)   [ ] preview (enlace, runtime pendiente)
[ ] página pública usa los mismos datos (runtime pendiente)
```

---

## Relaciones

- Depende de: m01, m02, m03.
- Usado por: m05 (plantillas), m06 (preview), m07 (publicación).
- Contexto: `brain/context/06_web_builder_y_renderer.md`.

---

## Decisiones

- **ADR-001:** editor por bloques.
- **ADR-002:** renderer único (el canvas usa `WeddingRenderer`).
- **ADR-007:** persistencia local vía server actions; `lib/maps` disponible en
  cliente (validación pura) para que el renderer funcione dentro del Builder.
- Builder basado en pilares (plan.md §111); modelo compartido en
  `lib/builder/model.ts`.

---

## Historial

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | `lib/builder/model.ts`, página `/dashboard/bodas/[id]` + actions (save/upload), componentes Builder/Canvas/Sidebar/ContentEditor/SectionManager/ThemeEditor/PreviewToolbar/fields, autosave 800 ms, viewports Desktop/Tablet/Mobile, botón "Editar" en dashboard, fix `lib/maps` server-only; typecheck + lint + build limpios | ✅ |
| 2026-09-01 | **Autosave solo con cambios:** ya no guarda al montar sin ediciones; compara `JSON.stringify(page)` contra el último estado guardado (`savedJson` ref) y muestra "Error al guardar" en rojo si falla. "Nueva boda" usa `DEFAULT_TEMPLATE` del engine (antes elegance hardcodeado) | ✅ |
| 2026-09-06 | **Builder admin:** props `saveAction/homeHref/previewHref/publishHref`; `saveWeddingPageCore` (permiso dueño-o-admin) + `saveWeddingPageAdminAction` en `/dashboard/bodas/[id]/actions.ts`; guardado admin desde `/admin/bodas/[id]/edit` con `publishHref="#"` | ✅ |