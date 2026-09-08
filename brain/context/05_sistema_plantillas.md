# Contexto 05 — Sistema de Plantillas (Template Engine)

> Documento de contexto derivado de `plan.md` (secciones 9–16, 68–70, 112).

---

## Objetivo

Definir cómo se modelan, versionan y reutilizan las plantillas. Las plantillas
**no** son páginas independientes programadas desde cero: se componen de
secciones + variantes + tema a través de un **Template Engine**.

---

## Arquitectura de una plantilla

```
Template
├── Metadata
├── Version
├── Theme
├── Sections
└── Variants
```

### Ejemplo (`config_json` de una plantilla)

```json
{
  "id": "elegance",
  "name": "Elegance",
  "version": 1,
  "sections": [
    { "type": "hero",      "variant": "fullscreen" },
    { "type": "couple",    "variant": "editorial" },
    { "type": "story",     "variant": "timeline" },
    { "type": "gallery",   "variant": "carousel" },
    { "type": "countdown", "variant": "minimal" },
    { "type": "event",     "variant": "classic" },
    { "type": "location",  "variant": "split" },
    { "type": "drive",     "variant": "button" },
    { "type": "footer",    "variant": "classic" }
  ]
}
```

Una plantilla nueva (ej. `boho.json`) debe poder incorporarse **sin reescribir
el Builder**.

---

## Versionado de plantillas

Cada plantilla tiene:

```
template_id     (ej. "elegance")
template_version (ej. 1)
```

Cada boda guarda `template_id` + `template_version`. Si se crea `elegance v2`,
las bodas existentes con v1 **continúan funcionando**. Una actualización de
plantilla **nunca** debe romper automáticamente páginas ya creadas.

---

## Variantes

Los componentes permiten variantes para reutilizar secciones en muchas plantillas.

**Hero:** classic, fullscreen, split, minimal
**Gallery:** carousel, grid, masonry, editorial
**Story:** classic, timeline, editorial, minimal
**Location:** classic, split, centered

---

## Temas

Un tema controla: colores, tipografías, botones, bordes, radios, espaciado,
fondos y estilo visual.

Ejemplos: Ivory Elegance, Romantic Rose, Champagne, Garden, Modern Black,
Classic White.

**Regla del sistema de temas:** el usuario NO debe poder romper fácilmente el
diseño. En el MVP **no** se permite CSS personalizado, valores ilimitados ni
edición directa de CSS/HTML. Se usan configuraciones profesionales.

---

## Categorías de plantillas

Elegante, Romántica, Minimalista, Moderna, Floral, Natural, Luxury.

---

## Primeras plantillas (5)

```
01 Elegance
02 Romantic
03 Minimal
04 Garden
05 Luxury
```

Cada una debe tener: demo, mobile, desktop, variantes, tema y las secciones
Hero, Couple, Story, Gallery, Countdown, Event, Location, Drive, Footer.

---

## Licencias

- Plantillas originales o recursos con licencia compatible (Google Fonts, iconos
  open source, fotografías propias/generadas, uso comercial).
- Nunca copiar un diseño comercial directamente.
- Registrar recursos en `LICENSES.md`: nombre, autor, origen, URL, licencia,
  fecha de revisión, uso comercial, atribución.

---

## Reglas

- Una plantilla nueva se agrega como configuración (`<slug>.json`), sin reescribir el Builder.
- Cada boda guarda versión de plantilla (ADR-003).
- Temas restringidos (sin CSS libre) para mantener calidad visual (plan.md §16).

---

## Relaciones

- Las secciones las renderiza `WeddingRenderer` (`brain/context/06`).
- Datos de plantillas en `templates` (`brain/context/03`).
- Estructura en `components/templates/` y `lib/templates/` (`brain/context/02`).

---

## Decisiones

- Template Engine en lugar de páginas independientes (plan.md §12).
- Versionado obligatorio (ADR-003).
- Temas restringidos (plan.md §16).
