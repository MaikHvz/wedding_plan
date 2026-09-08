# Contexto 08 — Seguridad, Storage y SEO

> Documento de contexto derivado de `plan.md` (secciones 32–34, 58–63, 113–117).
> Refleja el sistema local actual con vistas a Supabase (RLS, Storage).

---

## Objetivo

Definir la seguridad (permisos, validación), el manejo de almacenamiento de
archivos (Google Maps/Drive + imágenes) y el SEO/Open Graph de las páginas públicas.

---

## Google Maps y Google Drive (por enlace)

- **Google Maps:** la pareja coloca un enlace `https://maps.google.com/...`.
  La plataforma valida que sea una URL válida. **No almacenar credenciales de Google.**
- **Google Drive:** enlace `https://drive.google.com/...`. La plataforma **no
  reemplaza** Drive: solo da un apartado para compartir el enlace.

### Instrucciones para Google Drive (en el Builder)

```
¿Cómo agregar tu Google Drive?
1. Crea una carpeta en Google Drive.
2. Coloca ahí el contenido a compartir.
3. Abre las opciones de compartir.
4. Configura los permisos.
5. Copia el enlace.
6. Pega el enlace aquí.
7. Comprueba que funciona.
8. Publica tu página.
```

Advertencia: el acceso depende de los permisos configurados en Drive.
**Nunca solicitar** contraseña, credenciales ni tokens privados.

---

## Seguridad / Permisos

Objetivo (local y Supabase):

- Cada usuario solo accede a sus propias bodas (multi-tenancy).
- En local: cada repositorio (`lib/data`) filtra por `user_id` (emula RLS).
- En Supabase: se aplica **Row Level Security** (RLS).

Concepto:

```
User A → Wedding A
User B → Wedding B
```

Requisitos de seguridad:

- RLS / autorización server-side
- validación de datos, archivos y URLs
- rate limiting
- protección de endpoints
- webhooks verificados

Validar URLs: `slug`, `maps_url`, `drive_url`. Evitar esquemas no permitidos.

**Nunca almacenar:** contraseñas de Google, credenciales de Drive, API keys en frontend.

---

## Storage (imágenes)

Las imágenes subidas por el usuario se almacenan localmente hoy, y en Supabase
Storage en el futuro, a través de la capa `lib/storage`.

### Estructura conceptual de rutas

```
weddings/
    wedding-id/
        gallery/
        hero/
        couple/
```

### Reglas de storage

- Los archivos pertenecen a una boda; la ruta incluye el `wedding_id`.
- Nunca permitir que un usuario acceda a archivos de otra boda.
- Controlar: tamaño, tipo MIME, extensión, cantidad, usuario propietario.

### Optimización de imágenes

- compresión
- thumbnails
- lazy loading
- formatos modernos
- tamaños responsive
- no cargar todos los originales inmediatamente

---

## SEO y Open Graph (páginas públicas)

Cada página pública (`/w/[slug]`) genera:

```
title
description
canonical
Open Graph
```

Ejemplo de title: `Andrea & Sebastián | Nuestra boda`.

**Open Graph:** al compartir `https://dominio/w/andrea-sebastian`, debe existir
preview visual con título, descripción e imagen. Importante para redes sociales
y aplicaciones de mensajería.

---

## Reglas

- Server-side para toda lógica sensible.
- Validar URLs y archivos.
- Ruta de archivo contiene `wedding_id`.
- Open Graph por página pública.

---

## Relaciones

- Almacenamiento vía `lib/storage` (local → Supabase) (`brain/context/02`).
- Publicación/pagos en `brain/context/07`.
- Rutas públicas en `brain/context/04`.

---

## Decisiones

- **ADR-005:** Google Drive mediante enlace (no sincronizar).
- **ADR-007:** storage local hoy, Supabase Storage después (vía `lib/storage`).
- Validación de URLs y RLS/permisos (plan.md §58–59, §117).
