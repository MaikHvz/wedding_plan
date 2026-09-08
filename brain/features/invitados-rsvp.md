# Feature: Invitados + RSVP e Invitaciones

> Gestión de invitados, envío de invitaciones por correo y confirmación de
> asistencia online, pensada como "el WhatsApp de la lista": el dueño agrega
> invitados, fija el cupo y ve por cada invitado si ya le envió el correo y si
> confirmó. El invitado responde desde un enlace público de su invitación.

---

## Metadata

- **Feature ID:** `F-011`
- **Módulo(s):** `m09` (extensiones)
- **Estado:** ✅
- **Fecha de creación:** 2026-09-06
- **Última actualización:** 2026-09-06

---

## Objetivo

Responder a la solicitud del usuario (P2): un panel para invitar personas a la
boda —con nombre y correo—, enviar las invitaciones cuando estén listas (email
a todos), que el invitado confirme online (con quién va + asiste o no) y que el
dueño control en un panel con checks por invitado (correo enviado / confirmó),
agrupando por quien los invitó y con un cupo máximo definido por el dueño.

El proveedor de correo aún no se gestiona: se deja la capa preparada.

## Filosofía / Enfoque

- **Email sin proveedor real:** todo el código usa una interfaz `EmailProvider`
  (`src/lib/email/index.ts`); hoy el único provider es consola (LOG en el
  servidor). Al desplegar se integra un transaccional (Resend/SES/Postmark)
  sin tocar el resto. (ADR-007, plan.md §66).
- **"La plantilla de boda envía el correo como invitación":** el email se
  estiliza con los tokens del tema elegido en el Builder (`theme.tokens['t-*']`),
  así la invitación luce como la página.
- **Un invitado = una invitación = un token.** Se crean juntos al agregar al
  invitado; el enlace público `/invitacion/<token>` es el único punto de RSVP.
- **Seguridad:** el panel solo es del dueño (`requireWeddingOwner`); el token
  es aleatorio (64 hex) y las respuesta de cupo se validan en el servidor.
- **Privacidad:** los datos de invitados son privados del dueño (plan.md §122).

## Flujo

```
Dueño (dashboard)
  /dashboard/bodas/[id]/invitados
  ├─ Define cupo máximo (0 = sin límite)
  ├─ Agrega invitados (nombre, correo, grupo) → invita-info@wedding.cl aviso
  │    · backend crea guest + invitation(token) ... status PENDING/INVITED
  ├─ (Opcional) edita / elimina invitados
  ├─ "Enviar correos" → sendPendingInvitations: a los que no tienen sentAt
  │    · construye email con el tema de la boda → EMAIL_PROVIDER (consola hoy)
  │    · guest.status SENT + invitation.status SENT + sent_at
  └─ Ve checks por invitado:
       ✓ Correo enviado / ✗ Correo no enviado
       ✓ Confirmó (Sí/No, con acompañantes) / ✗ Aún no confirma
       · agrupado por "quién invitó" (created_by)

Invitado (público)
  /invitacion/<token>
  ├─ Ve datos de la boda (pareja, fecha, hora, lugar, dirección)
  ├─ Marca asiste / no asiste
  ├─ Indica acompañantes (hasta el cupo restante)
  ├─ (Opcional) deja un mensaje
  └─ Submit → rsvp_responses (upsert por guest) → guest.status ACCEPTED/DECLINED
       → el panel del dueño se refresca con el nuevo estado
```

## Integración con el sistema principal

- **Builder (m04):** `Builder.tsx` ganó la prop `guestsHref`
  (default `/dashboard/bodas/${id}/invitados`) visible en la top bar como
  "Invitados". El modo admin la oculta con `guestsHref="#"` (los invitados son
  del dueño).
- **Renderer / temas (m02/m03):** el email usa `theme.tokens` (mismos nombres
  `t-bg`, `t-surface`, `t-accent`, `t-accent-soft`, `t-cta-bg`, `t-cta-text`,
  `t-muted`, `t-text` definidos en `lib/templates/themes.ts`).
- **Dashboard (m01):** cada card de boda en `/dashboard` tiene el botón
  "Invitados".
- **Datos (m01):** nuevos repos `guestsRepo`, `invitationsRepo`, `rsvpsRepo`
  registrados en `lib/data/index.ts`; migraciones `migrateMaxGuests()` y tablas
  nuevas por `migrateGuests()`.
- **Auth (m01):** todas las actions del panel validan dueño (`requireUser` +
  ownership); el RSVP público valida solo por token.
- **Config (m01):** `APP_URL`, `EMAIL_FROM`, `EMAIL_PROVIDER` en `src/config/app.ts`.

## Datos

- `guests`: `id, wedding_id, name, email, group_name, status, created_by,
  created_at, updated_at`; índice por `(wedding_id)` y `(created_by)`.
- `invitations`: `id, wedding_id, guest_id (UNIQUE), token (UNIQUE), status,
  sent_at, opened_at, created_at`; índice por `(wedding_id)` y `(token)`.
- `rsvp_responses`: `id, guest_id (UNIQUE), attendance ('yes'|'no'),
  companions_json, message, created_at, updated_at`; se consulta por guest y
  con JOIN a `guests` por wedding.
- `weddings`: nueva columna `max_guests INTEGER NOT NULL DEFAULT 0` (0 = sin
  límite), migración idempotente `migrateMaxGuests()` (patrón `migrateRoles`).
- Modelo completo: `brain/context/03_dominio_y_modelo_datos.md`.

## Reglas

- El cupo solo lo fija/actualiza el dueño; `max_guests = 0` = sin límite.
- `remaining` se calcula como `max - confirmados` (confirmados = asistentes +
  sus acompañantes). Sin límite → `remaining = null` (panel y form lo tratan
  como ilimitado).
- La validación de cupo es **en el servidor** (`submitRsvpAction`) con
  `MAX_COMPANIONS = 20`: `newParty = 1 + companions.length`.
- Un email se envía una sola vez: el envío masivo filtra `!invitation.sentAt`.
- El token se genera con `randomToken()` (64 hex); abrir el enlace marca
  `opened_at` la primera vez (analítica).
- Invitados confirmados son privados: nada de ello sale en `/w/[slug]`.
- Los forms son server actions con resultado tipado y revalidación de ruta.

## UX / Responsive

- Panel del dueño: tarjeta de **resumen tipo app** con anillo SVG de capacidad
  (`CapacityRing`), métricas (total/confirmados/pendientes/declinan), toolbar
  con búsqueda + filtros por estado/grupo, **tabla desktop / cards mobile** con
  checkboxes y envío masivo de seleccionados, alta/edición en **slide-over**,
  borrado con modal de confirmación, toasts y empty-states con CTA — **sin IDs
  ni tokens a la vista**: el token se reemplaza por "Copiar invitación" (copia
  la URL completa del enlace `/invitacion/<token>`).
- Animaciones propias de panel (slide-over, scale-in, toast) en `globals.css`,
  todas respetan `prefers-reduced-motion`.
- Form público: estilizado inline con los tokens del tema; radio asiste/no,
  agregar/quitar acompañantes; vista de "¡Listo!" con cambios de respuesta.
- Ambos usan Tailwind para identidad del producto; el RSVP usa tokens
  (`inline style`) para respetar el tema de la boda.
- El dashboard usa tarjetas de boda con estado en español, fecha del evento,
  cantidad total privada (sin slug/plantilla/versión) y acciones claras.

## Tests / Validación

- `npm run typecheck`: limpio ✅ (se agregó `maxGuests` a las bodas demo de
  `/demo` y `/plantillas/[slug]`).
- `npm run lint`: limpio ✅ (se removió el `useRef` del form de alta por la
  regla `react-hooks/refs`; reset por `key`).
- `npm run build`: ✅ rutas generadas `/dashboard/bodas/[id]/invitados` (ƒ) y
  `/invitacion/[token]` (ƒ).
- Runtime smoke (dev server): `/` 200; `/invitacion/<token-invalido>` 404;
  `/dashboard/bodas/<id>/invitados` sin sesión 307 → `/login`.
- Pendiente (runtime completo): login → crear boda → agregar invitados →
  enviar correos (ver `[email:console]` en la consola del servidor) → abrir
  `/invitacion/<token>` → confirmar con acompañantes → ver checks y cupo en el
  panel.

## Relaciones

- Depende de m01 (data/auth/schema), m02/m03 (tokens de tema para el email),
  m04 (Builder con `guestsHref`).
- Compatible con m07/m08: el flujo de invitados no toca publicación ni pagos;
  es Premium (plan.md §137).
- Contexto: `brain/context/01_vision.md` (P2), `02_arquitectura.md` (ADR-002,
  ADR-007 local→Supabase), `03_dominio_y_modelo_datos.md`, `08_seguridad_storage_seo.md`.
- Plan: `plan.md` secciones 55–67, 118–121, 137.

## Decisiones

- **Capa email con provider inyectable** (`EmailProvider`) y `console` por
  defecto: cumplir hoy con "no gestionar todavía el proveedor" pero dejar
  preparado el punto de integración (patrón de REEMPLAZO, no de reescritura).
- **Tokens del tema en el email:** el correo "es" la plantilla; se usa
  `theme.tokens` en vez de estilos fijos de campaña.
- **RSVP público por token únicamente** (sin login): balance UX vs seguridad
  de un enlace aleatorio de 64 hex; el dueño ve a quién envía cada correo.
- **`max_guests` como columna de `weddings`** (no tabla ni setting aparte):
  un solo valor por boda, migración idempotente.
- **Sin `useRef` en el form de alta:** reset por `key` remontando el form,
  exigido por la regla `react-hooks/refs` de Next 16.
- **Joins con alias** (`r.id AS id`) en `rsvpsRepo.findManyByWedding` para
  evitar el error SQLite `ambiguous column name: id`.

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-06 | Tipos `Guest`/`Invitation`/`RsvpResponse`/`GuestStatus` + `Wedding.maxGuests` | ✅ |
| 2026-09-06 | Schema: tablas `guests`, `invitations`, `rsvp_responses` + `migrateMaxGuests()` | ✅ |
| 2026-09-06 | Repos `guests`/`invitations`/`rsvps` + `randomToken()` + exports en `lib/data` | ✅ |
| 2026-09-06 | Capa email: `lib/email/index.ts` (provider console) + `buildInvitationEmail` con tema | ✅ |
| 2026-09-06 | Servicio `lib/guests/service.ts` (listado, cupo, envío, token) | ✅ |
| 2026-09-06 | Config `APP_URL`/`EMAIL_FROM`/`EMAIL_PROVIDER` + `.env.example` | ✅ |
| 2026-09-06 | Panel `/dashboard/bodas/[id]/invitados` (page + actions + `GuestManager`) | ✅ |
| 2026-09-06 | RSVP `/invitacion/[token]` (page + actions + `RsvpForm`) | ✅ |
| 2026-09-06 | Entradas: botón "Invitados" en card de `/dashboard` y top bar del Builder (`guestsHref`) | ✅ |
| 2026-09-06 | Verificación: typecheck + lint + build limpios; smoke runtime de rutas; fix `ambiguous column` en JOIN de rsvps | ✅ |
| 2026-09-06 | UX/UI completa: panel de invitados rediseñado (métricas + barra de cupo + avatares + "Copiar invitación" sin mostrar tokens), dashboard con `WeddingCard` (estados en español, fecha del evento, sin slug/plantilla), helpers `lib/ui/format.ts`, checkout con estado legible | ✅ |
| 2026-09-06 | UX/UI app-panel del gestor de invitados: tarjeta de resumen con anillo SVG de capacidad + métricas (total/confirmados/pendientes/declinan), toolbar con búsqueda, filtros por estado y grupo, tabla densa desktop + cards mobile, selección múltiple con envío masivo, panel slide-over para alta/edición, confirmación de borrado en modal, toasts animados y estados vacíos con CTA. Animaciones CSS en `globals.css` (slide-over, scale-in, toast) con `prefers-reduced-motion`. Verificado: typecheck + lint limpios. | ✅ |