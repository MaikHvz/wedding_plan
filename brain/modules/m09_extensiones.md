# Módulo m09 — Extensiones

> Invitados, RSVP, invitaciones, email e IA. **Son extensiones del producto, no del núcleo.**
> Ver `brain/modules/_index.md` para el resumen global.

---

## Objetivo

Ampliar el producto tras validar el flujo principal (P2/P3). El núcleo (Builder,
plantillas, renderer) debe estar sólido antes de construir estas extensiones.

---

## Alcance

- Gestión de invitados (agregar, editar, eliminar, buscar, filtrar).
- RSVP (aceptar/rechazar, acompañantes, mensaje).
- Invitaciones digitales (Invitation Builder, generación masiva).
- Email transaccional (proveedor externo).
- IA asistente del Builder (generar/mejorar historia, frases, tono).

---

## Reglas

- Estas features NO deben desarrollarse antes de que el Builder sea sólido (plan.md §7).
- Invitados/RSVP son módulo **Premium**.
- No crear servidor de correo propio; usar proveedor transaccional.
- Los datos de invitados son privados (plan.md §122).

---

## Progreso

| # | Feature | Estado |
|---|---------|--------|
| 1 | Gestión de invitados | ✅ |
| 2 | RSVP | ✅ |
| 3 | Invitaciones | ✅ |
| 4 | Email transaccional | 🚧 |
| 5 | IA asistente del Builder | 📝 |

> Feature documentada: `brain/features/invitados-rsvp.md` (F-011).
> **v1:** panel del dueño `[id]/invitados` (cupo, alta, edición, envío y checks
> por invitado, agrupado por creador), enlace en la card del dashboard y en la
> top bar del Builder (`guestsHref`). RSVP público en `/invitacion/[token]`
> (asiste/no + acompañantes + mensaje, validación de cupo en servidor).
> Email vía `lib/email` con provider inyectable (**consola hoy**, listo para
> transaccional). Invitados/RSVP son Premium.
> Verificado: typecheck + lint + build limpios; smoke runtime OK.
> **v2 UX Panel:** gestor de invitados como panel de aplicación — resumen con
> anillo de capacidad SVG + métricas, búsqueda y filtros por estado/grupo,
> tabla desktop / cards mobile, checkboxes con envío masivo, alta/edición en
> slide-over, confirmación de borrado, toasts y empty-states con CTA.

---

## Relaciones

- Depende de: flujo principal validado (m02–m08).
- Contexto: `brain/context/01_vision.md` (P2/P3), `plan.md` secciones 55–67, 118–121.

---

## Decisiones

- Flujo secundario: Invitados → RSVP → Invitaciones → Email → IA (plan.md §137).
- IA como asistente (genera opciones; el usuario elige) (plan.md §67).
- Email: capa `EmailProvider` con `console` por defecto; transaccional externo
  se integra luego sin reescrituras (ADR-007).
- El correo de invitación se estiliza con los tokens del tema de la boda
  ("la plantilla envía el correo").
