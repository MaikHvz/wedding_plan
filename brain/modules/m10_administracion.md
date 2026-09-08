# Módulo m10 — Administración

> Panel de administración (P1) del SaaS. El admin opera sobre cualquier tenant:
> métricas, usuarios, bodas (lectura + edición completa), plantillas (CRUD),
> productos (CRUD), órdenes y publicaciones.
> Ver `brain/modules/_index.md` para el resumen global.

---

## Objetivo

Dar al operador del producto el control total sin tocar la base de datos:
supervisar el negocio, gestionar usuarios/roles, editar cualquier boda y
administrar catálogos (plantillas, productos) y operaciones (órdenes,
publicaciones).

---

## Alcance

- Dashboard `/admin` con métricas (usuarios, bodas, publicadas, órdenes, ingresos).
- Usuarios: lista, toggle rol, detalle (bodas + órdenes), eliminar.
- Bodas: lista filtrable, detalle, cambio de estado, eliminar, preview y edición
  con el Builder (cualquier tenant).
- Plantillas: CRUD completo.
- Productos: CRUD completo.
- Órdenes: lista filtrable + detalle.
- Publicaciones: lista con estado y fechas.

---

## Reglas

- Toda página pasa por `requireAdmin()` y cada server action revalida el rol.
- El admin no puede cambiar su propio rol ni eliminarse a sí mismo.
- La edición de bodas ajenas reutiliza el Builder del dueño (renderer único)
  y persiste solo datos (nunca HTML).
- Analítica básica (contadores SQL); sin funnel de eventos en esta versión.

---

## Progreso

| # | Feature | Estado |
|---|---------|--------|
| 1 | Panel de administración (F-010) | ✅ |

> Feature documentada: `brain/features/admin-panel.md`.
> Toques a módulos base: `role`/seed admin en m01; props de Builder en m04;
> `templatesRepo.findAll/delete` en m05; `productsRepo.findAll/update/delete` +
> órdenes en m08; lista de publicaciones en m07.

---

## Relaciones

- Depende de: m01 (auth/roles/seed), m04 (Builder), m05 (plantillas), m08
  (productos/órdenes), m07 (publicaciones).
- Contexto: `brain/context/01_vision.md` (P1), `brain/context/02_arquitectura.md`
  (ADR-002 renderer único), `brain/features/admin-panel.md`.

---

## Decisiones

- Rol `role` en `profiles` (default `'user'`), migración `migrateRoles()`;
  seed del primer admin dentro de `seedBaseData()` (async).
- Admin = lectura + edición completa; `saveWeddingPageAdminAction` como
  `saveAction` del Builder; `publishHref="#"` en admin.
- `lib/admin/queries.ts` concentra lecturas agregadas (stats + listados).

---

## Historial

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-06 | Fases 1–8: base (rol + `requireAdmin` + seed), dashboard de métricas, usuarios, bodas (+preview +edición admin), plantillas CRUD, productos CRUD, órdenes, publicaciones, Builder admin; typecheck + lint + build limpios (17 rutas `/admin`) | ✅ |