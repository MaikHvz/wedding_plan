---
name: module-progress
description: Use when finishing, advancing, or changing any feature or module in the Wedding Web Builder project. Updates brain/modules/_index.md and brain/modules/mXX_*.md with the feature and module progress states (pending/in-progress/done), keeps the global system state and "last change" section current so there is always context of the system. Trigger after any code change, commit, or feature completion.
---

# Skill: module-progress

Registra el **progreso de cada feature y módulo** del proyecto para mantener
siempre contexto actualizado del sistema.

---

## Qué hacer

1. **Detectar los módulos afectados** por el cambio (`m01_foundation` ... `m09_extensiones`).
2. **Actualizar el documento del módulo** (`brain/modules/mXX_*.md`): marcar la
   feature con el estado correcto (📝/🚧/✅).
3. **Actualizar el resumen global** (`brain/modules/_index.md`):
   - estado del módulo en la tabla de resumen
   - estado detallado por feature
   - sección "Último cambio registrado" (fecha, feature, módulo, resumen)
4. **Verificar** que la feature afectada tenga documento en `brain/features/`
   (si no, crearlo con la skill `feature-doc`).

---

## Estados admitidos

| Ícono | Estado | Significado |
|-------|--------|-------------|
| 📝 | Pendiente | No iniciado |
| 🚧 | En progreso | En desarrollo / parcial |
| ✅ | Finalizado | Completado y verificado |

---

## Procedimiento

```
Cambio aplicado
        ↓
¿Qué módulo(s) afecta? (m01..m09)
        ↓
Actualizar brain/modules/mXX_*.md
        ↓
Actualizar brain/modules/_index.md (resumen + último cambio)
        ↓
¿Existe la feature en brain/features/?  (si no → feature-doc)
        ↓
Verificar coherencia global
```

---

## Reglas del brain

- Mantener `brain/modules/_index.md` como fuente de verdad del estado.
- Cualquier agente debe poder leer el estado del sistema desde ese archivo.
- Usar la leyenda de estados de forma consistente.

---

## Referencias

- Resumen global: `brain/modules/_index.md`
- Módulos: `brain/modules/mXX_*.md`
- Guía detallada: `brain/skills/module-progress.md`
