Sí. Te dejo **un único documento Markdown completo**, sin dividirlo en mensajes ni agregar explicaciones fuera del documento. Puedes copiar **todo el bloque** y pegarlo directamente en `DOCUMENTACION_PROYECTO.md`.

````md
# WEDDING WEB BUILDER
# DOCUMENTACIÓN MAESTRA DEL PROYECTO

Versión: 1.0
Estado: Planificación
Tipo: SaaS
Mercado inicial: Chile / LATAM

---

# 1. VISIÓN DEL PROYECTO

## 1.1 Nombre de trabajo

Wedding Web Builder

El nombre comercial definitivo se definirá posteriormente.

## 1.2 Descripción

Wedding Web Builder es una plataforma SaaS especializada en la creación de páginas web para bodas.

La plataforma permitirá a una pareja crear una página web profesional para su matrimonio sin conocimientos de programación.

El usuario podrá seleccionar una plantilla, personalizarla mediante un Web Builder visual, visualizar el resultado en tiempo real y publicar la página después de realizar el pago.

## 1.3 Concepto

El producto debe sentirse como:

> "Un Canva especializado en páginas web para bodas."

La plataforma no pretende ser un constructor web general.

Está especializada en:

- bodas
- invitaciones digitales
- páginas de matrimonio
- información del evento
- fotografías
- ubicación
- invitados
- RSVP
- invitaciones digitales

---

# 2. PROBLEMA

Las parejas necesitan una forma sencilla y profesional de crear una página para su boda.

Las alternativas existentes pueden presentar problemas:

- son demasiado generales
- requieren conocimientos técnicos
- tienen demasiadas opciones
- no están enfocadas exclusivamente en bodas
- requieren diseñar desde cero
- pueden tener costos elevados
- requieren configurar hosting
- pueden generar una experiencia compleja

Wedding Web Builder debe eliminar la complejidad técnica.

La pareja debe preocuparse solamente por:

- cómo quiere que se vea
- qué información quiere mostrar
- qué fotografías quiere utilizar
- dónde será la boda
- quiénes serán sus invitados

La plataforma se encarga del resto.

---

# 3. PROPUESTA DE VALOR

El usuario debe poder:

1. Elegir una plantilla.
2. Ver una demo.
3. Utilizar la plantilla.
4. Personalizarla.
5. Ver el resultado en tiempo real.
6. Guardar el proyecto.
7. Compartir una preview.
8. Intentar publicar.
9. Pagar.
10. Obtener una página pública.

El concepto comercial principal es:

```text
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
````

---

# 4. PRINCIPIO COMERCIAL

El usuario NO debe pagar para comenzar a construir.

El usuario puede crear su página antes de pagar.

Esto permite que experimente con el producto y vea el resultado.

El momento de monetización ocurre cuando el usuario intenta publicar.

Esto genera un modelo:

```text
Free Creation
+
Paid Publishing
```

El usuario debe llegar al momento:

> "Ya terminé mi página y quiero compartirla."

En ese momento se presenta el pago.

---

# 5. OBJETIVO DEL MVP

El objetivo principal del MVP no es tener muchas funcionalidades.

El objetivo es validar:

> ¿Las parejas están dispuestas a pagar por publicar una página de boda que ellas mismas construyeron?

La funcionalidad más importante del MVP será el:

# WEB BUILDER

El Web Builder es el corazón del producto.

---

# 6. PRIORIDADES DEL PRODUCTO

## P0 — PRIORIDAD ABSOLUTA

* Web Builder
* Template Engine
* Renderer
* Sistema de secciones
* Sistema de temas
* Plantillas
* Preview
* Responsive
* Autosave
* Publicación
* Pago

## P1

* Google Maps
* Google Drive
* SEO
* Open Graph
* Dashboard
* Administración de plantillas

## P2

* Invitados
* RSVP
* Invitaciones
* Email

## P3

* IA
* Dominios personalizados
* Analytics avanzados
* Marketplace de plantillas
* Funciones adicionales

---

# 7. PRINCIPIO DE DESARROLLO

No desarrollar funcionalidades secundarias antes de que el Web Builder sea sólido.

La prioridad debe ser:

```text
BUILDER
   ↓
TEMPLATES
   ↓
RENDERER
   ↓
PREVIEW
   ↓
PUBLICACIÓN
   ↓
PAGO
```

Una vez validado ese flujo:

```text
INVITADOS
   ↓
RSVP
   ↓
INVITACIONES
   ↓
EMAIL
   ↓
IA
```

---

# 8. EXPERIENCIA PRINCIPAL

## 8.1 Landing

El usuario llega a la página principal.

Debe encontrar:

* propuesta de valor
* ejemplos
* plantillas
* demos
* precios
* llamada a la acción

CTA principal:

```text
Crear mi página
```

CTA secundario:

```text
Ver plantillas
```

---

# 9. CATÁLOGO DE PLANTILLAS

Ruta:

```text
/plantillas
```

Debe mostrar las diferentes plantillas disponibles.

Cada tarjeta debe incluir:

* imagen/thumbnail
* nombre
* categoría
* descripción
* botón "Ver demo"
* botón "Usar plantilla"

Ejemplo:

```text
┌──────────────────────────────┐
│                              │
│       PREVIEW PLANTILLA      │
│                              │
├──────────────────────────────┤
│ Elegance                     │
│ Elegante y sofisticada       │
│                              │
│ [Ver demo] [Usar plantilla]  │
└──────────────────────────────┘
```

---

# 10. CATEGORÍAS DE PLANTILLAS

Categorías iniciales:

* Elegante
* Romántica
* Minimalista
* Moderna
* Floral
* Natural
* Luxury

---

# 11. DEMO DE PLANTILLAS

Cada plantilla debe disponer de una demo completa.

Ejemplo:

```text
/plantillas/elegance
```

La demo debe parecer una boda real.

Debe incluir:

* nombres ficticios
* fecha ficticia
* fotografías de ejemplo
* historia
* evento
* ubicación
* galería
* countdown
* footer

El usuario debe poder navegar por la demo.

El objetivo de la demo es generar deseo.

El usuario debe pensar:

> "Quiero que mi página se vea así."

---

# 12. SISTEMA DE PLANTILLAS

Las plantillas no deben ser páginas independientes programadas desde cero.

Debe existir un Template Engine.

Arquitectura:

```text
Template
├── Metadata
├── Version
├── Theme
├── Sections
└── Variants
```

Ejemplo:

```json
{
  "id": "elegance",
  "name": "Elegance",
  "version": 1,
  "sections": [
    {
      "type": "hero",
      "variant": "fullscreen"
    },
    {
      "type": "couple",
      "variant": "editorial"
    },
    {
      "type": "story",
      "variant": "timeline"
    },
    {
      "type": "gallery",
      "variant": "carousel"
    },
    {
      "type": "countdown",
      "variant": "minimal"
    },
    {
      "type": "event",
      "variant": "classic"
    },
    {
      "type": "location",
      "variant": "split"
    },
    {
      "type": "drive",
      "variant": "button"
    },
    {
      "type": "footer",
      "variant": "classic"
    }
  ]
}
```

---

# 13. VERSIONADO DE PLANTILLAS

Cada plantilla debe tener:

```text
template_id
template_version
```

Ejemplo:

```text
elegance
version 1
```

Si posteriormente se crea:

```text
elegance
version 2
```

las bodas existentes deben continuar funcionando.

Una actualización de plantilla nunca debe romper automáticamente páginas ya creadas.

---

# 14. VARIANTES

Los componentes deben permitir variantes.

## Hero

```text
classic
fullscreen
split
minimal
```

## Gallery

```text
carousel
grid
masonry
editorial
```

## Story

```text
classic
timeline
editorial
minimal
```

## Location

```text
classic
split
centered
```

Esto permite crear muchas plantillas reutilizando componentes.

---

# 15. TEMAS

El sistema debe permitir seleccionar temas.

Un tema controla:

* colores
* tipografías
* botones
* bordes
* radios
* espaciado
* fondos
* estilo visual

Ejemplos:

```text
Ivory Elegance
Romantic Rose
Champagne
Garden
Modern Black
Classic White
```

---

# 16. REGLA DEL SISTEMA DE TEMAS

El usuario NO debería poder romper fácilmente el diseño.

En el MVP no se permitirá:

* CSS personalizado
* valores ilimitados
* edición directa de CSS
* edición de HTML

Se utilizarán configuraciones profesionales.

Esto permite mantener la calidad visual.

---

# 17. WEB BUILDER

# PRIORIDAD ABSOLUTA

El Web Builder es la característica central.

Debe permitir que una persona sin conocimientos técnicos cree una web completa.

---

# 18. FILOSOFÍA DEL WEB BUILDER

El Builder NO debe ser un editor de diseño general.

No debe intentar competir con:

* Figma
* Photoshop
* Illustrator

Debe ser un:

> Editor especializado por bloques para páginas de boda.

---

# 19. ESTRUCTURA DEL BUILDER

```text
┌─────────────────────────────────────────────────────┐
│ LOGO | Guardado | Preview | Publicar               │
├──────────────────┬──────────────────────────────────┤
│                  │                                  │
│ SIDEBAR          │                                  │
│                  │                                  │
│ Contenido        │                                  │
│ Secciones        │          CANVAS                  │
│ Diseño           │                                  │
│ Plantilla        │      WeddingRenderer             │
│                  │                                  │
│                  │                                  │
├──────────────────┴──────────────────────────────────┤
│ Desktop | Tablet | Mobile                           │
└─────────────────────────────────────────────────────┘
```

---

# 20. SIDEBAR

## Contenido

Permite modificar:

* nombres
* fecha
* hora
* títulos
* subtítulos
* textos
* ubicación
* enlaces

## Secciones

Permite:

* agregar
* eliminar
* activar
* desactivar
* ocultar
* mostrar
* reordenar

## Diseño

Permite:

* tema
* colores
* tipografías
* estilo

## Plantilla

Permite visualizar la plantilla actual.

---

# 21. CANVAS

El Canvas debe mostrar una representación real de la página.

El Canvas debe utilizar:

```text
WeddingRenderer
```

El mismo renderer será utilizado para:

```text
Builder
+
Preview
+
Página pública
```

Esto es una decisión arquitectónica fundamental.

---

# 22. MODELO DEL BUILDER

La página será representada como datos.

Ejemplo:

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

# 23. REGLA FUNDAMENTAL

La página no debe almacenarse como HTML.

Debe almacenarse como:

```text
Configuración
+
Contenido
+
Secciones
+
Tema
+
Plantilla
```

Después:

```text
WeddingRenderer
```

transformará esos datos en la página.

---

# 24. SECCIONES DEL MVP

## Hero

Información principal.

## Couple

Presentación de la pareja.

## Story

Historia.

## Gallery

Fotografías.

## Countdown

Cuenta regresiva.

## Event

Información del evento.

## Location

Lugar y mapa.

## Google Drive

Enlace a Drive.

## Footer

Información final.

---

# 25. HERO

Datos:

```text
partner1
partner2
title
subtitle
date
image
```

Ejemplo:

```text
Andrea & Sebastián

Nos casamos

15 de noviembre de 2027
```

---

# 26. COUPLE

Debe permitir:

* foto
* nombre
* descripción

Puede tener diferentes variantes.

---

# 27. STORY

Permite contar la historia de la pareja.

Campos:

```text
title
content
image
```

La IA podrá ayudar posteriormente a escribirla.

---

# 28. GALLERY

Permite:

* subir imágenes
* eliminar
* reemplazar
* ordenar

Variantes:

```text
carousel
grid
masonry
editorial
```

---

# 29. COUNTDOWN

Debe mostrar:

```text
Días
Horas
Minutos
Segundos
```

Debe utilizar la fecha de la boda.

---

# 30. EVENT

Debe permitir:

```text
Nombre
Fecha
Hora
Lugar
Dirección
```

Posteriormente:

```text
Ceremonia
Recepción
Fiesta
```

---

# 31. LOCATION

Debe permitir:

```text
Nombre del lugar
Dirección
Google Maps URL
```

Debe mostrar:

```text
[Cómo llegar]
```

---

# 32. GOOGLE MAPS

La pareja podrá colocar un enlace de Google Maps.

Ejemplo:

```text
https://maps.google.com/...
```

La plataforma debe validar que sea una URL válida.

No almacenar credenciales de Google.

---

# 33. GOOGLE DRIVE

La plataforma permitirá colocar un enlace a Google Drive.

Ejemplo:

```text
https://drive.google.com/...
```

La plataforma NO reemplazará Google Drive.

Simplemente proporcionará un apartado para que la pareja comparta un enlace.

---

# 34. INSTRUCCIONES DE GOOGLE DRIVE

El Builder debe mostrar:

```text
¿Cómo agregar tu Google Drive?

1. Crea una carpeta en Google Drive.
2. Coloca allí el contenido que quieras compartir.
3. Abre las opciones de compartir.
4. Configura los permisos.
5. Copia el enlace.
6. Pega el enlace aquí.
7. Comprueba que el enlace funciona.
8. Publica tu página.
```

Advertencia:

> El acceso al contenido dependerá de los permisos configurados en Google Drive.

Nunca solicitar:

* contraseña
* credenciales
* tokens privados

---

# 35. RESPONSIVE PREVIEW

El Builder debe tener:

```text
[ Desktop ]
[ Tablet ]
[ Mobile ]
```

El usuario puede alternar entre ellos.

---

# 36. AUTOSAVE

Los cambios deben guardarse automáticamente.

No realizar una petición a la base de datos por cada tecla.

Utilizar debounce.

Ejemplo:

```text
Usuario modifica
        ↓
Esperar 800 ms
        ↓
Guardar
        ↓
"Guardado"
```

Estados:

```text
Guardado
Guardando...
Error al guardar
```

---

# 37. UNDO / REDO

No es obligatorio para MVP.

Puede implementarse posteriormente.

---

# 38. SISTEMA DE PREVIEW

Debe existir una preview limpia.

La preview debe ocultar las herramientas del Builder.

Debe parecer una página real.

Ruta conceptual:

```text
/dashboard/bodas/[id]/preview
```

---

# 39. PÁGINA PÚBLICA

Cuando una boda se publica:

```text
/w/[slug]
```

Ejemplo:

```text
/w/andrea-sebastian
```

La página debe funcionar sin login.

---

# 40. PUBLICACIÓN

La publicación requiere pago.

Estados:

```text
DRAFT
READY
PAYMENT_PENDING
PAID
PUBLISHED
EXPIRED
ARCHIVED
```

---

# 41. FLUJO DE PUBLICACIÓN

```text
Usuario termina página
        ↓
Preview
        ↓
Publicar
        ↓
Seleccionar producto
        ↓
Checkout
        ↓
Pago
        ↓
Webhook
        ↓
Backend valida
        ↓
Order = PAID
        ↓
Wedding = PUBLISHED
        ↓
URL pública
```

---

# 42. REGLA DE PAGO

Nunca confiar en una variable enviada por frontend:

```text
paid=true
```

La publicación solamente debe activarse cuando el backend haya confirmado el pago.

---

# 43. MODELO DE PRODUCTOS

Inicialmente se pueden ofrecer:

## Plan Esencial

Página de boda.

Incluye:

* plantilla
* Web Builder
* personalización
* fotografías
* galería
* countdown
* ubicación
* Google Maps
* Google Drive
* publicación

## Plan Premium

Incluye todo lo anterior más:

* más personalización
* más opciones de diseño
* funcionalidades avanzadas

## Plan Invitados

Incluye:

* gestión de invitados
* RSVP
* invitaciones digitales
* email

Los precios definitivos deben validarse mediante experimentos reales.

---

# 44. MODELO DE MONETIZACIÓN

El modelo inicial será:

```text
CREAR GRATIS
↓
PUBLICAR PAGANDO
```

Esto reduce la barrera inicial.

El usuario no paga por descubrir el producto.

Paga cuando ya ha invertido tiempo y emocionalmente en su página.

---

# 45. PRECIOS

El producto debe estar pensado para LATAM.

No asumir precios altos desde el inicio.

Se debe validar:

* disposición de pago
* competencia
* costos
* conversión
* margen
* duración de la publicación

El precio debe ser suficientemente bajo para una boda promedio pero suficientemente alto para mantener margen.

La primera estrategia puede probar diferentes niveles de precio mediante experimentos.

---

# 46. ESTRATEGIA DE PRICING

Probar inicialmente diferentes ofertas.

Ejemplo conceptual:

```text
Esencial
Pago único

Premium
Pago único

Invitados
Pago único o add-on
```

Posteriormente evaluar:

```text
Publicación por 12 meses
Publicación por 24 meses
Publicación permanente
```

También puede existir:

```text
Dominio personalizado
```

como add-on.

---

# 47. MODELO DE NEGOCIO

El negocio debe evitar depender exclusivamente de suscripciones mensuales.

La boda es un evento puntual.

Por ello el modelo principal puede ser:

```text
Pago único
```

con productos adicionales.

Ejemplo:

```text
Página
+
Invitados
+
Dominio
+
Extensión
```

---

# 48. COSTOS

La arquitectura debe priorizar servicios gratuitos o de bajo costo.

Stack inicial:

```text
Next.js
Supabase
Vercel
Storage
Proveedor de pagos
Proveedor de email
```

La infraestructura debe escalar según usuarios.

Evitar servicios innecesarios durante el MVP.

---

# 49. ARQUITECTURA TÉCNICA

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
```

## Backend

```text
Next.js Server Actions
Next.js Route Handlers
```

## Database

```text
Supabase PostgreSQL
```

## Auth

```text
Supabase Auth
```

## Storage

```text
Supabase Storage
```

## Deploy

```text
Vercel
```

---

# 50. ARQUITECTURA

```text
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
                       Supabase
                 ┌──────────┼──────────┐
                 │          │          │
                 ▼          ▼          ▼
             PostgreSQL   Auth      Storage
```

---

# 51. ESTRUCTURA DEL PROYECTO

```text
src/
├── app/
│   ├── page.tsx
│   ├── plantillas/
│   ├── dashboard/
│   ├── w/
│   └── api/
│
├── components/
│   ├── builder/
│   ├── wedding/
│   ├── templates/
│   ├── dashboard/
│   └── ui/
│
├── lib/
│   ├── auth/
│   ├── wedding/
│   ├── templates/
│   ├── payments/
│   ├── storage/
│   └── maps/
│
├── types/
│
└── config/
```

---

# 52. WEDDING RENDERER

Debe existir un componente central:

```text
WeddingRenderer
```

Entrada:

```text
Wedding
Template
Theme
Sections
```

Salida:

```text
Página visual
```

Debe utilizarse para:

```text
Demo
Builder
Preview
Página pública
```

---

# 53. REGLA DEL RENDERER

No crear:

```text
BuilderRenderer
PublicRenderer
```

como dos sistemas completamente diferentes.

Debe existir un sistema central reutilizable.

Esto evitará que:

```text
Preview ≠ Página publicada
```

---

# 54. MODELO DE DATOS

## profiles

```text
id
email
name
created_at
updated_at
```

## weddings

```text
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

## wedding_sections

```text
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

## wedding_media

```text
id
wedding_id
storage_path
alt_text
position
created_at
```

## templates

```text
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

## products

```text
id
name
description
price
currency
duration_days
features_json
active
```

## orders

```text
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

## publications

```text
id
wedding_id
slug
status
published_at
expires_at
```

---

# 55. FUTURO — INVITADOS

Tabla:

```text
guests
```

Campos:

```text
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

---

# 56. FUTURO — RSVP

Tabla:

```text
rsvp_responses
```

Campos:

```text
id
guest_id
attendance
companions
message
created_at
updated_at
```

---

# 57. FUTURO — INVITACIONES

Tabla:

```text
invitations
```

Campos:

```text
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

# 58. RLS

Todas las entidades privadas deben utilizar Row Level Security.

Un usuario solamente puede acceder a sus propias bodas.

Ejemplo conceptual:

```text
User A
  ↓
Wedding A

User B
  ↓
Wedding B
```

User A no puede acceder a Wedding B.

---

# 59. SEGURIDAD

Debe existir:

* RLS
* autorización server-side
* validación de datos
* validación de archivos
* validación de URLs
* rate limiting
* protección de endpoints
* webhooks verificados

Nunca almacenar:

* contraseñas de Google
* credenciales de Drive
* API keys en frontend

---

# 60. STORAGE

Las imágenes subidas por el usuario pueden almacenarse en Supabase Storage.

Estructura conceptual:

```text
weddings/
    wedding-id/
        gallery/
        hero/
        couple/
```

Se debe controlar:

* tamaño
* tipo MIME
* extensión
* cantidad
* usuario propietario

---

# 61. OPTIMIZACIÓN DE IMÁGENES

Las imágenes son críticas porque las páginas de boda pueden contener muchas fotografías.

Implementar:

* compresión
* thumbnails
* lazy loading
* formatos modernos
* tamaños responsive

No cargar todas las imágenes originales inmediatamente.

---

# 62. SEO

Cada página pública debe generar:

```text
title
description
canonical
Open Graph
```

Ejemplo:

```text
Andrea & Sebastián | Nuestra boda
```

---

# 63. OPEN GRAPH

Cuando una pareja comparte:

```text
https://dominio/w/andrea-sebastian
```

debe existir una preview visual.

Debe generar:

* título
* descripción
* imagen

Esto es importante para compartir mediante redes sociales y aplicaciones de mensajería.

---

# 64. INVITADOS — FUTURO

El módulo de invitados será Premium.

Debe permitir:

```text
Agregar invitado
Editar
Eliminar
Buscar
Filtrar
```

Información:

```text
Nombre
Email
Grupo
Estado
```

---

# 65. RSVP — FUTURO

El invitado recibirá una invitación.

Podrá responder:

```text
Sí asistiré
No podré asistir
```

Opcionalmente:

```text
Acompañantes
Mensaje
```

---

# 66. EMAIL — FUTURO

Se integrará un proveedor de email transaccional.

Flujo:

```text
Guest
↓
Invitation
↓
Email
↓
Open
↓
RSVP
```

No implementar un servidor de correo propio.

---

# 67. IA — FUTURO

La IA debe ser asistente del Builder.

Funciones:

```text
Generar historia
Mejorar historia
Generar frases
Generar invitación
Cambiar tono
```

Ejemplo:

```text
✨ Generar con IA
```

La IA devuelve varias opciones.

El usuario selecciona una.

---

# 68. PLANTILLAS Y LICENCIAS

Las plantillas deben ser originales o utilizar recursos con licencias compatibles.

Fuentes recomendadas:

* Google Fonts
* iconos open source
* recursos con licencia comercial
* fotografías propias
* fotografías generadas
* recursos que permitan uso comercial

Nunca copiar directamente un diseño comercial.

---

# 69. REGISTRO DE LICENCIAS

Para cada recurso:

```text
Nombre
Autor
Origen
URL
Licencia
Fecha de revisión
Uso comercial permitido
Atribución requerida
```

Debe existir un archivo interno:

```text
LICENSES.md
```

---

# 70. PRIMERAS PLANTILLAS

Se deben desarrollar al menos cinco.

```text
01 Elegance
02 Romantic
03 Minimal
04 Garden
05 Luxury
```

Cada una debe tener:

* demo
* mobile
* desktop
* variantes
* tema
* hero
* couple
* story
* gallery
* countdown
* event
* location
* drive
* footer

---

# 71. PANEL ADMINISTRATIVO

Debe existir posteriormente.

Funciones:

```text
Usuarios
Bodas
Plantillas
Productos
Pagos
Publicaciones
Analytics
```

---

# 72. ADMINISTRACIÓN DE PLANTILLAS

Admin podrá:

* crear plantilla
* editar plantilla
* activar
* desactivar
* cambiar versión
* establecer demo
* categorizar

---

# 73. ANALYTICS

Registrar eventos:

```text
template_view
template_demo
template_selected
wedding_created
builder_opened
section_edited
preview_opened
publish_clicked
checkout_started
payment_completed
wedding_published
```

---

# 74. FUNNEL

Medir:

```text
Visitantes
↓
Plantillas
↓
Demo
↓
Crear
↓
Builder
↓
Preview
↓
Publicar
↓
Checkout
↓
Pago
```

Esto permitirá detectar dónde se pierden usuarios.

---

# 75. MÉTRICAS PRINCIPALES

## Conversion Rate

```text
Pagos / usuarios que intentaron publicar
```

## Builder Completion

```text
Usuarios que llegaron a preview / usuarios que iniciaron builder
```

## Template Conversion

Comparar:

```text
Plantilla A
Plantilla B
Plantilla C
```

para descubrir cuáles convierten mejor.

---

# 76. HISTORIAS DE USUARIO

## HU-001

Como usuario quiero explorar plantillas para encontrar un diseño adecuado para mi boda.

## HU-002

Como usuario quiero ver una demo completa antes de elegir una plantilla.

## HU-003

Como usuario quiero utilizar una plantilla para comenzar rápidamente.

## HU-004

Como usuario quiero modificar los nombres de los novios.

## HU-005

Como usuario quiero modificar la fecha.

## HU-006

Como usuario quiero modificar textos.

## HU-007

Como usuario quiero subir fotografías.

## HU-008

Como usuario quiero ordenar fotografías.

## HU-009

Como usuario quiero cambiar el tema.

## HU-010

Como usuario quiero activar o desactivar secciones.

## HU-011

Como usuario quiero cambiar el orden de las secciones.

## HU-012

Como usuario quiero ver cómo se ve mi página en móvil.

## HU-013

Como usuario quiero ver cómo se ve en desktop.

## HU-014

Como usuario quiero que mis cambios se guarden automáticamente.

## HU-015

Como usuario quiero agregar Google Maps.

## HU-016

Como usuario quiero agregar un enlace de Google Drive.

## HU-017

Como usuario quiero ver una preview completa.

## HU-018

Como usuario quiero publicar mi página.

## HU-019

Como usuario quiero pagar para publicar.

## HU-020

Como usuario quiero obtener una URL pública.

## HU-021

Como usuario quiero modificar mi página después de publicarla.

## HU-022

Como usuario premium quiero administrar invitados.

## HU-023

Como usuario premium quiero recibir RSVP.

## HU-024

Como usuario premium quiero enviar invitaciones por email.

## HU-025

Como usuario quiero utilizar IA para mejorar textos.

---

# 77. REQUISITOS FUNCIONALES

## RF-001

El sistema debe permitir crear una cuenta.

## RF-002

El sistema debe permitir crear una boda.

## RF-003

El sistema debe permitir seleccionar una plantilla.

## RF-004

El sistema debe permitir visualizar demos.

## RF-005

El sistema debe proporcionar un Web Builder.

## RF-006

El Builder debe permitir editar contenido.

## RF-007

El Builder debe permitir modificar secciones.

## RF-008

El Builder debe permitir modificar temas.

## RF-009

El Builder debe permitir cargar imágenes.

## RF-010

El Builder debe permitir crear carruseles.

## RF-011

El Builder debe permitir configurar ubicación.

## RF-012

El Builder debe permitir agregar Google Maps.

## RF-013

El Builder debe permitir agregar Google Drive.

## RF-014

El sistema debe guardar cambios.

## RF-015

El sistema debe proporcionar preview responsive.

## RF-016

El sistema debe impedir publicar sin pago.

## RF-017

El sistema debe procesar pagos.

## RF-018

El sistema debe validar pagos mediante backend.

## RF-019

El sistema debe generar URL pública.

## RF-020

El sistema debe permitir editar páginas publicadas.

---

# 78. REQUISITOS NO FUNCIONALES

## Rendimiento

La interfaz debe sentirse rápida.

## Responsive

Debe funcionar correctamente en:

* móvil
* tablet
* desktop

## Seguridad

Debe existir:

* RLS
* validación
* autorización
* protección de API

## Escalabilidad

Las nuevas plantillas no deben requerir modificar el core.

## Disponibilidad

Las páginas públicas deben funcionar independientemente de que el usuario esté conectado.

---

# 79. BACKLOG P0

```text
[ ] Crear proyecto
[ ] Configurar Next.js
[ ] Configurar TypeScript
[ ] Configurar Tailwind
[ ] Configurar Supabase
[ ] Configurar Auth
[ ] Crear DB
[ ] Crear RLS
[ ] Crear Wedding model
[ ] Crear Wedding Renderer
[ ] Crear sistema de secciones
[ ] Crear Template Engine
[ ] Crear sistema de temas
[ ] Crear catálogo de plantillas
[ ] Crear demos
[ ] Crear Builder
[ ] Crear Canvas
[ ] Crear Sidebar
[ ] Crear editor de contenido
[ ] Crear editor de secciones
[ ] Crear editor de temas
[ ] Crear autosave
[ ] Crear preview
[ ] Crear responsive preview
[ ] Crear gallery
[ ] Crear countdown
[ ] Crear location
[ ] Crear Google Maps
[ ] Crear Google Drive
[ ] Crear publicación
[ ] Crear checkout
[ ] Crear webhook
[ ] Crear página pública
```

---

# 80. BACKLOG P1

```text
[ ] SEO
[ ] Open Graph
[ ] Dashboard mejorado
[ ] Panel administrativo
[ ] Gestión de plantillas
[ ] Analytics
[ ] Más plantillas
```

---

# 81. BACKLOG P2

```text
[ ] Invitados
[ ] RSVP
[ ] Invitaciones
[ ] Emails
[ ] Links personalizados
```

---

# 82. BACKLOG P3

```text
[ ] IA
[ ] Dominios personalizados
[ ] Analytics avanzados
[ ] Marketplace
[ ] Multi-moneda
[ ] Más países
```

---

# 83. ROADMAP

## Fase 1

Foundation.

```text
Next.js
Supabase
Auth
DB
RLS
```

## Fase 2

Renderer.

Construir todas las secciones.

## Fase 3

Template Engine.

## Fase 4

Web Builder.

## Fase 5

Crear primeras cinco plantillas.

## Fase 6

Preview.

## Fase 7

Publicación.

## Fase 8

Pagos.

## Fase 9

Beta.

## Fase 10

Invitados + RSVP.

## Fase 11

Email.

## Fase 12

IA.

---

# 84. TESTING

## Unit Testing

Testear:

* renderer
* templates
* themes
* publicación
* permisos
* estados
* validaciones

## Integration Testing

Testear:

```text
Crear boda
↓
Editar
↓
Guardar
↓
Preview
↓
Checkout
↓
Pago
↓
Publicar
```

## E2E

El flujo principal debe funcionar completamente.

---

# 85. CASOS CRÍTICOS DE TEST

## Caso 1

Usuario crea boda.

Resultado esperado:

Boda creada.

## Caso 2

Usuario cambia texto.

Resultado esperado:

Texto actualizado en preview.

## Caso 3

Usuario recarga.

Resultado esperado:

Los cambios permanecen.

## Caso 4

Usuario intenta publicar sin pagar.

Resultado:

Publicación bloqueada.

## Caso 5

Usuario paga.

Resultado:

Backend recibe webhook.

## Caso 6

Pago confirmado.

Resultado:

Wedding = PUBLISHED.

## Caso 7

URL pública.

Resultado:

Página accesible sin login.

---

# 86. SEGURIDAD DE PAGOS

Nunca activar publicación desde frontend.

Flujo obligatorio:

```text
Frontend
↓
Checkout
↓
Proveedor
↓
Webhook
↓
Backend
↓
Validación
↓
Publication
```

---

# 87. DEPLOYMENT

## Desarrollo

```text
localhost
```

## Staging

Entorno separado.

## Producción

```text
Vercel
+
Supabase
```

---

# 88. VARIABLES DE ENTORNO

Ejemplo:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

PAYMENT_SECRET
PAYMENT_WEBHOOK_SECRET

EMAIL_API_KEY

AI_API_KEY
```

Nunca subir secretos al repositorio.

---

# 89. CONVENCIONES DE CÓDIGO

## TypeScript

Strict mode.

## Componentes

PascalCase.

## Variables

camelCase.

## Tablas

snake_case.

## Tipos

PascalCase.

---

# 90. ESTRUCTURA DE COMPONENTES

```text
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

# 91. REGLA DE COMPONENTES

No colocar toda la lógica en:

```text
Builder.tsx
```

Dividir responsabilidades.

El Builder controla:

```text
Estado
Edición
Interacción
```

El Renderer controla:

```text
Representación visual
```

---

# 92. REGLA DE NEGOCIO

El usuario puede:

```text
Crear
Editar
Preview
```

sin pagar.

El usuario debe pagar para:

```text
Publicar
```

---

# 93. REGLA DE EXPERIENCIA

El sistema debe minimizar pasos.

Un usuario debe poder crear una web básica en pocos minutos.

El onboarding inicial puede solicitar:

```text
Nombre de la pareja
Fecha
Lugar
Plantilla
```

Después entrar directamente al Builder.

---

# 94. ONBOARDING

Flujo:

```text
Crear cuenta
↓
¿Cómo se llaman?
↓
¿Cuándo es la boda?
↓
¿Dónde será?
↓
Elige un estilo
↓
Crear página
↓
Builder
```

---

# 95. ESTADOS DE LA BODA

```text
DRAFT
```

La boda está siendo creada.

```text
READY
```

Tiene contenido suficiente para preview.

```text
PAYMENT_PENDING
```

Usuario inició publicación.

```text
PAID
```

Pago confirmado.

```text
PUBLISHED
```

Página pública activa.

```text
EXPIRED
```

Publicación expirada.

```text
ARCHIVED
```

Boda archivada.

---

# 96. DASHBOARD

El usuario debe ver:

```text
Mis bodas

┌──────────────────────────────┐
│ Andrea & Sebastián           │
│ 15 Noviembre 2027            │
│                              │
│ Estado: Borrador             │
│                              │
│ [Editar] [Preview]           │
└──────────────────────────────┘
```

---

# 97. DASHBOARD PUBLICADA

```text
Andrea & Sebastián

Estado:
PUBLICADA

URL:
example.com/w/andrea-sebastian

[Ver página]
[Editar]
[Compartir]
```

---

# 98. SHARING

La plataforma debe facilitar:

```text
Copiar enlace
Compartir
```

Posteriormente:

```text
WhatsApp
Email
Redes sociales
```

---

# 99. WHATSAPP

Inicialmente no es necesario desarrollar una integración compleja.

Debe existir:

```text
Compartir enlace
```

El usuario puede copiar la URL y compartirla.

---

# 100. DOMINIO PERSONALIZADO

Funcionalidad futura.

Puede venderse como:

```text
Add-on
```

Ejemplo:

```text
andrea-sebastian.com
```

---

# 101. ANALYTICS DEL NEGOCIO

Eventos:

```text
landing_view
template_view
template_demo
template_selected
signup
wedding_created
builder_opened
section_added
section_edited
preview_opened
publish_clicked
checkout_started
payment_completed
published
```

---

# 102. OBJETIVO DE CONVERSIÓN

La métrica principal es:

```text
Pago / usuarios que intentan publicar
```

Pero también deben analizarse:

```text
Visitantes → Builder
Builder → Preview
Preview → Publicar
Publicar → Checkout
Checkout → Pago
```

---

# 103. PRODUCT MARKET FIT

Antes de desarrollar muchas funcionalidades se debe validar:

1. ¿Las personas utilizan las plantillas?
2. ¿Las personas terminan una página?
3. ¿Llegan al botón publicar?
4. ¿Pagan?
5. ¿Recomiendan el producto?

---

# 104. PRINCIPIO DE VALIDACIÓN

No asumir que una funcionalidad es necesaria solamente porque parece interesante.

Validar con usuarios reales.

Especialmente:

* precio
* plantillas
* funcionalidades premium
* duración
* invitados
* RSVP

---

# 105. CRITERIOS DE ACEPTACIÓN DEL BUILDER

El Builder estará terminado cuando:

```text
[ ] Usuario puede elegir plantilla
[ ] Usuario puede ver demo
[ ] Usuario puede crear boda
[ ] Usuario puede editar contenido
[ ] Usuario puede modificar imágenes
[ ] Usuario puede cambiar tema
[ ] Usuario puede reordenar secciones
[ ] Usuario puede ocultar secciones
[ ] Usuario puede ver mobile
[ ] Usuario puede ver desktop
[ ] Cambios se guardan
[ ] Preview funciona
[ ] Página pública utiliza los mismos datos
```

---

# 106. CRITERIOS DE ACEPTACIÓN DE PLANTILLAS

Cada plantilla:

```text
[ ] Tiene demo
[ ] Tiene mobile
[ ] Tiene desktop
[ ] Tiene Hero
[ ] Tiene Couple
[ ] Tiene Story
[ ] Tiene Gallery
[ ] Tiene Countdown
[ ] Tiene Event
[ ] Tiene Location
[ ] Tiene Drive
[ ] Tiene Footer
[ ] Tiene tema
[ ] Tiene variantes
[ ] Tiene versión
```

---

# 107. CRITERIOS DE ACEPTACIÓN DE PUBLICACIÓN

```text
[ ] Usuario no pagado no puede publicar
[ ] Checkout funciona
[ ] Webhook funciona
[ ] Pago validado
[ ] Orden actualizada
[ ] Wedding publicada
[ ] URL generada
[ ] Página pública funciona
```

---

# 108. ARQUITECTURA DE ESTADOS

```text
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

No permitir saltos arbitrarios.

---

# 109. REGLAS PARA IA DE DESARROLLO

La IA que participe en el desarrollo debe leer esta documentación antes de modificar el proyecto.

Debe respetar:

```text
Arquitectura
Modelo de datos
Template Engine
Renderer
Builder
Seguridad
Pagos
```

---

# 110. INSTRUCCIÓN PARA LA IA

Cuando se le asigne una tarea debe analizar:

```text
1. Objetivo
2. Archivos afectados
3. Dependencias
4. Riesgos
5. Plan
6. Implementación
7. Tests
```

No modificar arquitectura completa para solucionar una tarea pequeña.

---

# 111. REGLA PARA EL WEB BUILDER

La IA nunca debe convertir el Builder en un editor libre si no existe una decisión explícita.

El Builder debe permanecer basado en:

```text
Templates
+
Sections
+
Variants
+
Themes
+
Content
```

---

# 112. REGLA PARA LAS PLANTILLAS

Una plantilla nueva debe poder incorporarse sin reescribir el Builder.

Ejemplo:

```text
Agregar:

boho.json

```

debe permitir utilizarla dentro del sistema sin crear una aplicación independiente.

---

# 113. REGLA PARA EL RENDERER

El Renderer debe recibir datos.

Ejemplo:

```text
WeddingRenderer({
    wedding,
    template,
    theme,
    sections
})
```

No debe consultar directamente información innecesaria de la base de datos.

---

# 114. REGLA PARA EL FRONTEND

Utilizar Server Components por defecto.

Utilizar Client Components solamente cuando se necesite:

* interacción
* estado
* eventos
* drag/reorder
* editor
* preview interactiva

---

# 115. REGLA PARA BACKEND

Toda lógica sensible debe ejecutarse en servidor.

Especialmente:

* pagos
* publicación
* permisos
* webhooks
* administración
* IA con API keys

---

# 116. REGLA PARA STORAGE

Los archivos pertenecen a una boda.

La ruta debe contener el ID de la boda.

Nunca permitir que un usuario acceda a archivos de otra boda.

---

# 117. REGLA PARA URLs

Validar:

```text
slug
maps_url
drive_url
```

Evitar URLs peligrosas o esquemas no permitidos.

---

# 118. FUTURO — EDITOR DE INVITACIONES

En una etapa posterior podría existir:

```text
Invitation Builder
```

Diferente del:

```text
Wedding Web Builder
```

El Invitation Builder puede generar invitaciones individuales.

Ejemplo:

```text
Carlos

Tenemos el honor de invitarte
a nuestra boda...
```

---

# 119. FUTURO — GENERACIÓN MASIVA

El usuario podrá importar invitados y generar invitaciones.

Flujo:

```text
Lista de invitados
↓
Seleccionar plantilla
↓
Generar invitaciones
↓
Personalizar
↓
Enviar
```

---

# 120. FUTURO — IA PARA INVITACIONES

La IA puede generar:

* texto formal
* texto romántico
* texto moderno
* texto corto
* texto familiar

---

# 121. FUTURO — ANALYTICS DE INVITACIONES

Posteriormente:

```text
Enviados
Entregados
Abiertos
Confirmados
Rechazados
```

---

# 122. PRIVACIDAD

El sistema debe minimizar la exposición de información personal.

Los datos de invitados serán privados.

La página pública solamente mostrará información que la pareja haya configurado.

---

# 123. POLÍTICA DE DATOS

Antes de producción deben definirse:

* política de privacidad
* términos y condiciones
* política de pagos
* política de reembolso
* tratamiento de datos de invitados

Especialmente si se opera en distintos países de LATAM.

---

# 124. ESCALABILIDAD

La arquitectura debe soportar múltiples bodas.

Ejemplo:

```text
100 bodas
↓
1.000 bodas
↓
10.000 bodas
```

Sin modificar el modelo conceptual.

---

# 125. MULTI-TENANCY

Cada usuario es propietario de sus bodas.

Modelo:

```text
User
 ├── Wedding A
 ├── Wedding B
 └── Wedding C
```

Una boda pertenece a un único usuario en MVP.

Posteriormente puede soportarse colaboración.

---

# 126. FUTURO — COLABORACIÓN

Puede permitirse:

```text
Pareja 1
+
Pareja 2
```

ambos administrando la boda.

Esto no es MVP.

---

# 127. FUTURO — DOMINIOS

Posibilidad:

```text
mi-boda.com
```

Debe tratarse como funcionalidad premium.

---

# 128. FUTURO — MARKETPLACE

Posteriormente puede existir:

```text
Plantillas gratuitas
Plantillas premium
```

Los diseñadores podrían crear plantillas.

No implementar hasta validar el producto principal.

---

# 129. FUTURO — INTERNACIONALIZACIÓN

Preparar arquitectura para:

```text
Español
Inglés
Portugués
```

Primera versión:

```text
Español
```

---

# 130. FUTURO — LATAM

Mercados posibles:

```text
Chile
Argentina
Perú
Colombia
México
```

La arquitectura de pagos debe poder adaptarse a diferentes proveedores y monedas.

---

# 131. ESTRATEGIA DE LANZAMIENTO

No lanzar con 50 funcionalidades.

Lanzar con:

```text
5 plantillas excelentes
+
Builder excelente
+
Preview excelente
+
Publicación
+
Pago
```

Esto es preferible a:

```text
20 plantillas mediocres
+
Builder complicado
+
10 funcionalidades incompletas
```

---

# 132. OBJETIVO DE LA PRIMERA VERSIÓN

El usuario debe poder pasar de:

```text
"Necesito una página para mi boda"
```

a:

```text
"Esta es mi página y puedo compartirla"
```

en una sola sesión.

---

# 133. CHECKLIST MVP

```text
PRODUCTO

[ ] Landing
[ ] Plantillas
[ ] Demos
[ ] Registro
[ ] Login
[ ] Dashboard
[ ] Crear boda

BUILDER

[ ] Canvas
[ ] Sidebar
[ ] Contenido
[ ] Secciones
[ ] Temas
[ ] Responsive
[ ] Autosave
[ ] Preview

TEMPLATES

[ ] Template Engine
[ ] Variants
[ ] Themes
[ ] Versioning
[ ] 5 templates

WEDDING

[ ] Hero
[ ] Couple
[ ] Story
[ ] Gallery
[ ] Countdown
[ ] Event
[ ] Location
[ ] Google Maps
[ ] Google Drive
[ ] Footer

PUBLICACIÓN

[ ] Checkout
[ ] Payment
[ ] Webhook
[ ] URL
[ ] Public page

SEGURIDAD

[ ] RLS
[ ] Auth
[ ] Authorization
[ ] Storage security
[ ] Payment security
```

---

# 134. DEFINITION OF DONE

Una funcionalidad solamente se considera terminada cuando:

```text
[ ] Funciona
[ ] Está integrada
[ ] Tiene validaciones
[ ] Es responsive
[ ] No rompe funcionalidades existentes
[ ] Tiene tests cuando corresponde
[ ] Respeta la arquitectura
[ ] No expone secretos
[ ] Está documentada
```

---

# 135. DECISIONES ARQUITECTÓNICAS

## ADR-001

### Builder por secciones

Decisión:

Utilizar editor basado en bloques.

Motivo:

Permite mantener control de diseño y responsive.

---

## ADR-002

### Renderer único

Decisión:

Builder y producción comparten renderer.

Motivo:

Evita diferencias entre preview y página publicada.

---

## ADR-003

### Templates versionados

Decisión:

Cada boda almacena versión de plantilla.

Motivo:

Evitar breaking changes.

---

## ADR-004

### Publicación mediante pago confirmado

Decisión:

El backend controla la publicación.

Motivo:

Seguridad.

---

## ADR-005

### Google Drive mediante enlace

Decisión:

No sincronizar Drive.

Motivo:

Reducir complejidad y costos.

---

## ADR-006

### Mobile-first

Decisión:

Diseñar principalmente para teléfonos.

Motivo:

Las invitaciones serán consumidas principalmente desde dispositivos móviles.

---

# 136. PRINCIPIOS DEL PRODUCTO

## Principio 1

La plantilla debe hacer que el producto se vea profesional.

## Principio 2

El Builder debe ser fácil.

## Principio 3

La preview debe ser convincente.

## Principio 4

El usuario debe poder crear antes de pagar.

## Principio 5

Publicar es el momento de monetización.

## Principio 6

La página publicada debe verse igual que la preview.

## Principio 7

No añadir complejidad innecesaria.

## Principio 8

Primero validar, después escalar.

---

# 137. ORDEN EXACTO DE IMPLEMENTACIÓN

La IA de desarrollo debe seguir aproximadamente este orden:

```text
1. Crear proyecto
2. Configurar Supabase
3. Auth
4. Base de datos
5. RLS
6. Modelo Wedding
7. Modelo Sections
8. WeddingRenderer
9. Componentes de secciones
10. Template Engine
11. Themes
12. Templates
13. Template Demo
14. Dashboard
15. Builder
16. Canvas
17. Sidebar
18. Editor de contenido
19. Editor de secciones
20. Editor de temas
21. Autosave
22. Responsive Preview
23. Storage
24. Gallery
25. Google Maps
26. Google Drive
27. Preview
28. Página pública
29. Sistema de publicación
30. Productos
31. Checkout
32. Webhook
33. Confirmación de pago
34. Publicación
35. SEO
36. Open Graph
37. Analytics
38. Testing
39. Deployment
40. Beta
```

Después:

```text
41. Invitados
42. RSVP
43. Invitaciones
44. Email
45. IA
46. Dominios
47. Analytics avanzado
```

---

# 138. REGLA FINAL PARA EL DESARROLLO

El proyecto debe construirse alrededor de una idea central:

```text
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

El Web Builder, el sistema de plantillas y el Renderer son el núcleo técnico.

Los invitados, RSVP, emails e IA son extensiones del producto.

La plataforma debe comenzar siendo excelente en una sola cosa:

> Crear páginas web de bodas bonitas, fáciles de personalizar y fáciles de publicar.

```
```
