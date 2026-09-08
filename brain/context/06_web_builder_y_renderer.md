# Contexto 06 — Web Builder y WeddingRenderer

> Documento de contexto derivado de `plan.md` (secciones 17–37, 52–53, 91, 105,
> 111, 113). **Es el corazón del producto (P0).**

---

## Objetivo

Definir el Web Builder (editor visual por bloques), su estructura (Sidebar +
Canvas), el modelo del builder y el `WeddingRenderer` (motor único de renderizado).

---

## Filosofía del Builder

El Builder **no** es un editor de diseño general (no compite con Figma/Photoshop).
Es un **editor especializado por bloques para páginas de boda**:

```
Templates
+ Sections
+ Variants
+ Themes
+ Content
```

La IA de desarrollo **nunca** debe convertir el Builder en un editor libre.
Debe permanecer basado en esos 5 pilares.

---

## WeddingRenderer (motor central)

Componente central reutilizable con una sola interfaz:

```ts
WeddingRenderer({
  wedding,
  template,
  theme,
  sections
})
```

**Se usa para:** Demo, Builder, Preview, Página pública.

**Regla (ADR-002 / §53):** no crear `BuilderRenderer` y `PublicRenderer` como
sistemas distintos. Un solo renderer evita `Preview ≠ Página publicada`.

El renderer **recibe datos**; no debe consultar información innecesaria de la
base de datos.

---

## Estructura del Builder

```
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

### Sidebar

- **Contenido:** modificar nombres, fecha, hora, títulos, subtítulos, textos,
  ubicación, enlaces.
- **Secciones:** agregar, eliminar, activar/desactivar, ocultar/mostrar, reordenar.
- **Diseño:** tema, colores, tipografías, estilo.
- **Plantilla:** visualizar la plantilla actual.

### Canvas

- Muestra una representación real de la página.
- Usa el mismo `WeddingRenderer`.

---

## Modelo del Builder (la página como datos)

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
      "data": { "title": "Nuestra boda", "partner1": "Andrea", "partner2": "Sebastián" }
    }
  ]
}
```

---

## Secciones del MVP

| Sección | Propósito | Datos principales |
|---------|-----------|-------------------|
| Hero | Información principal | partner1, partner2, title, subtitle, date, image |
| Couple | Presentación pareja | foto, nombre, descripción |
| Story | Historia | title, content, image |
| Gallery | Fotografías | imágenes (subir/eliminar/reemplazar/ordenar) |
| Countdown | Cuenta regresiva | días/horas/minutos/segundos (usa fecha boda) |
| Event | Información evento | nombre, fecha, hora, lugar, dirección |
| Location | Lugar y mapa | nombre lugar, dirección, Google Maps URL |
| Drive | Enlace a Google Drive | drive_url + instrucciones |
| Footer | Información final | texto |

---

## Autosave

Los cambios se guardan automáticamente con **debounce** (esperar ~800 ms), no una
petición por tecla:

```
Usuario modifica
        ↓
Esperar 800 ms
        ↓
Guardar
        ↓
"Guardado"
```

Estados: `Guardado`, `Guardando...`, `Error al guardar`.

*Undo/Redo no es obligatorio para MVP.*

---

## Responsive Preview

Botones `[Desktop] [Tablet] [Mobile]` para alternar la vista. (Mobile-first, ADR-006.)

---

## Preview sistema

- Preview limpia que oculta herramientas del builder.
- Ruta: `/dashboard/bodas/[id]/preview`.
- Debe parecer una página real.

---

## Reglas

- El Builder controla estado/edición/interacción; el Renderer controla representación visual (plan.md §91).
- No poner toda la lógica en `Builder.tsx`; dividir responsabilidades.
- El renderer recibe datos; no consulta BD directamente (plan.md §113).
- La página se guarda como datos, no HTML (plan.md §23).
- Builder restringido a Templates/Sections/Variants/Themes/Content (plan.md §111).

---

## Criterios de aceptación del Builder

```
[ ] elegir plantilla     [ ] editar contenido      [ ] modificar imágenes
[ ] ver demo             [ ] cambiar tema          [ ] reordenar secciones
[ ] crear boda           [ ] ocultar secciones     [ ] ver mobile/desktop
[ ] cambios guardados    [ ] preview funciona      [ ] página pública usa mismos datos
```

---

## Relaciones

- Datos del builder en `lib/wedding` (ver `brain/context/03`).
- Plantillas y temas en `brain/context/05`.
- Componentes: `components/builder/` y `components/wedding/` (`brain/context/02`).
- Publicación y pagos en `brain/context/07`.

---

## Decisiones

- **ADR-001:** editor por bloques (secciones).
- **ADR-002:** renderer único.
- **ADR-006:** mobile-first.
- Regla del builder basado en pilares (plan.md §111).
