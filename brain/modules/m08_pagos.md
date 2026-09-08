# Módulo m08 — Pagos

> Productos, checkout, webhooks y órdenes. **Sin pasarela API: pagos simulados
> localmente mientras no desplegamos.**
> Ver `brain/modules/_index.md` para el resumen global.

---

## Objetivo

Implementar la monetización (pago único) garantizando que la publicación solo se
active cuando el backend confirme el pago.

---

## Alcance

- Modelo de productos: Plan Esencial, Premium, Invitados.
- Checkout.
- Webhook + validación server-side.
- Órdenes y estados (`orders`, `publications`).

---

## Reglas

- **Regla de pago:** nunca confiar en `paid=true` del frontend (plan.md §42).
- El backend controla la publicación tras validar el webhook (ADR-004).
- Validar webhooks (firma/secret).
- **Mientras no despleguemos NO hay pasarela de pago por API**: el procesamiento
  es **local, simulando pagos exitosos** vía `lib/payments` (ADR-007).
- La integración con una pasarela real (API + webhooks) se hace **solo tras el despliegue**.
- Secretos en variables de entorno, nunca en repositorio/frontend.

---

## Flujo

```
Checkout → Proveedor → Webhook → Backend → Validación → Order=PAID → Wedding=PUBLISHED → URL
```

---

## Progreso

| # | Feature | Estado |
|---|---------|--------|
| 1 | Modelo de productos | ✅ |
| 2 | Checkout | ✅ |
| 3 | Webhook y validación server-side | ✅ |
| 4 | Órdenes y estados | ✅ |

> Feature documentada: `brain/features/pagos-checkout.md` y
> `brain/features/admin-panel.md` (CRUD productos + órdenes admin).
> El webhook real se mapeará al mismo punto de validación (hoy
> `simulateSuccessfulPayment` + `publishWeddingAfterPaid`).
> **v2 (precio único):** el catálogo se unifica en un solo plan activo
> "Publicar tu página" a CLP $29.990 (pago único, 365 días, incluye invitados
> + RSVP). `seedBaseData` sincroniza el catálogo desactivando planes antiguos
> (Esencial/Premium/Invitados) sin borrarlos (referenciados por órdenes).

---

## Relaciones

- Depende de: m01 (capa `lib/payments`), m03 (products seed), m07 (publicación).
- Contexto: `brain/context/07_publicacion_y_pagos.md`.

---

## Decisiones

- **ADR-004:** publicación mediante pago confirmado.
- **ADR-007:** sin pasarela API; pagos simulados localmente (hasta el despliegue).
- Modelo pago único (plan.md §47); checkout como server action (misma ruta de
  validación que usaría un webhook real).

---

## Historial

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | Checkout `/dashboard/bodas/[id]/checkout` (productos activos, precio CLP, features) + acción `completeCheckoutAction` (createOrder → simulateSuccessfulPayment → publishWeddingAfterPaid → /w); productos y órdenes/estados ya en capa (m01/m03); typecheck + lint + build limpios | ✅ |
| 2026-09-06 | Admin: `productsRepo` ganó `findAll/update/delete`, CRUD de productos en `/admin/productos` (+ `ProductForm`), órdenes en `/admin/ordenes` (lista con filtros + detalle) vía `listAdminOrders` | ✅ |