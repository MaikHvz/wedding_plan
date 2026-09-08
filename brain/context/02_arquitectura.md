# Contexto 02 — Arquitectura y Estructura del Proyecto

> Documento de contexto derivado de `plan.md` (secciones 48–51, 87–91, 108–117).
> **Incluye la decisión vigente de sistema local (ADR-007): NO usar Supabase
> durante el desarrollo; usar un sistema local preparado para migrar a Supabase.**

---

## Objetivo

Definir la arquitectura técnica del proyecto, la estructura de carpetas, las
convenciones de componentes y la estrategia local → Supabase. Es la referencia
que toda integración debe respetar.

---

## Filosofía de arquitectura

El núcleo técnico gira alrededor de **tres piezas**:

```
Template Engine  →  define la estructura de la página
WeddingRenderer  →  convierte los datos en página visual
Web Builder      →  permite al usuario editar esos datos
```

Regla fundamental del renderer: **un solo renderer** se usa en Demo, Builder,
Preview y Página pública. Esto evita que `Preview ≠ Página publicada`.

---

## Estado actual: sistema LOCAL (decisión vigente)

> ⚠️ **ADR-007 — Sistema local por ahora.**
>
> Mientras construimos el MVP **NO utilizamos Supabase**. Usamos un sistema
> **100% local** con una **capa de abstracción de datos** para poder migrar a
> Supabase (PostgreSQL + Auth + Storage) posteriormente **sin reescribir la app**.

### Stack local

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js Server Actions + Route Handlers (se ejecutan localmente)
- **Base de datos local:** SQLite (archivo local) accedida vía capa `lib/data`
- **Auth local:** sesión/local simple vía capa `lib/auth`
- **Storage local:** archivos en `storage/` o `public/uploads` vía capa `lib/storage`
- **Pagos local (sin desplegar):** **sin pasarela de pago por API**. Todo local,
  **simulando pagos exitosos** vía capa `lib/payments`. No se conecta a ningún
  proveedor de pagos real hasta el despliegue.

### Capas de abstracción obligatorias (clave para la migración)

Todo acceso a infraestructura debe pasar por estas capas **con interfaces
estables**, de modo que cambiar local → Supabase no toque la aplicación:

```
lib/auth/       →  interfaz de autenticación (local ahora, Supabase Auth después)
lib/data/       →  interfaz de datos/repositorios (SQLite ahora, PostgreSQL después)
lib/storage/    →  interfaz de archivos (local ahora, Supabase Storage después)
lib/payments/   →  interfaz de pagos (simulación local ahora; pasarela real solo tras el despliegue)
lib/maps/       →  validación y uso de Google Maps (enlaces, no credenciales)
```

**Regla:** el resto del código **nunca** importa Supabase directamente ni consulta
las tablas fuera de `lib/data`. Si un cambio requiere tocar casi toda la app para
cambiar de local a Supabase, la abstracción está mal hecha.

---

## Futuro: Supabase (cuando se valide el MVP)

- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Deploy:** Vercel

La migración consiste en reemplazar internamente cada capa local por su versión
Supabase, manteniendo las mismas interfaces.

---

## Arquitectura general

```
                     ┌──────────────┐
                     │    Usuario   │
                     └──────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Next.js    │
                    └───────┬───────┘
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
          ▼                 ▼                  ▼
      Dashboard          Builder           Public
          │                 │                  │
          └─────────────────┼──────────────────┘
                            │
                            ▼
                     Wedding Renderer
                            │
                            ▼
                     Capa de datos (lib/data)
                  ┌──────────┼──────────┐
                  │          │          │
                  ▼          ▼          ▼
              Base local   Auth      Storage
              (SQLite)    (local)    (local)
```

> En el futuro, la fila inferior cambia a PostgreSQL / Supabase Auth / Supabase
> Storage manteniendo las mismas capas.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx              ← Landing
│   ├── plantillas/           ← Catálogo y demos de plantillas
│   ├── dashboard/            ← Panel del usuario (bodas)
│   ├── w/                    ← Páginas públicas /w/[slug]
│   └── api/                  ← Route handlers (webhooks, etc.)
│
├── components/
│   ├── builder/              ← Builder, Sidebar, Canvas, editores
│   ├── wedding/              ← WeddingRenderer y cada sección
│   ├── templates/            ← Tarjetas, preview y selector de plantillas
│   ├── dashboard/            ← Componentes del dashboard
│   └── ui/                   ← Componentes base reutilizables
│
├── lib/
│   ├── auth/                 ← Capa de autenticación (local → Supabase)
│   ├── data/                 ← Capa de datos/repositorios (SQLite → PostgreSQL)
│   ├── wedding/              ← Lógica de dominio de bodas
│   ├── templates/            ← Template Engine
│   ├── payments/             ← Capa de pagos
│   ├── storage/              ← Capa de almacenamiento de archivos
│   └── maps/                 ← Google Maps (enlaces)
│
├── types/                    ← Tipos TypeScript del dominio
│
└── config/                   ← Configuración (temas, plantillas, etc.)
```

---

## Estructura de componentes

```
components/
├── builder/
│   ├── Builder.tsx
│   ├── BuilderSidebar.tsx
│   ├── BuilderCanvas.tsx
│   ├── SectionManager.tsx
│   ├── ThemeEditor.tsx
│   └── PreviewToolbar.tsx
│
├── wedding/
│   ├── WeddingRenderer.tsx
│   ├── HeroSection.tsx
│   ├── CoupleSection.tsx
│   ├── StorySection.tsx
│   ├── GallerySection.tsx
│   ├── CountdownSection.tsx
│   ├── EventSection.tsx
│   ├── LocationSection.tsx
│   ├── DriveSection.tsx
│   └── FooterSection.tsx
│
└── templates/
    ├── TemplateCard.tsx
    ├── TemplatePreview.tsx
    └── TemplateSelector.tsx
```

---

## Regla de componentes (Builder vs Renderer)

No poner toda la lógica en `Builder.tsx`. Dividir responsabilidades:

- **Builder** controla: estado, edición, interacción.
- **Renderer** controla: representación visual.

---

## Frontend / Backend

- **Server Components por defecto.**
- **Client Components** solo cuando se necesite: interacción, estado, eventos,
  drag/reorder, editor, preview interactiva.
- **Lógica sensible siempre en servidor:** pagos, publicación, permisos, webhooks,
  administración, IA con API keys.

---

## Variables de entorno

Ejemplo (secretos nunca al repositorio):

```
# Local
DATABASE_URL (SQLite)          → luego SUPABASE_URL
LOCAL_SESSION_SECRET           → luego lo maneja Supabase Auth

# Al migrar a Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Pagos / Email / IA
PAYMENT_SECRET
PAYMENT_WEBHOOK_SECRET
EMAIL_API_KEY
AI_API_KEY
```

---

## Environments / deployment

- **Desarrollo:** localhost.
- **Staging:** entorno separado (opcional, local).
- **Producción (futuro):** Vercel + Supabase.

---

## Código — convenciones

- TypeScript strict mode.
- Componentes `PascalCase`; variables `camelCase`; tablas (SQL futuro) `snake_case`; tipos `PascalCase`.

---

## Reglas y relaciones

- Toda integración pasa por las capas `lib/*` (ver ADR-007).
- Las secciones del renderer viven en `components/wedding`.
- El Builder en `components/builder`.
- El detalle de datos está en `brain/context/03_dominio_y_modelo_datos.md`.
- El detalle del renderer/builder está en `brain/context/06_web_builder_y_renderer.md`.

---

## Decisiones

- **ADR-007:** Sistema local hoy, Supabase mañana, con capas de abstracción.
- **ADR-002:** Renderer único para Demo, Builder, Preview y Página pública.
- **ADR-006:** Mobile-first (las invitaciones se consumen en móvil).
- **ADR-114/115 (plan.md):** Server Components por defecto; lógica sensible en servidor.
