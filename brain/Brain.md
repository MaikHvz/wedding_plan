# Brain — Web de Boda

> **Este es el documento principal de contexto del proyecto.**
>
> Todo agente de IA (OpenCode, Claude Code, Cursor, ChatGPT, etc.) debe leer este
> documento **antes de realizar cualquier tarea** dentro del proyecto.
>
> Después debe seguir el orden de lectura definido en `brain/_index.md`.

---

## Proyecto

**Nombre de trabajo:** Web de Boda

**Visión:** Convertirse en "un Canva especializado en páginas web para bodas".

Es una plataforma **SaaS** que permite a una pareja crear una página web profesional
para su matrimonio **sin conocimientos de programación**. El usuario elige una
plantilla, la personaliza con un Web Builder visual, ve el resultado en tiempo real
y publica la página después de pagar.

**Mercado inicial:** Chile / LATAM.

---

## Idea central

```
UNA PAREJA
     ↓
ELIGE UNA PLANTILLA
     ↓
PERSONALIZA SU WEB
     ↓
VE EL RESULTADO
     ↓
SE ENAMORA DEL RESULTADO
     ↓
PAGA
     ↓
PUBLICA
     ↓
COMPARTE
```

---

## Propuesta de valor

Flujo comercial:

```
EXPLORAR
    ↓
ELEGIR PLANTILLA
    ↓
CREAR GRATIS
    ↓
PERSONALIZAR
    ↓
PREVIEW
    ↓
"PUBLICAR MI BODA"
    ↓
PAGO
    ↓
PÁGINA PÚBLICA
```

El usuario **no paga para construir** (Free Creation + Paid Publishing).
El pago ocurre únicamente cuando intenta **publicar**. Este es el principio
comercial central y el momento de monetización.

---

## Objetivo principal del MVP

El MVP no busca muchas funcionalidades. Busca validar:

> ¿Las parejas están dispuestas a pagar por publicar una página de boda que
> ellas mismas construyeron?

La funcionalidad más importante del MVP es el **Web Builder** (el corazón del producto).

---

## Prioridades del producto

| Prioridad | Elementos |
|-----------|-----------|
| **P0** | Web Builder, Template Engine, Renderer, secciones, temas, plantillas, preview, responsive, autosave, publicación, pago |
| **P1** | Google Maps, Google Drive, SEO, Open Graph, Dashboard, administración de plantillas |
| **P2** | Invitados, RSVP, Invitaciones, Email |
| **P3** | IA, dominios personalizados, analytics avanzados, marketplace, funciones adicionales |

**Principio:** No desarrollar funcionalidades secundarias antes de que el Web
Builder sea sólido.

```
BUILDER → TEMPLATES → RENDERER → PREVIEW → PUBLICACIÓN → PAGO
```

Una vez validado ese flujo:

```
INVITADOS → RSVP → INVITACIONES → EMAIL → IA
```

---

## Arquitectura (ESTADO ACTUAL vs FUTURO)

### Estado actual: Sistema local

> ⚠️ **IMPORTANTE — DECISIÓN VIGENTE (ADR-007):**
> Durante el desarrollo y el MVP **NO se utiliza Supabase ni servicios cloud**.
> Se utiliza un **sistema 100% local** (base de datos local / archivos locales)
> preparado con **una capa de abstracción de datos** para poder migrar a Supabase
> (PostgreSQL + Auth + Storage) posteriormente **sin reescribir la aplicación**.

**Stack local:**

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js Server Actions, Next.js Route Handlers (local)
- **Base de datos local:** SQLite (vía abstracción `lib/data`)
- **Auth local:** sesión/local simple (interfaz `lib/auth` reemplazable)
- **Storage local:** carpeta `public/` o `storage/` local
- **Pagos local (sin desplegar):** **sin pasarela de pago por API**, todo local
  **simulando pagos exitosos** (interfaz `lib/payments`)

### Futuro: Supabase (cuando se valide)

- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Deploy:** Vercel

> La clave es que **todo acceso a datos, auth, storage y pagos pasa por una
> capa de abstracción** (`lib/data`, `lib/auth`, `lib/storage`, `lib/payments`)
> con interfaces estables. Cambiar de local → Supabase solo cambia la
> implementación, no la aplicación.

---

## Principios de arquitectura

- **Domain First:** construir alrededor de `Template Engine`, `Renderer` y `Builder`.
- **Renderer único:** el mismo `WeddingRenderer` se usa en Demo, Builder, Preview y Página pública.
- **No almacenar HTML:** la página se guarda como configuración + contenido + secciones + tema + plantilla.
- **Templates versionados:** cada boda guarda `template_id` + `template_version`.
- **Server Components por defecto**; Client Components solo para interacción.
- **Lógica sensible (pagos, publicación, permisos, webhooks) siempre en servidor.**

---

## Lenguaje del dominio

- **Wedding:** página de boda de un usuario (una por pareja en MVP).
- **Template:** definición reutilizable de secciones + variantes + tema.
- **Template Engine:** motor que interpreta plantillas y produce una Wedding.
- **Web Builder (Builder):** editor visual por bloques para personalizar una Wedding.
- **WeddingRenderer:** componente central que convierte datos en página visual.
- **Section:** bloque de contenido (Hero, Couple, Story, Gallery, Countdown, Event, Location, Drive, Footer).
- **Variant:** variante visual de una section.
- **Theme:** paquete de estilos (colores, tipografías, botones, bordes, espaciado).
- **Preview:** vista que oculta las herramientas del Builder.
- **Publication:** proceso + estado que hace pública una Wedding tras el pago.
- **Order / Product:** modelo de monetización (Plan Esencial, Premium, Invitados).

---

## Reglas de negocio clave

1. El usuario puede **Crear, Editar y Preview sin pagar**.
2. El usuario **debe pagar para Publicar**.
3. La página pública (`/w/[slug]`) funciona **sin login**.
4. Nunca confiar en una variable `paid=true` del frontend: la publicación solo
   se activa cuando el **backend confirma el pago**.
5. Las plantillas deben poder versionarse sin romper páginas ya creadas.
6. El Builder queda restringido a Templates + Sections + Variants + Themes + Content
   (nada de CSS/HTML libre en MVP).
7. Un usuario solo accede a **sus propias bodas** (multi-tenancy).

---

## Módulos (núcleo técnico)

El **Web Builder, sistema de plantillas y Renderer** son el núcleo técnico.
Invitados, RSVP, emails e IA son **extensiones** del producto.

Módulos definidos (ver `brain/modules/_index.md` para el estado de cada uno):

```
m01_foundation
m02_renderer
m03_template_engine
m04_web_builder
m05_plantillas
m06_preview_responsive
m07_publicacion
m08_pagos
m09_extensiones         (invitados, RSVP, invitaciones, email, IA)
```

Cada cambio que agregue una feature debe:

1. Documentar la feature en `brain/features/<feature>.md`.
2. Actualizar el progreso del/los módulo(s) en `brain/modules/`.

Ver las skills **feature-doc** y **module-progress** en `brain/skills/` y en
`.opencode/skills/`.

---

## Convenciones

Todo documento de contexto nuevo debe seguir la misma estructura:

```
- Objetivo
- Filosofía
- Flujo
- Reglas
- Relaciones
- Decisiones
```

### Código

- TypeScript strict mode.
- Componentes: `PascalCase`.
- Variables: `camelCase`.
- Tablas (SQL futuro): `snake_case`.
- Tipos: `PascalCase`.

### Seguridad

- No almacenar contraseñas de Google, credenciales de Drive ni API keys en frontend.
- Validar URLs (slug, maps_url, drive_url).
- Validar archivos (tamaño, MIME, extensión, cantidad, propietario).
- RLS/permisos (en local se simula con reglas; en Supabase con RLS).

---

## Estado del proyecto

Véase `brain/modules/_index.md` para el detalle. Resumen:

| Módulo | Estado |
|--------|--------|
| Foundation | 🚧 Pendiente |
| Renderer | 🚧 Pendiente |
| Template Engine | 🚧 Pendiente |
| Web Builder | 🚧 Pendiente |
| Plantillas | 🚧 Pendiente |
| Preview Responsive | 🚧 Pendiente |
| Publicación | 🚧 Pendiente |
| Pagos | 🚧 Pendiente |
| Extensiones | 🚧 Pendiente |

---

## Cómo trabajar

- Los agentes nunca deben asumir reglas de negocio: si una regla no existe en la
  documentación, proponerla antes de implementar.
- No modificar documentos existentes sin respetar decisiones ya tomadas.
- Reutilizar conceptos existentes antes de crear nuevos; evitar duplicación.
- **Antes de escribir código:** verificar que existe documentación para la
  feature. Si no existe, primero diseñar el contexto (ver skill `feature-doc`).

---

## Documento fuente

El documento fuente completo de requerimientos es:

```
plan.md                                (raíz del proyecto)
```

Son 138 secciones que describen visión, problema, MVP, builder, plantillas,
pagos, roadmap, testing, backlog y reglas para la IA. Este `Brain.md` es un
resumen operativo; para detalles consultar `plan.md` y `brain/context/*`.
