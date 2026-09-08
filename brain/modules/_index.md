# 📊 Índice de Módulos y Progreso — Web de Boda

> **Este es el registro central del estado del sistema.**
>
> En cada cambio que implemente una feature, el agente debe:
> 1. Actualizar el estado de la feature aquí.
> 2. Actualizar el documento del módulo correspondiente (`brain/modules/mXX_*.md`).
> 3. Documentar la feature en `brain/features/<feature>.md`.
>
> Ver la skill **module-progress** (`brain/skills/module-progress.md` y
> `.opencode/skills/module-progress/SKILL.md`).

---

## Leyenda de estados

| Ícono | Estado | Significado |
|-------|--------|-------------|
| 📝 | Pendiente | No iniciado |
| 🚧 | En progreso | En desarrollo / parcial |
| ✅ | Finalizado | Completado y verificado |

---

## Resumen de módulos

| Código | Módulo | Estado | Features |
|--------|--------|--------|----------|
| m01 | Foundation | ✅ | 4/4 |
| m02 | Renderer | ✅ | 17/17 |
| m03 | Template Engine | ✅ | 4/4 |
| m04 | Web Builder | ✅ | 6/6 |
| m05 | Plantillas | ✅ | 9/9 |
| m06 | Preview Responsive | ✅ | 4/4 |
| m07 | Publicación | ✅ | 4/4 |
| m08 | Pagos | ✅ | 4/4 |
| m09 | Extensiones | ✅ | 4/5 |
| m10 | Administración | ✅ | 1/1 |

---

## Estado detallado por módulo

### m01 — Foundation ✅
Base: Next.js, TypeScript, Tailwind, capas `lib/*` (data, auth, storage, payments), SQLite local, rutas base.

| # | Feature | Estado |
|---|---------|--------|
| 1 | Configurar proyecto Next.js + TS + Tailwind | ✅ |
| 2 | Capa de datos local (SQLite) vía `lib/data` | ✅ |
| 3 | Capa de auth local vía `lib/auth` | ✅ |
| 4 | Estructura de rutas base (landing, dashboard, w, api) | ✅ |

> Feature documentada: `brain/features/foundation.md` y
> `brain/features/seo.md` (F-013, posición orgánica: metadata, sitemap, robots,
> JSON-LD).

---

### m02 — Renderer ✅
`WeddingRenderer` + componentes de sección (Hero, Couple, Story, Gallery, Countdown, Event, Location, Drive, Footer). Ambientación por plantilla.

| # | Feature | Estado |
|---|---------|--------|
| 1 | Componente `WeddingRenderer` | ✅ |
| 2 | Sección Hero | ✅ |
| 3 | Sección Couple | ✅ |
| 4 | Sección Story | ✅ |
| 5 | Sección Gallery | ✅ |
| 6 | Sección Countdown | ✅ |
| 7 | Sección Event | ✅ |
| 8 | Sección Location | ✅ |
| 9 | Sección Drive | ✅ |
| 10 | Sección Footer | ✅ |
| 11 | Ambientación por plantilla (`Motifs.tsx` + `templateId`) | ✅ |
| 12 | Fondos fiables con Ken Burns (`BackgroundImage`) | ✅ |
| 13 | Animaciones por scroll (`Reveal`) + destellos (Sparkles) | ✅ |
| 14 | Música ambiental (`MusicPlayer`) | ✅ |
| 15 | Sección Dresscode | ✅ |
| 16 | Galería interactiva (lightbox + zoom + masonry) | ✅ |
| 17 | Firma animada por plantilla + tipografía editorial + watermark | ✅ |

> Feature documentada: `brain/features/renderer.md` y
> `brain/features/ambientacion-interactiva.md`.
> **v2.1:** `templateId` llega a las secciones; fondos + divisores ambientales
> y variantes con layouts reales (m05).
> **v2.2 (ambientación interactiva):** Ken Burns, reveal por scroll, hero
> escalonado, música ambiental, dresscode, galería lightbox, countdown flip,
> pull-quote/drop-cap, SectionDivider grande, watermark footer y firma por
> plantilla (cursor urbana, trail elegance). SSR-safe + reduced-motion.

---

### m03 — Template Engine ✅
Definición, versionado, variantes y temas de plantillas.

| # | Feature | Estado |
|---|---------|--------|
| 1 | Motor de plantillas (`lib/templates`) | ✅ |
| 2 | Sistema de variantes | ✅ |
| 3 | Sistema de temas | ✅ |
| 4 | Versionado de plantillas | ✅ |

> Feature documentada: `brain/features/template-engine.md`.
> Plantilla inicial `elegance.json` sembrada; las 5 del catálogo en m05.

---

### m04 — Web Builder ✅
Editor por bloques (Sidebar + Canvas), editores de contenido/secciones/temas, autosave.

| # | Feature | Estado |
|---|---------|--------|
| 1 | Layout Builder (Sidebar + Canvas) | ✅ |
| 2 | Editor de contenido | ✅ |
| 3 | Editor de secciones | ✅ |
| 4 | Editor de temas | ✅ |
| 5 | Autosave (debounce) | ✅ |
| 6 | Upload de imágenes | ✅ |

> Feature documentada: `brain/features/web-builder.md`.
> Pendiente runtime: smoke de edición → autosave → página pública (dev server).

---

### m05 — Plantillas ✅
Catálogo, demos y las plantillas vigentes (estructura propia + recolor por tema + ambientación real).

| # | Feature | Estado |
|---|---------|--------|
| 1 | Catálogo `/plantillas` (con swatches + filtros) | ✅ |
| 2 | Demo `/plantillas/[slug]` | ✅ |
| 3 | Plantilla 01 Elegance (base, recolorizable) | ✅ |
| 4 | Plantilla 02 Boho | ✅ |
| 5 | Plantilla 03 Urbana | ✅ |
| 6 | Plantilla 04 Clásica | ✅ |
| 7 | Plantilla 05 Costa | ✅ |
| 8 | Ambientación visual real (motivos + variantes implementadas) | ✅ |
| 9 | Firma por plantilla (musicUrl, countdown flip, dresscode, cursor/trail) | ✅ |

> Feature documentada: `brain/features/catalogo-plantillas.md`.
> **v2:** las plantillas de la 1ª generación se fusionaron como paletas de
> `elegance`; el color (`themeId` + `suggestedThemeIds`) se repinta con swatches
> en cada tarjeta y se elige al "Usar plantilla". Demos SSG (5).
> **v2.1:** cada plantilla tiene ambientación propia (`Motifs.tsx`): guirnaldas
> garden, arcos+mandala boho, geométrico urbana, laurel clásica, olas costa,
> líneas finas elegance; las variantes de `SECTION_VARIANTS` se implementan con
> layouts distintos en las 9 secciones.
> **v2.2:** firma por plantilla — `musicUrl` + dresscode en los 5 JSON, countdown
> `flip` (costa), cursor custom (urbana), rastro de chispas (elegance).

---

### m06 — Preview Responsive ✅
Preview limpia + conmutación Desktop/Tablet/Mobile.

| # | Feature | Estado |
|---|---------|--------|
| 1 | Vista Desktop | ✅ |
| 2 | Vista Tablet | ✅ |
| 3 | Vista Mobile | ✅ |
| 4 | Preview limpia (`/preview`) | ✅ |

> Feature documentada: `brain/features/preview-responsive.md`.
> Vistas 1–3 en el Builder (BuilderCanvas); preview limpia en
> `/dashboard/bodas/[id]/preview` (owner, noindex).

---

### m07 — Publicación ✅
Estados de la boda, flujo de publicación, publicación/página pública.

| # | Feature | Estado |
|---|---------|--------|
| 1 | Estados de la boda | ✅ |
| 2 | Flujo de publicación | ✅ |
| 3 | Página pública `/w/[slug]` | ✅ |
| 4 | Publicación solo tras pago confirmado | ✅ |

> Feature documentada: `brain/features/publicacion.md`.
> Máquina de estados `lib/wedding/publish.ts`; `/w/[slug]` solo PUBLISHED.

---

### m08 — Pagos ✅
Productos, checkout, webhooks, órdenes. **Sin pasarela API: pagos simulados localmente.**

| # | Feature | Estado |
|---|---------|--------|
| 1 | Modelo de productos | ✅ |
| 2 | Checkout | ✅ |
| 3 | Webhook y validación server-side | ✅ |
| 4 | Órdenes y estados | ✅ |

> Feature documentada: `brain/features/pagos-checkout.md`.
> Checkout `/dashboard/bodas/[id]/checkout` con pago simulado (backend).
> Expiración: checkout aplica `applyExpiryIfDue` para permitir re-publicar
> bodas vencidas (EXPIRED) con nueva orden PAID.

---

### m09 — Extensiones ✅
Invitados, RSVP, invitaciones, email, IA (P2/P3 — extensiones del producto).

| # | Feature | Estado |
|---|---------|--------|
| 1 | Gestión de invitados | ✅ |
| 2 | RSVP | ✅ |
| 3 | Invitaciones | ✅ |
| 4 | Email transaccional | 🚧 |
| 5 | IA asistente del Builder | 📝 |

> Feature documentada: `brain/features/invitados-rsvp.md` (F-011).
> **v1:** invitados + RSVP completos (P2). Panel del dueño en `[id]/invitados`
> (cupo `max_guests`, alta/edición/eliminación, envío individual y masivo por
> email con el tema de la boda, checks "correo enviado / confirmó", agrupado
> por quien invitó). RSVP público `/invitacion/[token]` (asiste/no +
> acompañantes + mensaje, cupo validado en servidor). Email con provider
> inyectable — **consola hoy**, listo para transaccional (Resend/SES/Postmark).
> Entradas: card del dashboard + top bar del Builder (`guestsHref`). Invitados/
> RSVP son Premium. Verificado: typecheck + lint + build limpios.

---

### m10 — Administración ✅
Panel admin P1 (F-010): dashboard, usuarios, bodas (lectura + edición completa),
plantillas CRUD, productos CRUD, órdenes, publicaciones.

| # | Feature | Estado |
|---|---------|--------|
| 1 | Panel de administración | ✅ |

> Feature documentada: `brain/features/admin-panel.md`.
> Base (rol + seed admin) en m01; Builder admin en m04; registros tocados en
> m05, m07 y m08. En vivo: entrar como `admin@webdeboda.cl`
> (`ADMIN_PASSWORD` env o `admin123`) → `/admin`.

---

## Features por documentar

Cada feature implementada debe tener su documento en `brain/features/`.
Ver `brain/features/_template.md` para el formato.

---

## Último cambio registrado

- **Fecha:** 2026-09-06
- **Feature:** Identidad de marca "Web de Boda" · dominio `webdeboda.cl` (m01)
- **Módulo(s) afectado(s):** m01 (fundación)
- **Resumen:** Siguiendo la investigación de dominio (ver `brain/features/seo.md`
  y decisiones de dominio en el chat), el producto adopta la marca **Web de Boda**
  y el dominio `webdeboda.cl`. `APP_NAME` → "Web de Boda" (títulos de SEO,
  `<application-name>`, `og:site_name`, header/eyebrow/footer de la landing, panel
  admin, páginas públicas y fallback del footer de los sitios de boda);
  `EMAIL_FROM` default → `no-reply@webdeboda.cl` y `ADMIN_EMAIL` →
  `admin@webdeboda.cl` (`src/config/app.ts`, `.env.example`, email de invitación,
  metadata de `/invitacion`, `/demo`, `/plantillas/[slug]`, `/w/[slug]` y docs
  en `brain/`). Se centralizó el uso de `APP_NAME` en los componentes que
  mostraban el literal. `APP_URL` real se seteará al desplegar (el SEO —
  canonicales, sitemap, OG, metadataBase — se resuelve solo). Verificado:
  typecheck + lint + build limpios.

> ⚠️ Mantener esta sección actualizada en cada cambio para tener siempre contexto del sistema.
