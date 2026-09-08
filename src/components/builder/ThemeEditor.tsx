"use client";

import type { Theme } from "@/types";

const SWATCH = [
  "t-accent",
  "t-bg",
  "t-accent-soft",
  "t-text",
] as const;

export function ThemeEditor({
  themes,
  currentId,
  onSelect,
}: {
  themes: Theme[];
  currentId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-neutral-400">
        Tema (configuraciones profesionales, sin CSS libre)
      </p>
      {themes.map((theme) => {
        const active = theme.id === currentId;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
              active
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 bg-white hover:border-neutral-400"
            }`}
          >
            <span className="flex -space-x-1.5">
              {SWATCH.map((key) => (
                <span
                  key={key}
                  className="h-5 w-5 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: theme.tokens[key] }}
                />
              ))}
            </span>
            <span className="text-sm font-medium">{theme.name}</span>
            {active && (
              <span className="ml-auto rounded-full bg-neutral-900 px-2.5 py-0.5 text-[11px] text-white">
                Activo
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}