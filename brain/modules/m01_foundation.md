# Módulo m01 — Foundation

> Base del proyecto. Ver `brain/modules/_index.md` para el resumen global.

---

## Objetivo

Configurar el esqueleto del proyecto: tecnologías base, capas de abstracción y
rutas principales. Sin esto ningún otro módulo puede construirse.

---

## Alcance

- Next.js (App Router) + React + TypeScript strict + Tailwind CSS.
- Capas de abstracción en `lib/`: `data`, `auth`, `storage`, `payments`, `maps`.
- Persistencia local SQLite vía `lib/data`.
- Auth local vía `lib/auth`.
- Rutas base: `/`, `/plantillas`, `/dashboard`, `/w/[slug]`, `/api`.

---

## Reglas

- **ADR-007:** sistema local; Supabase solo al migrar (nunca acoplar código a Supabase).
- Todo acceso a infraestructura pasa por las capas `lib/*`.
- Server Components por defecto; Client solo para interacción.

---

## Progreso

| # | Feature | Estado |
|---|---------|--------|
| 1 | Configurar proyecto Next.js + TS + Tailwind | ✅ |
| 2 | Capa de datos local (SQLite) vía `lib/data` | ✅ |
| 3 | Capa de auth local vía `lib/auth` | ✅ |
| 4 | Estructura de rutas base (landing, dashboard, w, api) | ✅ |

> Detalle de la implementación: `brain/features/foundation.md` y
> `brain/features/admin-panel.md` (roles/seed admin).

---

## Relaciones

- Depende de: nada (es la base).
- Permite: todos los demás módulos.
- Contexto: `brain/context/02_arquitectura.md`, `brain/context/03_dominio_y_modelo_datos.md`.

---

## Decisiones

- **ADR-007:** local → Supabase con capas de abstracción.
- Estructura de carpetas según `brain/context/02`.
- Landing `/` rediseñada (UX/UI): hero, previews de plantillas del engine,
  cómo funciona, features, testimonios, pricing, CTA final + footer.

## Historial

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-01 | Rediseño completo de la landing `/` (UX/UI mobile-first) | ✅ |
| 2026-09-06 | Admin: columna `role` en `profiles` + `migrateRoles()` (DBs existentes), `lib/auth/admin.ts` (`requireAdmin`), seed del primer admin en `seedBaseData()` (async); base del panel F-010 | ✅ |
| 2026-09-06 | Identidad de marca "Web de Boda" · dominio `webdeboda.cl` (`APP_NAME`, `EMAIL_FROM`, `ADMIN_EMAIL` en `src/config/app.ts`; literales en landing, admin, páginas públicas, email de invitación y docs `brain/`) | ✅ |
