# ADR-007 — Sistema local (NO Supabase) preparado para migrar

> **Fecha:** 2026-08-30
> **Estado:** Aceptado
> **Decisión vigente clave del proyecto.**

---

## Contexto

El `plan.md` original asumía Supabase (PostgreSQL + Auth + Storage) como base. Sin
embargo, durante el desarrollo y el MVP conviene un sistema **local** para reducir
costos y velocidad.

## Decisión

Usar un **sistema 100% local** durante el desarrollo y el MVP:

- Base de datos local (SQLite).
- Auth local/sesión simple.
- Storage local (archivos).
- Pagos: **sin pasarela de pago por API** mientras no desplegamos; todo local,
  **simulando pagos exitosos**.

**Preparado para migrar:** toda integración de infraestructura pasa por capas de
abstracción estables en `lib/*`:

```
lib/data      → SQLite local    → Supabase PostgreSQL
lib/auth      → local/sesión    → Supabase Auth
lib/storage   → local           → Supabase Storage
lib/payments  →  simulación local de pagos exitosos (hasta el despliegue) → pasarela real (API + webhooks) solo tras desplegar
lib/maps      → enlaces (no credenciales)
```

## Motivo

- Reducir costos y complejidad durante el MVP (plan.md §48 "evitar servicios innecesarios").
- Mantener la puerta abierta a Supabase (PostgreSQL) y Vercel en producción sin
  reescribir la aplicación.

## Consecuencias

- El código de la aplicación **nunca** importa Supabase directamente ni consulta
  tablas fuera de `lib/data`.
- Cambiar de local a Supabase = reemplazar la implementación interna de cada capa,
  manteniendo sus interfaces.
- Si un cambio exige tocar casi toda la app para migrar, la abstracción está mal hecha.
- **Pagos:** mientras no despleguemos NO hay pasarela de pago por API. Todo el
  procesamiento es local **simulando pagos exitosos** vía `lib/payments`. La
  pasarela real (API + webhooks) se integra solo tras el despliegue, manteniendo
  la regla de seguridad de que el backend controla la publicación.

## Verificación

- [ ] El proyecto arranca 100% local, sin credenciales cloud.
- [ ] Las capas `lib/*` exponen interfaces estables.
- [ ] No hay imports directos a Supabase fuera de las capas.

## Relaciones

- `brain/context/02_arquitectura.md`
- `brain/modules/m01_foundation.md`
- `brain/Brain.md`
