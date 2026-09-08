/**
 * Template Engine (m03).
 *
 * Define plantillas como metadata + versión + tema + secciones + variantes
 * (plan.md §12), con versionado (ADR-003), variantes validables (§14) y temas
 * restringidos (§16). Incorporar una plantilla nueva = añadir `<slug>.json` en
 * `src/templates/` + una línea en `definitions/`; nunca se reescribe el Builder.
 */

export {
  SECTION_VARIANTS,
  DEFAULT_SECTION_VARIANT,
  isValidVariant,
  safeVariant,
} from "./variants";

export {
  THEME_TOKEN_KEYS,
  type ThemeTokenKey,
  isThemeTokenKey,
  isSafeTokenValue,
  sanitizeThemeTokens,
  getTheme,
  getAllThemes,
  resolveTheme,
  type ResolvedTheme,
} from "./themes";

export { validateTemplateConfig,
  getAllTemplateConfigs,
  getTemplateConfig,
  getTemplateVersions,
  resolveTemplate,
  assertValidTemplates,
  DEFAULT_TEMPLATE,
} from "./registry";

export { syncTemplatesToDb } from "./seed";

import { assertValidTemplates } from "./registry";

void assertValidTemplates();