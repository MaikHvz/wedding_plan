# Módulo m07 — Publicación

> Estados de la boda, flujo de publicación y página pública.
> Ver `brain/modules/_index.md` para el resumen global.

---

## Objetivo

Permitir que una boda pase de borrador a página pública **solo tras pago
confirmado por el backend**, generando la URL pública `/w/[slug]`.

---

## Alcance

- Estados de la boda: DRAFT, READY, PAYMENT_PENDING, PAID, PUBLISHED, EXPIRED, ARCHIVED.
- Flujo de publicación.
- Página pública `/w/[slug]` (sin login).
- Publicación controlada por backend tras validar pago.

---

## Reglas

- **Nunca** activar publicación desde el frontend; solo desde el backend tras validar el pago (plan.md §42, §86).
- No permitir saltos arbitrarios de estados.
- La página pública funciona sin login y usa los mismos datos del builder.

---

## Progreso

| # | Feature | Estado |
|---|---------|--------|
| 1 | Estados de la boda | ✅ |
| 2 | Flujo de publicación | ✅ |
| 3 | Página pública `/w/[slug]` | ✅ |
| 4 | Publicación solo tras pago confirmado | ✅ |

> Feature documentada: `brain/features/publicacion.md`.
> Máquina de estados en `lib/wedding/publish.ts`; página pública en
> `/w/[slug]` gateada a PUBLISHED (necesita pago m08).
> **Admin:** `/admin/publicaciones` lista las publicaciones (slug, boda, dueño,
> estado, fechas) vía `listAdminPublications` (ver `brain/features/admin-panel.md`).
> **v2 (SEO):** `/w/[slug]` publica `generateMetadata` (canonical, OG, twitter,
> title/description con nombres+fecha+lugar) y `Event` JSON-LD; PUBLISHED se
> indexa, EXPIRED/no-publicada `noindex` (ver `brain/features/seo.md`).

---

## Criterios de aceptación

```
[x] usuario no pagado no puede publicar  (PublishError NOT_PAID)
[x] pago validado (backend)
[x] order = PAID, wedding = PUBLISHED
[x] URL generada (/w/<slug>)
[x] página pública funciona (sin login)
```

---

## Relaciones

- Depende de: m01, m08 (pagos).
- Usado por: m05 (plantillas), m06 (preview).
- Contexto: `brain/context/07_publicacion_y_pagos.md`, `brain/context/04_rutas_y_estructura.md`.

---

## Decisiones

- **ADR-004:** publicación mediante pago confirmado.
- Estados según plan.md §95, §108; transiciones explícitas validadas.
- Publicación idempotente; re-publicación de EXPIRED con nueva orden PAID.

---

## Historial

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | `lib/wedding/publish.ts` (estados, transiciones, `publishWeddingAfterPaid`), checkout orquesta pago→publicación, `/w/[slug]` solo PUBLISHED con metadata/OG, botones Publicar/Ver pública en Builder y dashboard; typecheck + lint + build limpios | ✅ |
| 2026-09-01 | **Expiración real:** `applyExpiryIfDue` expira (PUBLISHED→EXPIRED) cuando `expiresAt` venció; se aplica al servir `/w/[slug]` (backend, no cliente) y en checkout (permite re-publicar con nueva orden PAID). Página pública muestra aviso "invitación expirada" en vez de 404 para EXPIRED. `DEFAULT_TEMPLATE` exportado del engine para "Nueva boda" | ✅ |
| 2026-09-06 | Admin: `/admin/publicaciones` (lista con joins a weddings/profiles, estados de publicación) | ✅ |