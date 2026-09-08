# Feature: Foundation (m01)

> Base técnica y capas de abstracción del Web de Boda.

---

## Metadata

- **Feature ID:** `F-001`
- **Módulo(s):** `m01_foundation`
- **Estado:** ✅
- **Fecha de creación:** 2026-08-30
- **Última actualización:** 2026-08-30

---

## Objetivo

Proveer el esqueleto del proyecto: tecnologías base, capas `lib/*` de acceso a
infraestructura y rutas principales, de modo que ningún otro módulo (renderer,
builder, plantillas, publicación, pagos) pueda construirse sin depender de
ellos.

## Filosofía / Enfoque

- **ADR-007:** sistema 100% local (SQLite, auth local, storage local, pagos
  simulados), preparado para migrar a Supabase/PostgreSQL **sin acoplar el
  código** a Supabase.
- Toda infraestructura se toca **solo** a través de capas de abstracción
  (`lib/data`, `lib/auth`, `lib/storage`, `lib/payments`, `lib/maps`). Las
  capas usan `server-only` para impedir fugas al cliente.
- Server Components por defecto; Client solo para interacción (forms,
  autosave del builder, etc.).

## Flujo

```
Landing/Plantillas/Login
   │
   ├─ lib/auth (signUp / signIn / requireUser) → cookie wwb_session → dashboard
   │
   ├─ lib/data (SQLite): profiles, sessions, weddings, sections, media,
   │   templates, products, orders, publications
   │
   └─ lib/payments (simulado) → createOrder → simulateSuccessfulPayment
            └─ lib/storage (local) → publicUrl /api/uploads/... (route handler)
            └─ lib/maps (validación Google Maps / Drive) → URLs externas
```

## Integración con el sistema principal

- **Datos:** `lib/data` expone `db` (singleton SQLite), `initSchema`,
  `seedBaseData` y 8 repositorios tipados (users, sessions, weddings, sections,
  templates, products, orders, publications).
- **Auth:** `lib/auth` (cookie httpOnly `wwb_session`, TTL 30 días,
  `requireUser` con redirect a `/login`), `lib/auth/password` (hash scrypt).
- **Storage:** `lib/storage` (guardado local, MIME permitidos, máx. 10 MB,
  sanitización de rutas); la URL pública la sirve `/api/uploads/[...path]`.
- **Pagos:** `lib/payments` (proveedor `simulated`; la pasarela real + webhook
  se integra **solo tras el despliegue**, ver ADR-007).
- **Maps:** `lib/maps` valida URLs HTTPS de Google Maps/Drive (sin claves).
- **Rutas base:** `/` (landing), `/plantillas`, `/login`, `/dashboard`,
  `/w/[slug]` (página pública placeholder hasta m02/m07), `/api/health`,
  `/api/uploads/[...path]`.

## Datos

Entidades creadas (`brain/context/03_dominio_y_modelo_datos.md`):
`profiles`, `sessions`, `weddings`, `wedding_sections`, `wedding_media`,
`templates`, `products`, `orders`, `publications`. SQLite con WAL y
`foreign_keys ON`; índices por token, user, slug, wedding.

Seed base (UPSERT por nombre): productos **Esencial** (19.990 CLP),
**Premium** (39.990 CLP), **Invitados** (14.990 CLP, inactivo).

## Reglas

- El backend controla siempre la publicación y el estado de pago (ADR-007).
- Contraseñas con hash scrypt (salt + clave 64 bytes), nunca en texto plano.
- Storage solo acepta MIME de imagen (jpeg/png/webp/gif/avif); rutas
  sanitizadas contra `..`; máximo configurable vía `LOCAL_MAX_UPLOAD_MB`.
- Sessions expiradas se limpian en cada lectura; cookie `secure` en prod.
- `.env` local con `LOCAL_SESSION_SECRET` y config; `.gitignore` excluye
  `.env*`, `data/` y `storage/`.

## UX / Responsive

Rutas base responsive: landing con header sticky + hero y secciones comprimidas
en móvil; dashboard en grid (1 → 2 → 3 columnas según breakpoint); login en 2
columnas en desktop, apilado en móvil; página pública centrada.
**v2 (landing):** redesign completo — hero con gradiente + CTAs, grilla de
previews de plantillas (engine), "Cómo funciona" (3 pasos), bloques de features,
testimonios, pricing (gratis / pago único) y CTA final + footer; todo
mobile-first y consumiendo `TemplatePreview` del engine.

## Tests / Validación

- `npm run typecheck`, `npm run lint`, `npm run build`: limpios.
- Smoke test E2E (ruta temporal, eliminada después) en runtime de Next:
  hash/verify de password, seed de productos, signUp/signIn, creación de boda,
  sección, orden + pago simulado, publicación, validación de maps, y
  roundtrip save/read/delete de storage — **todo ✅**.
- Rutas verificadas por HTTP: `/` 200, `/plantillas` 200, `/login` 200,
  `/dashboard` 307 → `/login` (sin sesión), `/w/no-existe` 404,
  `/api/uploads/no-existe` 404, `/api/health` 200 con counts.

## Relaciones

- Contexto: `brain/context/02_arquitectura.md`,
  `brain/context/03_dominio_y_modelo_datos.md`.
- Skills: `feature-doc`, `module-progress`.
- Permite: m02 (Renderer), m03 (Template Engine), m04 (Builder), m05
  (Plantillas), m07 (Publicación), m08 (Pagos).

## Decisiones

- **ADR-007** (local → Supabase): capas `lib/*` como frontera.
- `node:sqlite` (`DatabaseSync`) nativo en lugar de dependencia externa
  (verificado en Node v24.14.1; warning experimental en runtime).
- Scaffold de Next.js 16.3.3 creado en directorio temporal y movido a la
  raíz (por archivos existentes del Brain).
- `@types/node` actualizado (la v20 no tipa `node:sqlite`).
- Repos devuelven objetos de dominio; timestamps en ISO; IDs UUID.

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-08-30 | Proyecto Next.js 16.3.3 + TS + Tailwind, capas lib/* (data, auth, storage, payments, maps), rutas base, seed, `.env`, verificación typecheck/lint/build + smoke E2E | ✅ |
| 2026-09-01 | Rediseño de la landing `/` (UX/UI completa): hero + CTAs, previews de plantillas del engine, cómo funciona, features, testimonios, pricing y CTA final + footer; mobile-first | ✅ |