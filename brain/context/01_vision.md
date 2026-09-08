# Contexto 01 — Visión, Problema y Modelo de Negocio

> Documento de contexto derivado de `plan.md` (secciones 1–7, 43–48, 131–133).
> Ver también `brain/context/02_arquitectura.md` para el detalle técnico.

---

## Objetivo

Definir qué es Web de Boda, qué problema resuelve, cómo se monetiza y
cuál es el alcance del MVP. Este es el punto de partida conceptual de todo el
proyecto.

---

## Qué es

Web de Boda es una plataforma **SaaS** especializada en la creación de
páginas web para bodas. Permite a una pareja crear una página web profesional
**sin conocimientos de programación**:

1. Seleccionar una plantilla.
2. Personalizarla con un Web Builder visual.
3. Visualizar el resultado en tiempo real (preview).
4. Publicar la página después de realizar el pago.

**Concepto:** "Un Canva especializado en páginas web para bodas."
No es un constructor web general: está especializado en bodas, invitaciones
digitales, información del evento, fotografías, ubicación, invitados y RSVP.

---

## Problema que resuelve

Las parejas necesitan una forma sencilla y profesional de crear una página para
su boda. Las alternativas existentes suelen ser:

- demasiado generales
- técnicas (requieren hosting/configuración)
- con demasiadas opciones
- caras
- complejas

Web de Boda elimina la complejidad técnica. La pareja solo decide:
cómo se ve, qué información muestra, qué fotos usa, dónde es la boda y quiénes
son sus invitados. La plataforma se encarga del resto.

---

## Propuesta de valor (flujo)

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

**Principio comercial:** Free Creation + Paid Publishing. El usuario **no paga
para construir**. La monetización ocurre cuando el usuario intenta **publicar**
("Ya terminé mi página y quiero compartirla").

---

## Objetivo del MVP

El objetivo **no** es muchas funcionalidades. Es validar:

> ¿Las parejas están dispuestas a pagar por publicar una página de boda que
> ellas mismas construyeron?

La funcionalidad más importante del MVP es el **Web Builder** (el corazón del
producto). Las prioridades:

| P | Contenido |
|---|-----------|
| **P0** | Web Builder, Template Engine, Renderer, secciones, temas, plantillas, preview, responsive, autosave, publicación, pago |
| **P1** | Google Maps, Google Drive, SEO, Open Graph, Dashboard, administración de plantillas |
| **P2** | Invitados, RSVP, Invitaciones, Email |
| **P3** | IA, dominios personalizados, analytics avanzados, marketplace |

**Principio de desarrollo:** no desarrollar funcionalidades secundarias antes de
que el Web Builder sea sólido:

```
BUILDER → TEMPLATES → RENDERER → PREVIEW → PUBLICACIÓN → PAGO
```

---

## Modelo de negocio y monetización

Modelo inicial: **pago único** (no depender de suscripciones mensuales; la boda
es un evento puntual).

```
Página
+
Invitados (add-on)
+
Dominio (add-on)
+
Extensión de publicación
```

### Modelo de productos

- **Plan Esencial:** plantilla, Web Builder, personalización, fotografías,
  galería, countdown, ubicación, Google Maps, Google Drive, publicación.
- **Plan Premium:** todo lo anterior + más personalización y opciones de diseño.
- **Plan Invitados:** gestión de invitados, RSVP, invitaciones digitales, email.

### Pricing (estrategia, a validar)

- Pensado para LATAM; no asumir precios altos.
- Validar: disposición de pago, competencia, costos, conversión, margen, duración.
- Probar experimentos de precio (Esencial/Premium/Invitados).
- Evaluar después: publicación por 12/24 meses o permanente, y dominio personalizado.

### Costos (principio)

Priorizar servicios gratuitos o de bajo costo durante el MVP. La infraestructura
debe escalar según usuarios y evitar servicios innecesarios.

---

## Estrategia de lanzamiento

Lanzar con pocas cosas excelentes, no con muchas mediocres:

```
5 plantillas excelentes
+ Builder excelente
+ Preview excelente
+ Publicación
+ Pago
```

**Objetivo de la primera versión:** que el usuario pase de
"Necesito una página para mi boda" a "Esta es mi página y puedo compartirla"
**en una sola sesión**.

---

## Validación y product-market fit

Antes de escalar, validar con usuarios reales:

1. ¿Usan las plantillas?
2. ¿Terminan una página?
3. ¿Llegan al botón publicar?
4. ¿Pagan?
5. ¿Recomiendan el producto?

Especialmente validar: precio, plantillas, funcionalidades premium, duración,
invitados, RSVP.

---

## Reglas

- El usuario puede **crear, editar y previsualizar sin pagar**.
- El usuario **paga para publicar**.
- No añadir complejidad innecesaria. Primero validar, después escalar.

---

## Relaciones

- Se despliega operativamente en `brain/context/02_arquitectura.md`.
- El detalle técnico de pagos está en `brain/context/07_publicacion_y_pagos.md`.
- El roadmap de fases está en `plan.md` secciones 83 y 137.

---

## Decisiones

- Modelo **Free Creation + Paid Publishing** (ADR implícito en plan.md).
- **Pago único** como modelo principal inicial.
- Browser build del experto: **Web Builder como corazón del MVP**.
