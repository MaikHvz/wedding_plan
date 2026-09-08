# Contexto 04 — Rutas de la Aplicación

> Documento de contexto derivado de `plan.md` (secciones 8–11, 38–39, 96–100).

---

## Objetivo

Definir las rutas (URLs) de la aplicación, tanto públicas como autenticadas, y su
propósito. Cada ruta corresponde a una pieza del sistema.

---

## Rutas públicas (sin login)

### Landing (`/`)

- página principal
- propuesta de valor
- ejemplos
- plantillas
- demos
- precios
- CTA principal: **Crear mi página**
- CTA secundario: **Ver plantillas**

### Catálogo de plantillas (`/plantillas`)

- muestra las plantillas disponibles
- cada tarjeta: preview, nombre, categoría, descripción, botones
  "Ver demo" y "Usar plantilla"

### Demo de plantilla (`/plantillas/[slug]`)

- demo completa con datos ficticios (nombres, fecha, fotos, historia, evento,
  ubicación, galería, countdown, footer)
- objetivo: generar deseo ("quiero que mi página se vea así")
- usa el mismo `WeddingRenderer`

### Página pública de una boda (`/w/[slug]`)

- ejemplo: `/w/andrea-sebastian`
- funciona **sin login**
- ejemplo de SEO/OG: `Andrea & Sebastián | Nuestra boda`

---

## Rutas autenticadas

### Dashboard (`/dashboard`)

- listado "Mis bodas"
- por boda: nombre, fecha, estado, botones Editar / Preview

### Boda publicada (`/dashboard/bodas/[id]`)

- estado PUBLICADA
- URL pública
- acciones: Ver página, Editar, Compartir (copiar enlace)

### Builder / Edición (`/dashboard/bodas/[id]/builder`)

- Web Builder
- Canvas + Sidebar
- responsive (Desktop / Tablet / Mobile)

### Preview (`/dashboard/bodas/[id]/preview`)

- preview limpia que oculta herramientas del builder
- parece una página real

---

## Rutas conceptuales clave (resumen)

```
/                                   Landing
/plantillas                         Catálogo
/plantillas/[slug]                  Demo de plantilla
/w/[slug]                           Página pública (sin login)
/dashboard                          Dashboard
/dashboard/bodas/[id]               Detalle boda
/dashboard/bodas/[id]/builder       Web Builder
/dashboard/bodas/[id]/preview       Preview
/api/...                            Route handlers (checkout, webhooks)
```

---

## Reglas

- La **Preview** debe ocultar las herramientas del Builder y parecer una página real.
- La **página pública** (`/w/[slug]`) funciona sin login y con los mismos datos
  que el builder (renderer único).
- Compartir inicialmente = **copiar enlace** (WhatsApp/email/redes son futuros).

---

## Relaciones

- El renderer alimenta demo, builder, preview y pública (`brain/context/06`).
- SEO/Open Graph por página pública (`brain/context/08`).

---

## Decisiones

- Página pública en `/w/[slug]` (plan.md §39).
- Demo por plantilla en `/plantillas/[slug]` (plan.md §11).
