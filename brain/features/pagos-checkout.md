# Feature: Pagos y Checkout (m08)

> Productos, checkout y órdenes. **Sin pasarela API mientras no desplegamos:
> el pago se simula en el backend** y la publicación se activa tras esa
> validación (ADR-004 / ADR-007).

---

## Metadata

- **Feature ID:** `F-008`
- **Módulo(s):** `m08_pagos`
- **Estado:** ✅
- **Fecha de creación:** 2026-09-01
- **Última actualización:** 2026-09-01

---

## Objetivo

Monetizar con pago único garantizando que **la publicación solo se active cuando
el backend confirme el pago** (plan.md §42; RF-017). Hoy el "pago" se simula
localmente a través de `lib/payments`; al desplegar se sustituye por una pasarela
real (API + webhooks) sin reescribir la app (ADR-007).

## Filosofía / Enfoque

- **Nunca confiar en `paid=true` del frontend:** el checkout es un server action
  que orquesta `createOrder → simulateSuccessfulPayment → publishWeddingAfterPaid`
  — todas operaciones backend con validaciones propias.
- **La "validación server-side" del webhook se materializa hoy en**
  `simulateSuccessfulPayment` (verifica que la orden existe y no está paga) y
  `publishWeddingAfterPaid` (exige una orden PAID). Es el mismo camino que
  seguirá un webhook real tras el despliegue, reemplazando solo la fuente de
  confirmación del proveedor.
- Productos sembrados desde `config/app.ts` (Esencial/Premium activos; Invitados
  inactivo) y sincronizados con `productsRepo.upsert` en `seedBaseData()`.

## Flujo

```
/plantillas o dashboard → "Publicar" → /dashboard/bodas/[id]/checkout
   (lista productos activos con features + precio CLP)
   → server action completeCheckoutAction (requireUser + owner)
        ├─ createOrder({user, wedding, productId}, provider=simulated)   → PENDING
        ├─ simulateSuccessfulPayment(order.id)      → Order=PAID  (backend "webhook")
        └─ publishWeddingAfterPaid(wedding.id)       → Wedding=PUBLISHED + URL (m07)
   → redirect /w/<slug>
```

## Integración con el sistema principal

- **Capa `lib/payments` (m01):** `createOrder`, `simulateSuccessfulPayment`,
  `getActiveProducts`, `PAYMENT_PROVIDER_SIMULATED`. Solo server (`server-only`).
- **Publicación (m07):** `lib/wedding/publish.ts` consume las órdenes PAID y
  publica (ADR-004) — pagos no publican por sí solos; la publicación valida.
- **Datos:** `orders` (user/wedding/product, provider, amount, currency, status,
  paid_at), `products` (seed), `publications` (vía m07).
- **UI:** página de checkout dentro del builder (`/dashboard/bodas/[id]/checkout`)
  con selector de producto y botón "Pagar (simulado)".

## Datos

- `products`: Esencial (19990), Premium (39990), Invitados (14990, inactivo);
  `durationDays` 365 define la vigencia de la publicación.
- `orders`: una por intento de pago; `PAID` es la única que habilita publicar.
- Currency: `CLP`.

## Reglas

- Server-only: ningún import de `lib/payments`/`lib/wedding/publish` en cliente.
- Orden inexistente o ya pagada → `PaymentsError` (ORDER_NOT_FOUND / ALREADY_PAID).
- Publicar sin orden PAID → `PublishError NOT_PAID` (imposible desde frontend).
- Los secretos de una pasarela real (firma/secret del webhook) vivirán en
  variables de entorno (contexto 02/07); hoy no hay secretos en el repo.
- Redirección `redirect("/dashboard")` si el usuario no es propietario.

## UX / Responsive

- Checkout mobile-friendly: tarjetas de producto con nombre, descripción,
  features (chips), precio y CTA "Pagar (simulado)"; aviso explícito de "entorno
  local / sin pasarela".
- Si la boda ya está PUBLISHED, la página muestra "Ver página pública" en vez de
  volver a cobrar (idempotencia).

## Tests / Validación

- `npm run typecheck`, `npm run lint`, `npm run build`: limpios ✅.
- Criterios: checkout funciona; pago validado; orden PAID; wedding PUBLISHED;
  URL generada; página pública funciona (these con m07).
- Pendiente (runtime): "Usar plantilla" → Builder → Publicar → Pagar (simulado) →
  /w/[slug] (dev server).

## Relaciones

- Depende de m01 (capas `lib/payments` + `lib/data`), m03 (seed de productos en
  `seedBaseData`), m07 (publicación).
- Contexto: `brain/context/07_publicacion_y_pagos.md`,
  `brain/context/03_dominio_y_modelo_datos.md`.
- Skills: `feature-doc`, `module-progress`.

## Decisiones

- **ADR-004 / ADR-007:** sin pasarela API durante el MVP; pagos simulados
  localmente; la pasarela real se integra solo tras el despliegue.
- El checkout es un **server action** (no una ruta API separada) que orquesta el
  flujo completo backend, minimizando superficie de ataque.
- El webhook real se mapeará al mismo punto de validación (`simular pago`) para
  no cambiar el core al desplegar.

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | Checkout `/dashboard/bodas/[id]/checkout` (productos activos + precio CLP + features) y server action `completeCheckoutAction` (createOrder → simulateSuccessfulPayment → publishWeddingAfterPaid → redirect /w). Órdenes/estados vía `lib/payments` (existente desde m01); validación server-side simulando webhook; typecheck + lint + build limpios | ✅ |