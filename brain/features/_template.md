# Feature: <Nombre de la Feature>

> **Una feature por documento.** Copia esta plantilla al crear una nueva feature.
> Guarda el archivo como `brain/features/<nombre-feature>.md` (slug, minúsculas, guiones).

---

## Metadata

- **Feature ID:** `F-<NNN>`
- **Módulo(s):** `mXX_*` (ver `brain/modules/_index.md`)
- **Estado:** 📝 | 🚧 | ✅
- **Fecha de creación:** (YYYY-MM-DD)
- **Última actualización:** (YYYY-MM-DD)

---

## Objetivo

¿Qué resuelve esta feature? ¿A qué historia de usuario responde?

## Filosofía / Enfoque

¿Cómo encaja con el dominio y la arquitectura del sistema?

## Flujo

Describe el flujo de uso. Usa diagramas de texto o pasos numerados.

```
Paso 1 → Paso 2 → Paso 3 → ... → Resultado
```

## Integración con el sistema principal

¿Cómo se conecta con el WeddingRenderer, el Builder, las plantillas, la
publicación o los pagos? ¿Qué capas (`lib/*`) toca?

## Datos

¿Qué entidades/tablas/campos involucra? (ver `brain/context/03`)

## Reglas

- Reglas de negocio que aplica.
- Restricciones (seguridad, validación).

## UX / Responsive

¿Cómo se comporta en móvil/tablet/desktop?

## Tests / Validación

¿Cómo se valida? Criterios de aceptación.

## Relaciones

- Documentos de contexto relacionados (`brain/context/*`).
- Otros módulos o features relacionados.

## Decisiones

- ADRs o decisiones tomadas para esta feature.

---

## Historial de implementación

| Fecha | Cambio | Estado |
|-------|--------|--------|
| YYYY-MM-DD | Descripción del cambio | 📝/🚧/✅ |
