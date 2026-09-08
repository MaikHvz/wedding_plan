# Contexto 07 — Publicación y Pagos

> Documento de contexto derivado de `plan.md` (secciones 38–47, 86, 95, 107).
> Incluye la decisión de **no usar pasarela de pago por API** mientras no
> despleguemos: todo es local, **simulando pagos exitosos**.

---

## Objetivo

Definir el flujo completo de publicación (que requiere pago) y el modelo de
productos/órdenes, garantizando la seguridad del pago (nunca confiar en el
frontend).

---

## Regla de pago FUNDAMENTAL

Nunca confiar en una variable enviada por el frontend (`paid=true`).

La publicación solo se activa cuando el **backend haya confirmado el pago**:

```
Frontend
↓
Checkout
↓
Proveedor de pagos
↓
Webhook
↓
Backend
↓
Validación
↓
Publication
```

---

## Estados de la boda (relevantes a publicación)

```
DRAFT            → siendo creada
READY            → contenido suficiente
PAYMENT_PENDING  → usuario inició publicación
PAID             → pago confirmado
PUBLISHED        → página pública activa
EXPIRED          → publicación expirada
ARCHIVED         → boda archivada
```

**No permitir saltos arbitrarios** entre estados.

---

## Flujo de publicación

```
Usuario termina página
        ↓
Preview
        ↓
Publicar
        ↓
Seleccionar producto
        ↓
Checkout
        ↓
Pago
        ↓
Webhook
        ↓
Backend valida
        ↓
Order = PAID
        ↓
Wedding = PUBLISHED
        ↓
URL pública (/w/[slug])
```

---

## Página pública

- `/w/[slug]`, ejemplo `/w/andrea-sebastian`.
- Funciona sin login.
- Con pago confirmado se genera la URL.

---

## Modelo de productos

- **Plan Esencial:** plantilla, Web Builder, personalización, fotografías, galería,
  countdown, ubicación, Google Maps, Google Drive, publicación.
- **Plan Premium:** todo lo anterior + más personalización/opciones de diseño.
- **Plan Invitados:** gestión de invitados, RSVP, invitaciones digitales, email.

Precios a validar con experimentos reales (LATAM).

---

## Monetización

```
CREAR GRATIS
↓
PUBLICAR PAGANDO
```

Pago único como modelo principal (la boda es un evento puntual), con productos
adicionales (dominio, extensión, invitados).

---

## Órdenes y publicaciones

- `orders`: guarda product_id, provider, provider_reference, amount, currency,
  status. El webhook confirma y se marca `Order = PAID`.
- `publications`: wedding_id, slug, status, published_at, expires_at.

Ver esquema completo en `brain/context/03`.

---

## Pagos en entorno local (sin desplegar — sin pasarela API)

- **Mientras no despleguemos NO hay pasarela de pago por API.**
- Todo el procesamiento es **local, simulando pagos exitosos**, a través de la
  capa `lib/payments`.
- El flujo backend → validación → publicación se ejecuta igual que en producción,
  pero el "pago" se simula localmente (por ejemplo, un botón de prueba que marca
  el pago como exitoso) **sin contactar a ningún proveedor real**.
- **Importante:** aunque el pago se simule localmente, la regla de seguridad se
  mantiene: la publicación solo se activa desde el **backend**, nunca por una
  variable del frontend.
- La pasarela real (API de un proveedor + webhooks) se integra **solo tras el
  despliegue**.

### Ejemplo de flujo simulado local

```
Usuario hace clic en "Pagar (simulado)"
        ↓
lib/payments registra pago exitoso (local)
        ↓
Backend valida (como si llegara webhook)
        ↓
Order = PAID
        ↓
Wedding = PUBLISHED
```

---

## Reglas

- No activar publicación desde el frontend; solo desde backend tras validar el webhook.
- Validar webhooks (firma/secret).
- Proteger endpoints; rate limiting.
- No almacenar credenciales de proveedores en frontend.

---

## Criterios de aceptación de publicación

```
[ ] usuario no pagado no puede publicar
[ ] checkout funciona
[ ] webhook funciona
[ ] pago validado
[ ] orden actualizada (PAID)
[ ] wedding publicada (PUBLISHED)
[ ] URL generada
[ ] página pública funciona
```

---

## Relaciones

- Modelo de datos en `brain/context/03`.
- Rutas (`/dashboard/.../checkout`, `/api/...`) en `brain/context/04`.
- Seguridad/almacenamiento en `brain/context/08`.
- Variables de entorno en `brain/context/02`.

---

## Decisiones

- **ADR-004:** publicación mediante pago confirmado (backend controla).
- **ADR-007:** sin pasarela de pago API mientras no desplegamos; pagos simulados localmente.
- Regla de pago server-side (plan.md §42, §86).
