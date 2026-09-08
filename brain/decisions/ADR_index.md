# ¿Índice de Decisiones Arquitectónicas (ADRs)

> Registro de decisiones arquitectónicas del proyecto. Ver `plan.md` y
> `brain/context/*` para el detalle de cada una.

---

## ADR-001 — Builder por secciones

**Decisión:** usar editor basado en bloques (secciones).
**Motivo:** mantiene control de diseño y responsive.

Ver `brain/context/06_web_builder_y_renderer.md`.

---

## ADR-002 — Renderer único

**Decisión:** Builder y producción comparten el mismo renderer (`WeddingRenderer`).
**Motivo:** evita diferencias entre preview y página publicada.

Ver `brain/context/06`.

---

## ADR-003 — Templates versionados

**Decisión:** cada boda almacena `template_version`.
**Motivo:** evitar breaking changes al actualizar una plantilla.

Ver `brain/context/05`.

---

## ADR-004 — Publicación mediante pago confirmado

**Decisión:** el backend controla la publicación.
**Motivo:** seguridad (nunca confiar en el frontend).

Ver `brain/context/07`.

---

## ADR-005 — Google Drive mediante enlace

**Decisión:** no sincronizar Drive; solo compartir enlace.
**Motivo:** reducir complejidad y costos.

Ver `brain/context/08`.

---

## ADR-006 — Mobile-first

**Decisión:** diseñar principalmente para teléfonos.
**Motivo:** las invitaciones se consumen principalmente en móvil.

Ver `brain/context/06`, `brain/context/04`.

---

## ADR-007 — Sistema local (NO Supabase) preparado para migrar

**Decisión:** durante el desarrollo y el MVP se usa un sistema **100% local**
(SQLite, auth local, storage local) en lugar de Supabase.
**Motivo:** reducir costos y velocidad durante el MVP, sin renunciar a migrar a
Supabase después.
**Condición:** **cada integración debe pasar por capas de abstracción**
(`lib/data`, `lib/auth`, `lib/storage`, `lib/payments`) con interfaces estables,
de modo que migrar local → Supabase no requiera reescribir la aplicación.

Ver `brain/context/02_arquitectura.md`, `brain/modules/m01_foundation.md`.

---

## Consecuencias de ADR-007

- **Hoy:** SQLite local, auth local, storage local, pagos **simulados localmente** (sin pasarela API).
- **Mañana:** Supabase PostgreSQL + Auth + Storage + Vercel, reemplazando solo la
  implementación interna de cada capa. Al desplegar se integra la pasarela de pago real por API.
- **Obligación:** el código de la app no importa Supabase directamente ni consulta
  tablas fuera de `lib/data`.
