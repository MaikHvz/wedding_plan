# Contexto 03 — Dominio y Modelo de Datos

> Documento de contexto derivado de `plan.md` (secciones 22–24, 54–60, 95, 108,
> 125–126). Refleja la decisión de **sistema local (SQLite) hoy con un esquema
> PostgreSQL planificado para la futura migración a Supabase**.

---

## Objetivo

Definir el lenguaje del dominio, las entidades del modelo de datos y cómo se
persisten con el sistema local actual, manteniendo el destino PostgreSQL/Supabase.

---

## Regla fundamental del modelo

**La página NO se almacena como HTML.** Se almacena como:

```
Configuración
+ Contenido
+ Secciones
+ Tema
+ Plantilla
```

Después el **WeddingRenderer** transforma esos datos en la página.

### Ejemplo del modelo de una boda (datos)

```json
{
  "template": "elegance",
  "templateVersion": 1,
  "theme": "ivory",
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "variant": "fullscreen",
      "position": 1,
      "enabled": true,
      "data": {
        "title": "Nuestra boda",
        "partner1": "Andrea",
        "partner2": "Sebastián"
      }
    }
  ]
}
```

---

## Persistencia local (SQLite)

Con el sistema local se utiliza **SQLite** con una capa de repositorios en
`lib/data`. Cada entidad del dominio tiene su tabla local y un repositorio que
expone métodos (create, get, update, delete, find). **Estos repositorios son la
interfaz estable** que luego se reimplementa sobre PostgreSQL/Supabase.

Estructura local típica:

```
data/                      (carpeta de datos local, no versionada excepto schema)
  wedding.db               (SQLite)
```

---

## Modelo de datos objetivo (PostgreSQL — destino futura migración)

> Este esquema es el **destino** en Supabase. En local se reproduce en SQLite con
> las mismas tablas/columnas para que la migración sea directa por repositorio.

### profiles

```
id           (uuid)
email
name
created_at
updated_at
```

### weddings

```
id
user_id
title
partner_1
partner_2
event_date
event_time
location_name
location_address
maps_url
drive_url
slug
status
template_id
template_version
theme_json
created_at
updated_at
published_at
expires_at
```

### wedding_sections

```
id
wedding_id
type
variant
position
enabled
data_json
created_at
updated_at
```

### wedding_media

```
id
wedding_id
storage_path
alt_text
position
created_at
```

### templates

```
id
slug
name
description
category
preview_url
config_json
version
is_active
created_at
updated_at
```

### products

```
id
name
description
price
currency
duration_days
features_json
active
```

### orders

```
id
user_id
wedding_id
product_id
provider
provider_reference
amount
currency
status
created_at
paid_at
```

### publications

```
id
wedding_id
slug
status
published_at
expires_at
```

---

## Tablas futuras (extensiones)

### guests (P2)

```
id
wedding_id
name
email
phone
group_name
status
created_at
updated_at
```

### rsvp_responses (P2)

```
id
guest_id
attendance
companions
message
created_at
updated_at
```

### invitations (P2)

```
id
wedding_id
guest_id
token
status
sent_at
opened_at
created_at
```

---

## Estados de la boda

```
DRAFT            → siendo creada
READY            → contenido suficiente para preview
PAYMENT_PENDING  → usuario inició publicación
PAID             → pago confirmado
PUBLISHED        → página pública activa
EXPIRED          → publicación expirada
ARCHIVED         → boda archivada
```

**No permitir saltos arbitrarios:**

```
DRAFT
  ↓
READY
  ↓
PAYMENT_PENDING
  ↓
PAID
  ↓
PUBLISHED
```

---

## Multi-tenancy

Cada usuario es propietario de sus bodas:

```
User
 ├── Wedding A
 ├── Wedding B
 └── Wedding C
```

Una boda pertenece a **un único usuario** en MVP (colaboración de pareja es futuro).
En local, cada repositorio filtra por `user_id`; en Supabase se refuerza con RLS.

---

## Reglas

- La página se almacena como datos (nunca HTML).
- Cada boda guarda `template_id` + `template_version`.
- Una boda pertenece a un único propietario en MVP.
- Los métodos de acceso pasan por `lib/data` (repositorios).
- No almacenar contraseñas de Google, credenciales de Drive ni API keys en la BBDD.

---

## Relaciones

- Se implementa en `lib/data` (local) → Supabase (futuro).
- El renderer consume estos datos (ver `brain/context/06_web_builder_y_renderer.md`).
- El modelo de pagos está en `brain/context/07_publicacion_y_pagos.md`.
- Permisos/RLS en `brain/context/08_seguridad_storage_seo.md`.

---

## Decisiones

- **Regla fundamental:** datos, no HTML (plan.md §23).
- **ADR-003:** templates versionados (cada boda guarda versión).
- **ADR-007:** persistencia local (SQLite) primero, PostgreSQL/Supabase después.
