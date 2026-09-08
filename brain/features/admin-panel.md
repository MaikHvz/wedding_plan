# Feature: Panel de Administración

> Administración total (P1) del SaaS Web de Boda: métricas, usuarios,
> bodas (lectura + edición completa), plantillas (CRUD), productos (CRUD),
> órdenes y publicaciones. El admin opera sobre cualquier tenant.

---

## Metadata

- **Feature ID:** `F-010`
- **Módulo(s):** `m01` (foundation/auth), `m04` (builder admin), `m05`
  (plantillas CRUD), `m07` (publicaciones), `m08` (productos/órdenes)
- **Estado:** ✅
- **Fecha de creación:** 2026-09-06
- **Última actualización:** 2026-09-06

---

## Objetivo

Responder a la necesidad P1 de operar el SaaS: el administrador debe poder
supervisar métricas de negocio, gestionar usuarios y su rol, ver y **editar
cualquier boda** (aun de otros usuarios), administrar el catálogo de plantillas
y productos, y revisar órdenes y publicaciones sin tocar la BD.

## Filosofía / Enfoque

- **Multitenant:** cada usuario es dueño de sus bodas (`weddings.user_id`);
  el admin es un rol (`profiles.role = 'admin'`) que puede leer y escribir
  sobre cualquier registro, reutilizando las mismas capas del producto.
- **Renderer único:** el admin edita bodas ajenas con el **mismo `Builder`**
  del dueño; solo cambia la server action de guardado
  (`saveWeddingPageAdminAction`). Cero duplicación de UI de edición.
- **Seguridad por capas:** cada página admin pasa por `requireAdmin()` y cada
  server action repite el chequeo de rol (defensa en profundidad).
- **Seed automático:** el primer admin (`ADMIN_EMAIL` / env `ADMIN_PASSWORD`
  o `admin123`) se crea dentro de `seedBaseData()` (ahora async).
- **Analytics básicos:** contadores SQL directos (usuarios, bodas, publicadas,
  órdenes, ingresos PAID) + distribuciones y listas recientes. Sin tabla de
  eventos de funnel (P1).

## Flujo

```
Login admin (admin@webdeboda.cl) →
/admin (dashboard de métricas)
   ├─ Usuarios: lista + toggle rol (user/admin) + detalle (bodas + órdenes)
   ├─ Bodas: lista filtrable (estado/plantilla/búsqueda) → detalle
   │    ├─ cambiar estado / eliminar
   │    ├─ /admin/bodas/[id]/preview  (render limpio de la boda ajena)
   │    └─ /admin/bodas/[id]/edit     (Builder con saveAction admin)
   ├─ Plantillas: CRUD completo (listar, crear, editar, activar/desactivar, eliminar)
   ├─ Productos: CRUD completo
   ├─ Órdenes: lista filtrable (estado/búsqueda) + detalle
   └─ Publicaciones: lista (slug, boda, dueño, estado, fechas)
```

## Integración con el sistema principal

- **Auth (m01):** `profiles.role` (`'user' | 'admin'`), migración
  `migrateRoles()` en `lib/data/schema.ts`, `requireAdmin()`
  (`lib/auth/admin.ts`) protege el layout `/admin`. El seed admin vive en
  `lib/data/index.ts` (`seedAdminUser()`).
- **Builder (m04):** `Builder.tsx` acepta props `saveAction`, `homeHref`,
  `previewHref`, `publishHref`; el modo admin pasa `saveWeddingPageAdminAction`
  (extraída de `saveWeddingPageCore`, núcleo compartido con permiso dueño-o-admin).
  `publishHref="#"` en admin evita el checkout del dueño.
- **Plantillas (m03/m05):** `templatesRepo` ganó `findAll` + `delete`;
  las actions admin validan contra el registry (`lib/templates`) antes de
  crear/actualizar JSON sembrados.
- **Pagos (m08):** `productsRepo` ganó `findAll`, `update`, `delete`;
  `ordersRepo` se lee de forma agregada desde `lib/admin/queries.ts`.
- **Publicación (m07):** lectura de la tabla `publications` con joins a
  `weddings` + `profiles`.

## Datos

- `profiles`: nueva columna `role` (migración para DBs existentes).
- `weddings`: leídas con JOIN a `profiles` (owner) y agregaciones por estado.
- `orders`: JOIN con `profiles`, `weddings`, `products`.
- `publications`: JOIN con `weddings`, `profiles`.
- `templates` / `products`: CRUD directo vía repos.
- Modelo completo: `brain/context/03_dominio_y_modelo_datos.md`.

## Reglas

- El admin **no puede** cambiar su propio rol ni eliminarse a sí mismo.
- Toda acción admin valida rol en la server action (no solo en la página).
- El admin puede cambiar el estado de una boda ajena (DRAFT/READY/
  PAYMENT_PENDING/PAID/PUBLISHED/EXPIRED/ARCHIVED) — lee el `<select>`
  del FormData.
- Un admin puede guardar y publicar cualquier boda; sigue siendo solo-datos
  (nunca se guarda HTML).
- No se borran datos por cascada: eliminar usuario/boda/plantilla/producto
  es una operación administrada (deleción directa vía repos, sin triggers).

## UX / Responsive

- `/admin` comparte el layout neutral (sidebar `AdminSidebar` con secciones).
- Tablas con `overflow-x: auto` implícito; el layout base ya es responsive.
- Acciones destructivas con confirm (`confirm()` en forms de server action).

## Tests / Validación

- `npm run typecheck`, `npm run lint`: limpios ✅.
- `npm run build`: 17 rutas `/admin` generadas (dashboard, usuarios, bodas
  + edit/preview, plantillas CRUD, productos CRUD, órdenes, publicaciones).
- Pendiente (runtime): login como admin → recorrer cada sección → editar una
  boda ajena y verificar guardado + preview + publicación.

## Relaciones

- Depende de m01 (auth/roles), m02/m04 (Builder + renderer único para edición
  admin), m05 (plantillas), m08 (productos/órdenes).
- Contexto: `brain/context/01_vision.md` (P1), `brain/context/02_arquitectura.md`
  (ADR-002 renderer único, ADR-007 local→Supabase),
  `brain/context/03_dominio_y_modelo_datos.md`.
- Skills: `feature-doc`, `module-progress`.

## Decisiones

- **Rol en `profiles` con default `'user'`** (no nueva tabla): suficiente para
  GDC/`requireAdmin`; migración idempotente para DBs locales existentes.
- **Admin = lectura + edición completa** (decisión del usuario), reutilizando
  el Builder del dueño con `saveWeddingPageAdminAction`.
- **Analytics básicos** vía queries SQL agregadas en `lib/admin/queries.ts`.
- **Seed async:** `seedBaseData()` pasó a async (necesita `hashPassword`);
  todos los call sites usan `await`.
- **`saveWeddingPageCore` no exportada** desde el archivo `"use server"`
  (Next 16 exige async en exports de server actions); es función interna de
  `src/app/dashboard/bodas/[id]/actions.ts`.

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-06 | Fase 1: columna `role` + `migrateRoles()`, tipo `UserRole`, `requireAdmin()`, `seedAdminUser()` en `seedBaseData()` async | ✅ |
| 2026-09-06 | Fase 2: `lib/admin/queries.ts` (`getAdminStats`, listados), `app/admin/layout.tsx` + `AdminSidebar`, dashboard con métricas | ✅ |
| 2026-09-06 | Fase 3: usuarios (lista + detalle), `setUserRoleAction`, `deleteUserAction`; admin no puede tocarse a sí mismo | ✅ |
| 2026-09-06 | Fase 4: bodas (lista filtrable + detalle + estado + eliminar), `/admin/bodas/[id]/preview` | ✅ |
| 2026-09-06 | Fase 5: plantillas CRUD (`actions.ts`, lista, nueva, detalle, `TemplateForm`) | ✅ |
| 2026-09-06 | Fase 6: productos CRUD (`ProductForm`) + órdenes (lista + detalle) | ✅ |
| 2026-09-06 | Fase 7: publicaciones (lista con joins) | ✅ |
| 2026-09-06 | Fase 8: Builder admin — props `saveAction/homeHref/previewHref/publishHref`, `saveWeddingPageCore`, `saveWeddingPageAdminAction`; fix "Server Actions must be async" (`saveWeddingPageCore` no exportada); typecheck + lint + build limpios, 17 rutas `/admin` | ✅ |