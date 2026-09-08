# Skill: module-progress

> Cómo registrar el **progreso de cada feature y módulo** en cada cambio, para
> que siempre exista contexto actualizado del sistema.

Esta guía es la referencia. La skill operativa vive en
`.opencode/skills/module-progress/SKILL.md` para que opencode la cargue
automáticamente al detectar el trigger.

---

## Cuándo usar

Usar **siempre que se complete o avance un cambio** en el proyecto (implementación,
refactor, fix, feature). Mantiene actualizado el estado global del sistema.

---

## Qué hace esta skill

1. Actualiza el **estado** de la(s) feature(s) y módulo(s) afectados.
2. Actualiza la tabla de resumen global de `brain/modules/_index.md`.
3. Actualiza la sección "Último cambio registrado" con fecha, feature, módulo y resumen.
4. Asegura que la feature tenga su documento en `brain/features/`.

---

## Estados admitidos

| Ícono | Estado | Significado |
|-------|--------|-------------|
| 📝 | Pendiente | No iniciado |
| 🚧 | En progreso | En desarrollo / parcial |
| ✅ | Finalizado | Completado y verificado |

---

## Procedimiento

### 1. Detectar el módulo afectado

- Ubicar el cambio en uno o más módulos (`m01_foundation` ... `m09_extensiones`).

### 2. Actualizar el documento del módulo

- Marcar la feature con el estado correcto (📝 / 🚧 / ✅).
- Actualizar la fecha si aplica.

### 3. Actualizar el resumen global

- Editar `brain/modules/_index.md`:
  - Estado del módulo en la tabla de resumen.
  - Contadores de features (hechas/total) si aplica.
  - Estado detallado por feature.
  - Sección "Último cambio registrado".

### 4. Verificar coherencia

- La feature afectada tiene documento en `brain/features/` (si no, crearlo con la skill `feature-doc`).
- El estado global refleja la realidad del código.

---

## Reglas del brain (relevantes)

- Mantener el contexto siempre actualizado: cualquier agente debe poder leer el
  estado del sistema desde `brain/modules/_index.md`.
- Usar la leyenda de estados de forma consistente.

---

## Referencias

- Resumen global: `brain/modules/_index.md`.
- Módulos: `brain/modules/mXX_*.md`.
- Features: `brain/features/`.
