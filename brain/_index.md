# Índice del Brain — Web de Boda

> **LEER ESTE DOCUMENTO DESPUÉS DE `brain/Brain.md`.**
>
> Todo agente de IA debe seguir este orden de lectura para entender el proyecto
> completo antes de realizar cualquier tarea.

---

## Orden de lectura

Cada nivel asume que ya leíste los anteriores. No saltarse pasos.

### Nivel 0 — Proyecto
```
[0] brain/Brain.md                   ← Visión, arquitectura, reglas y estado
```
→ Siempre leer primero.

### Nivel 1 — Contexto del sistema (según plan.md)
```
[1] brain/context/
  ├── 01_vision.md                   ← Visión, problema, propuesta de valor, modelo de negocio
  ├── 02_arquitectura.md             ← Arquitectura local vs Supabase, capas, estructura del proyecto
  ├── 03_dominio_y_modelo_datos.md   ← Entidades y modelo de datos (local → PostgreSQL futuro)
  ├── 04_rutas_y_estructura.md       ← Rutas de la app y estructura de carpetas/componentes
  ├── 05_sistema_plantillas.md       ← Template Engine, versionado, variantes, temas, categorías
  ├── 06_web_builder_y_renderer.md   ← Builder, Sidebar, Canvas, renderer, secciones, autosave, preview
  ├── 07_publicacion_y_pagos.md      ← Estados, flujo de publicación, checkout, webhook, productos, pricing
  └── 08_seguridad_storage_seo.md    ← RLS/permisos, storage, optimización, SEO, Open Graph, variables de entorno
```
→ Definir el lenguaje del sistema y las reglas de negocio.

### Nivel 2 — Módulos y progreso
```
[2] brain/modules/
  └── _index.md                      ← Estado de cada módulo y de sus features
  (uno por módulo: m01_foundation ... m09_extensiones)
```
→ Conocer qué está hecho, en progreso o pendiente. Esto **siempre** debe
   actualizarse en cada cambio.

### Nivel 3 — Features y decisiones
```
[3] brain/features/
  └── <feature>.md                   ← Documentación de cada feature implementada
```
→ Una feature por documento, con su flujo e integración con el sistema principal.

```
[4] brain/decisions/
  ├── ADR-001..ADR-006               ← Decisiones del plan.md (builder por secciones, renderer único, etc.)
  └── ADR-007                        ← Sistema local (NO Supabase) preparado para migrar
```

### Nivel 4 — Skills de documentación
```
[5] brain/skills/
  ├── feature-doc.md                 ← Cómo documentar una feature nueva
  └── module-progress.md             ← Cómo registrar el progreso de módulos
```

---

## Mapa de dependencias del sistema

```text
                ┌─────────────┐
                │   Brain     │
                └──────┬──────┘
                       │
              ┌────────┼─────────┐
              ▼        ▼         ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │Templates │ │  Themes  │ │ Sections │
        └─────┬────┘ └────┬─────┘ └────┬─────┘
              │           │            │
              ▼           ▼            ▼
        ┌────────────────────────────────┐
        │      Template Engine           │
        └──────────────┬─────────────────┘
                       ▼
        ┌────────────────────────────────┐
        │          WeddingRenderer       │
        └──────┬──────────┬──────────────┘
               ▼          ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │    Demo    │ │  Builder   │ │  Public    │
       └────────────┘ └─────┬──────┘ └─────┬──────┘
                            │              │
                            ▼              ▼
                     ┌────────────┐ ┌────────────┐
                     │  Preview   │ │ Publication│
                     └────────────┘ └─────┬──────┘
                                          ▼
                                     ┌────────────┐
                                     │   Pagos    │
                                     └────────────┘
```

---

## Reglas para agentes de IA

1. **Siempre leer `brain/Brain.md` primero** antes de cualquier tarea.
2. **Seguir el orden de lectura** — no asumir conocimiento de módulos no leídos.
3. **No modificar documentos existentes** sin respetar las decisiones ya tomadas.
4. **Siempre reutilizar conceptos existentes** antes de crear nuevos.
5. **Evitar duplicación de entidades** — si un concepto ya existe, usarlo.
6. **Ante cualquier ambigüedad**, volver a `brain/context/` y validar.
7. **Ante cualquier cambio**, documentar la feature y actualizar el progreso del
   módulo (skills `feature-doc` y `module-progress`).
8. **No implementar funcionalidades sin documentación** — primero diseñar el contexto.
9. **Arquitectura local hoy, Supabase mañana** — toda integración pasa por la capa
   de abstracción (`lib/data`, `lib/auth`, `lib/storage`, `lib/payments`). No acoplar
   el código directamente a Supabase mientras usamos el sistema local.

---

## Documentos del proyecto

| Documento | Ruta |
|-----------|------|
| Fuente de requerimientos | `plan.md` |
| Contexto maestro | `brain/Brain.md` |
| Índice del brain | `brain/_index.md` |
| Contexto del sistema | `brain/context/` |
| Módulos y progreso | `brain/modules/` |
| Features | `brain/features/` |
| Decisiones (ADR) | `brain/decisions/` |
