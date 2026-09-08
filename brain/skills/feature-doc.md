# Skill: feature-doc

> Cómo documentar **cada feature nueva** que se implementa y su **flujo de
> integración con el sistema principal** (WeddingRenderer, Builder, plantillas,
> publicación, pagos).

Esta guía es la referencia. La skill operativa vive en
`.opencode/skills/feature-doc/SKILL.md` para que opencode la cargue
automáticamente al detectar el trigger.

---

## Cuándo usar

Usar **cada vez que se implementa (o se empieza a implementar) una feature** del
proyecto: una nueva sección, una pantalla, un flujo de publicación, un proceso de
pago, etc.

---

## Qué hace esta skill

1. Determina a qué **feature** y **módulo(s)** pertenece el trabajo.
2. Crea o actualiza el documento `brain/features/<slug>.md`.
3. Documenta el **flujo** de la feature y su **integración** con el sistema principal.
4. Enlaza la feature con los documentos de contexto y ADRs relevantes.

---

## Procedimiento

### 1. Identificar la feature y el módulo

- Revisar `brain/modules/_index.md` para ver el módulo al que pertenece.
- Elegir/confirmar un **slug** de feature: `brain/features/<slug>.md` (minúsculas, guiones).

### 2. Crear o actualizar el documento de la feature

Usar la plantilla `brain/features/_template.md` como base. Incluir siempre:

- **Objetivo**
- **Filosofía / Enfoque**
- **Flujo** (pasos numerados o diagrama de texto)
- **Integración con el sistema principal** (qué capas/componentes toca: el
  WeddingRenderer, Builder, Template Engine, publicación, pagos, `lib/*`)
- **Datos** (entidades/tablas implicadas)
- **Reglas** (de negocio, seguridad, validación)
- **UX / Responsive**
- **Tests / Validación**
- **Relaciones** (contexto y ADRs)
- **Historial de implementación**

### 3. Registrar el progreso

- Actualizar el **módulo** correspondiente en `brain/modules/mXX_*.md`.
- Actualizar el **resumen global** en `brain/modules/_index.md` (estado + contador
  + última feature).

### 4. Verificar

- La feature queda documentada **antes** de darla por terminada.
- La página guarda coherencia con `brain/context/*` y `brain/decisions/*`.

---

## Reglas del brain (relevantes)

- Reutilizar conceptos existentes; evitar duplicación.
- No modificar documentos sin respetar decisiones tomadas.
- No implementar sin antes tener el contexto documentado.

---

## Referencias

- Plantilla: `brain/features/_template.md`.
- Módulos: `brain/modules/_index.md`.
- Contexto: `brain/context/`.
