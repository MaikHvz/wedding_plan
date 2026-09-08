---
name: feature-doc
description: Use when creating, implementing, or finishing any feature in the Wedding Web Builder project. Creates/updates brain/features/<slug>.md documenting the feature's objective, flow, and integration with the main system (WeddingRenderer, Builder, Template Engine, publication, payments). Trigger on feature implementation, new sections, screens, flows, or command-documented features.
---

# Skill: feature-doc

Documenta **cada feature nueva** del proyecto Wedding Web Builder y su **flujo de
integración con el sistema principal**. Garantiza que el Brain se mantiene al día.

---

## Qué hacer

1. **Identificar la feature y su módulo** usando `brain/modules/_index.md`.
2. **Crear o actualizar** `brain/features/<slug>.md` (usar `brain/features/_template.md`).
3. **Documentar el flujo** y la **integración con el sistema principal**.
4. **Enlazar** con los documentos de contexto y ADRs relevantes.
5. **Registrar el progreso** (ver skill `module-progress`).

---

## Estructura obligatoria del documento de feature

- Objetivo
- Filosofía / Enfoque
- Flujo (pasos numerados o diagrama de texto)
- Integración con el sistema principal (qué capas `lib/*` y componentes toca:
  WeddingRenderer, Builder, Template Engine, publicación, pagos)
- Datos (entidades/tablas implicadas)
- Reglas (negocio, seguridad, validación)
- UX / Responsive
- Tests / Validación
- Relaciones (contexto + ADRs)
- Historial de implementación

---

## Flujo de trabajo

```
Feature a implementar
        ↓
Identificar módulo (brain/modules/_index.md)
        ↓
Definir slug de feature
        ↓
Crear/actualizar brain/features/<slug>.md
        ↓
Documentar flujo + integración con el sistema
        ↓
Actualizar módulo (mXX_*.md) y resumen global
```

---

## Reglas del brain

- Reutilizar conceptos existentes; evitar duplicación.
- No implementar sin antes tener el contexto documentado.
- Respetar las decisiones de arquitectura (local hoy, Supabase después; renderer único; etc.).

---

## Referencias

- Plantilla: `brain/features/_template.md`
- Módulos: `brain/modules/_index.md`
- Contexto: `brain/context/`
- Guía detallada: `brain/skills/feature-doc.md`
