# Feature: Publicación (m07)

> Estados de la boda, flujo de publicación controlado por el backend y página
> pública con URL generada. Publicar requiere pago confirmado (ADR-004).

---

## Metadata

- **Feature ID:** `F-007`
- **Módulo(s):** `m07_publicacion`
- **Estado:** ✅
- **Fecha de creación:** 2026-09-01
- **Última actualización:** 2026-09-01

---

## Objetivo

Que una boda pase de borrador a página pública **solo tras pago confirmado por
el backend**, generando la URL `/w/[slug]` con contenido idéntico a la preview
(plan.md §38–41; RF-016). La página pública funciona sin login.

## Filosofía / Enfoque

- **Backend controla la publicación (ADR-004, §42/§86):** ningún clic del
  frontend publica directamente. El flujo es
  `checkout → pago → validación backend → Order=PAID → Wedding=PUBLISHED → URL`.
- **Máquina de estados explícita:** `ALLOWED_TRANSITIONS` por estado
  (DRAFT, READY, PAYMENT_PENDING, PAID, PUBLISHED, EXPIRED, ARCHIVED) con
  `transitionWeddingStatus` que lanza ante saltos inválidos.
- **La página pública es un canal de salida, no un estado editable:** solo
  renderiza bodas con `status === "PUBLISHED"` (las demás → `notFound`), y usa
  el mismo `WeddingRenderer` + `getWeddingPageData` (ADR-002). Preview y pública
  nunca difieren.

## Flujo

```
Builder → "Publicar" → /dashboard/bodas/[id]/checkout
        → (usuario elige producto) → Pagar (simulado [m08])
        → createOrder      (provider simulated)   wedding → PAYMENT_PENDING
        → simulateSuccessfulPayment               order → PAID
        → publishWeddingAfterPaid (backend)
             ├─ existe orden PAID?  (si no → PublishError NOT_PAID)
             ├─ transition PAID → PUBLISHED
             └─ upsert publications (slug + published_at + expires_at)
        → redirect /w/<slug>  (contenido = misma data del builder)
   /w/[slug] público: status == PUBLISHED? → WeddingRenderer; si no → 404
```

## Integración con el sistema principal

- **Renderer (m02/datos):** `getWeddingPageData` alimenta la pública; cero
  duplicación con preview (m06) y demo (m05).
- **Pagos (m08):** la publicación consume `lib/payments`
  (`createOrder`, `simulateSuccessfulPayment`) y valida órdenes; la capa
  `lib/wedding/publish.ts` NO se exporta al cliente (server-only).
- **Dashboard/Builder (m04):** "Publicar" (top bar del Builder y tarjetas del
  dashboard) enlaza al checkout; "Página pública"/"Ver pública" aparece solo
  en bodas PUBLISHED (DRAFT manda al editor o al checkout).
- **Capas `lib/*`:** `lib/wedding/publish.ts` (máquina de estados +
  `publishWeddingAfterPaid`), `lib/data` (weddings/orders/products/publications).

## Datos

- `weddings.status` transiciona por la máquina; `weddings.published_at` no cambia
  (heredado) — la publicación persistida vive en `publications`.
- `orders`: PAID confirmado vía `ordersRepo`; `products.duration_days` define
  `expires_at`.
- `publications`: upsert por boda (`slug`, `status=PUBLISHED`, `published_at`,
  `expires_at`).

## Reglas

- Publicar sin orden PAID → `PublishError NOT_PAID` (inmutable desde frontend).
- Transiciones inválidas → `PublishError INVALID_TRANSITION` (no hay saltos
  arbitrarios: p.ej. DRAFT → PUBLISHED sin pago es imposible porque la máquina
  exige PAID previo).
- Página pública: solo `PUBLISHED`; sin login; `metadata`/Open Graph
  (`X & Y | Nuestra boda`).
- Re-publicar (EXPIRED → pago → PUBLISHED) es posible con una nueva orden PAID.

## UX / Responsive

- El usuario ve el estado actual en checkout/dashboard; tras el pago es
  redirigido a su página pública (mismo renderer responsive, mobile-first).

## Tests / Validación

- `npm run typecheck`, `npm run lint`, `npm run build`: limpios ✅
  (nueva ruta `/dashboard/bodas/[id]/checkout`).
- Criterios: usuario no pagado no puede publicar; order=PAID → wedding=PUBLISHED;
  URL generada; página pública funciona.
- Pendiente (runtime): flujo checkout simulado → pública (dev server).

## Relaciones

- Depende de m08 (pagos), m02/m06 (renderer+preview), m04 (Builder).
- Contexto: `brain/context/07_publicacion_y_pagos.md`,
  `brain/context/04_rutas_y_estructura.md`.
- Skills: `feature-doc`, `module-progress`.

## Decisiones

- **ADR-004:** publicación solo con pago confirmado por backend.
- Máquina de estados explícita con transiciones validadas (plan.md §95, §108).
- Publicación idempotente (una boda ya PUBLISHED no se re-publica en cada visita).
- La URL pública usa el slug de la boda (el usuario lo ve desde el checkout).

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | `lib/wedding/publish.ts` (estados + transiciones + `publishWeddingAfterPaid` con validación de orden PAID y upsert en `publications`), checkout que orquesta pago→publicación, página pública `/w/[slug]` gateada a PUBLISHED con metadata/OG, botones Publicar/Ver pública en Builder y dashboard; typecheck + lint + build limpios | ✅ |
| 2026-09-01 | **Expiración por tiempo (`applyExpiryIfDue`):** al servir `/w/[slug]` y entrar al checkout, el backend expira bodas PUBLISHED cuyo `expiresAt` venció (PUBLISHED→EXPIRED, publication→EXPIRED). `/w/[slug]` muestra "Esta invitación ha expirado" (con CTA a /login) para EXPIRED en vez de 404; el checkout relee el estado y ofrece re-publicar (EXPIRED→nueva orden PAID→PUBLISHED). | ✅ |