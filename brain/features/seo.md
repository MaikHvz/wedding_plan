# Feature: SEO y Posicionamiento Orgánico

> **Una feature por documento.**

---

## Metadata

- **Feature ID:** `F-013`
- **Módulo(s):** `m01` (Foundation), `m05` (Plantillas), `m07` (Publicación)
- **Estado:** 🚧
- **Fecha de creación:** 2026-09-06
- **Última actualización:** 2026-09-06

---

## Objetivo

Posicionar el producto en buscadores para el mercado LATAM (Chile primero,
después el resto vía MercadoPago) y generar tráfico orgánico hacia la landing,
el catálogo de plantillas y las páginas públicas de boda (`/w/[slug]`).
Palabras clave objetivo: "invitación digital de boda", "página web para
matrimonio", "rsvp boda online", "crear página de boda gratis", "sitio web de
boda".

## Filosofía / Enfoque

- **Cada página publicable tiene metadata propia** (title, description, OG,
  twitter, canonical).
- **Datos estructurados (schema.org JSON-LD)** para organizaciones, sitios,
  servicios y eventos de boda (mejora rich snippets en Google).
- **Publicar/No indexar** con criterio: lo público e informativo se indexa
  (landing, plantillas, demos SSG, páginas públicas de boda); lo privado o
  sensible se marca `noindex` (login, dashboard, admin, `/invitacion`).
- Las páginas de boda de los clientes son **indexables**: cada una es un
  backlink y tráfico orgánico de cola larga por pareja.

## Flujo

```
Google/Bing crawler
      ↓
robots.txt (permisos) + sitemap.xml (URLs)
      ↓
Páginas estáticas (SSG): /plantillas/[slug]
Páginas dinámicas: /, /plantillas, /demo, /w/[slug]
      ↓
Metadata por ruta (generateMetadata / export const metadata)
      ↓
JSON-LD inyectado en el <head>/<body> de cada página
```

## Integración con el sistema principal

- **`src/config/seo.tsx`**: constantes (`SITE_TITLE`, `SITE_DESCRIPTION`,
  `SITE_KEYWORDS`, plantilla de título) y helpers de schema (`organizationSchema`,
  `websiteSchema`, `serviceSchema`, `breadcrumbSchema`) + componente `JsonLd`.
- **`src/app/layout.tsx`**: `metadataBase` (resuelve canonicals/OG relativos),
  `title` con `default` + `template`, OG/twitter por defecto, robots global.
- **`src/app/sitemap.ts`**: `/`, `/plantillas` y cada `/plantillas/[slug]`
  (SSG del Template Engine). `dynamic = "force-dynamic"`.
- **`src/app/robots.ts`**: `allow: /` + `disallow: /login /dashboard /admin /invitacion`
  + referencia al sitemap.
- **`src/app/w/[slug]/page.tsx`**: `generateMetadata` enriquece título,
  descripción, canonical, OG y twitter con datos de la boda; `Event` JSON-LD
  (fecha/lugar) para rich snippet.
- **`src/app/plantillas/page.tsx`** y **`src/app/plantillas/[slug]/page.tsx`**:
  metadata + `BreadcrumbList` JSON-LD.
- **Noindex explícito**: `login`, `dashboard/layout`, `admin/layout`,
  `invitacion/[token]`, `demo`.

## Datos

- Ninguna tabla/campo nuevo: usa `APP_URL` (`src/config/app.ts`), registro de
  plantillas (`getAllTemplateConfigs`) y `weddings.findBySlug`.
- `metadataBase` depende de `APP_URL` — **al desplegar debe apuntar al dominio
  real** o canonicals/sitemap quedarán con `http://localhost:3000`.

## Reglas

- Las páginas públicas de boda (PUBLISHED) se indexan; EXPIRED/no publicadas
  devuelven `noindex`.
- `/demo` está `noindex` para evitar contenido duplicado con las demos SSG.
- No se debe exponer datos privados en metadata (invitados, ordenes).

## UX / Responsive

- Sin impacto visual; solo `<head>` (metadata/JSON-LD).

## Tests / Validación

- `npm run typecheck`, `npm run lint`, `npm run build` limpios.
- Smoke: `next start` → `/robots.txt`, `/sitemap.xml` (6 URLs) y `<head>` de
  `/` con title, description, robots, canonical, OG.

## Relaciones

- `brain/features/catalogo-plantillas.md` (demos SSG), `brain/features/publicacion.md`
  (página pública), `brain/features/invitados-rsvp.md` (`/invitacion`).

## Decisiones

- Sin OG image generada aún (futuro: `opengraph-image` por plantilla y por boda).
- Sitemap dinámico (no incluimos `/w/*` todavía porque las bodas expiran;
  evaluar cuando haya volumen y modelo de expiración ISR).

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2026-09-06 | Audit SEO + implementación base: `seo.tsx`, metadata raíz, sitemap, robots, schema JSON-LD (Organization/WebSite/Service/BreadcrumbList/Event), noindex en rutas privadas. Verificado: typecheck + lint + build. | 🚧 |