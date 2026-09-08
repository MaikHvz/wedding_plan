import type { Theme, ThemeTokens } from "@/types";

/**
 * Claves de token permitidas (tema restringido, plan.md §16).
 * El usuario no puede inventar tokens: solo estas claves, con valores
 * seguros (sin CSS/HTML libre).
 */
export const THEME_TOKEN_KEYS = [
  "t-bg",
  "t-surface",
  "t-text",
  "t-muted",
  "t-accent",
  "t-accent-soft",
  "t-border",
  "t-radius",
  "t-spacing",
  "t-cta-bg",
  "t-cta-text",
  "t-font-serif",
  "t-font-sans",
] as const;

export type ThemeTokenKey = (typeof THEME_TOKEN_KEYS)[number];

export const isThemeTokenKey = (key: string): key is ThemeTokenKey =>
  (THEME_TOKEN_KEYS as readonly string[]).includes(key);

const UNSAFE_VALUE = /[;{}]|url\(|expression\(|javascript:|@import/i;

/** True si el valor no contiene CSS/HTML potencialmente inseguro. */
export function isSafeTokenValue(value: string): boolean {
  return !UNSAFE_VALUE.test(value);
}

/** Filtra tokens desconocidos e inseguros; solo devuelve claves válidas. */
export function sanitizeThemeTokens(tokens: Record<string, string> | null | undefined): ThemeTokens {
  const clean: ThemeTokens = {};
  if (!tokens) {
    return clean;
  }
  for (const [key, value] of Object.entries(tokens)) {
    if (isThemeTokenKey(key) && isSafeTokenValue(value)) {
      clean[key] = value;
    }
  }
  return clean;
}

const BASE_THEMES: Theme[] = [
  {
    id: "ivory",
    name: "Ivory & Champagne",
    tokens: {
      "t-bg": "#faf7f2",
      "t-surface": "#ffffff",
      "t-text": "#2e2a27",
      "t-muted": "#847a71",
      "t-accent": "#b88746",
      "t-accent-soft": "#f4ece1",
      "t-border": "rgba(184, 135, 70, 0.22)",
      "t-radius": "0.75rem",
      "t-spacing": "6rem",
      "t-cta-bg": "#2e2a27",
      "t-cta-text": "#ffffff",
      "t-font-serif": "var(--font-cormorant), Georgia, serif",
      "t-font-sans": "var(--font-jakarta), sans-serif",
    },
  },
  {
    id: "garden",
    name: "Boho Terracotta",
    tokens: {
      "t-bg": "#faf4ed",
      "t-surface": "#fffdfb",
      "t-text": "#422e28",
      "t-muted": "#8c6c60",
      "t-accent": "#c4623f",
      "t-accent-soft": "#f6e4d9",
      "t-border": "rgba(196, 98, 63, 0.22)",
      "t-radius": "1.25rem",
      "t-spacing": "6rem",
      "t-cta-bg": "#c4623f",
      "t-cta-text": "#ffffff",
      "t-font-serif": "var(--font-playfair), Georgia, serif",
      "t-font-sans": "var(--font-jakarta), sans-serif",
    },
  },
  {
    id: "champagne",
    name: "Imperial Gold",
    tokens: {
      "t-bg": "#fcf9f2",
      "t-surface": "#ffffff",
      "t-text": "#2a261f",
      "t-muted": "#7d725d",
      "t-accent": "#9e7a3b",
      "t-accent-soft": "#f3e9d2",
      "t-border": "rgba(158, 122, 59, 0.25)",
      "t-radius": "0.375rem",
      "t-spacing": "6rem",
      "t-cta-bg": "#2a261f",
      "t-cta-text": "#fdfbf7",
      "t-font-serif": "var(--font-cinzel), Georgia, serif",
      "t-font-sans": "var(--font-jakarta), sans-serif",
    },
  },
  {
    id: "modern-black",
    name: "Metropolitan Noir",
    tokens: {
      "t-bg": "#121214",
      "t-surface": "#1c1c20",
      "t-text": "#f5f5f7",
      "t-muted": "#a1a1aa",
      "t-accent": "#ffffff",
      "t-accent-soft": "#27272a",
      "t-border": "rgba(255, 255, 255, 0.16)",
      "t-radius": "0.125rem",
      "t-spacing": "6rem",
      "t-cta-bg": "#ffffff",
      "t-cta-text": "#121214",
      "t-font-serif": "var(--font-playfair), serif",
      "t-font-sans": "var(--font-jakarta), sans-serif",
    },
  },
  {
    id: "classic-white",
    name: "Costa Riviera",
    tokens: {
      "t-bg": "#f2f8f9",
      "t-surface": "#ffffff",
      "t-text": "#1d333a",
      "t-muted": "#5a7e87",
      "t-accent": "#1f8394",
      "t-accent-soft": "#d7eff2",
      "t-border": "rgba(31, 131, 148, 0.22)",
      "t-radius": "1rem",
      "t-spacing": "6rem",
      "t-cta-bg": "#1f8394",
      "t-cta-text": "#ffffff",
      "t-font-serif": "var(--font-cormorant), Georgia, serif",
      "t-font-sans": "var(--font-jakarta), sans-serif",
    },
  },
  {
    id: "romantic",
    name: "Romantic Rose",
    tokens: {
      "t-bg": "#fdf5f7",
      "t-surface": "#ffffff",
      "t-text": "#482c33",
      "t-muted": "#a06f7b",
      "t-accent": "#c65c74",
      "t-accent-soft": "#f8e0e6",
      "t-border": "rgba(198, 92, 116, 0.22)",
      "t-radius": "1rem",
      "t-spacing": "6rem",
      "t-cta-bg": "#c65c74",
      "t-cta-text": "#ffffff",
      "t-font-serif": "var(--font-playfair), Georgia, serif",
      "t-font-sans": "var(--font-jakarta), sans-serif",
    },
  },
];

/** Tema construido: tokens base validados + overrides sanitizados. */
export interface ResolvedTheme extends Theme {
  tokens: ThemeTokens;
}

const themeMap = new Map<string, Theme>(BASE_THEMES.map((theme) => [theme.id, theme]));

/** Devuelve el tema base por id, o null si no existe. */
export function getTheme(id: string): Theme | null {
  return themeMap.get(id) ?? null;
}

export function getAllThemes(): Theme[] {
  return BASE_THEMES.map((theme) => ({
    id: theme.id,
    name: theme.name,
    tokens: { ...theme.tokens },
  }));
}

/**
 * Devuelve el tema por id aplicando overrides (claves permitidas y valores
 * seguros). Si el id no existe devuelve null. Con `overrides` vacíos y tema
 * inválido no se rompe el renderizado.
 */
export function resolveTheme(
  id: string,
  overrides?: Record<string, string> | null,
): ResolvedTheme | null {
  const base = getTheme(id);
  if (!base && !overrides) {
    return null;
  }
  const tokens: ThemeTokens = {
    ...(base?.tokens ?? {}),
    ...sanitizeThemeTokens(overrides),
  };
  return {
    id,
    name: base?.name ?? id,
    tokens,
  };
}