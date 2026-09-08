"use client";

export type SaveStatus = "idle" | "saving" | "saved" | "error";
export type BuilderViewport = "desktop" | "tablet" | "mobile";

const STATUS_LABEL: Record<SaveStatus, string> = {
  idle: "Listo",
  saving: "Guardando...",
  saved: "Guardado",
  error: "Error al guardar",
};

export function PreviewToolbar({
  viewport,
  onViewport,
  saveStatus,
}: {
  viewport: BuilderViewport;
  onViewport: (viewport: BuilderViewport) => void;
  saveStatus: SaveStatus;
}) {
  const options: BuilderViewport[] = ["desktop", "tablet", "mobile"];
  return (
    <footer className="flex items-center justify-between gap-4 border-t border-neutral-200 bg-white px-4 py-2.5">
      <span
        className={`text-xs font-medium ${
          saveStatus === "error" ? "text-red-600" : "text-neutral-500"
        }`}
      >
        {STATUS_LABEL[saveStatus]}
      </span>
      <div className="flex gap-1 rounded-full bg-neutral-100 p-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`rounded-full px-4 py-1 text-xs font-medium capitalize transition ${
              viewport === option
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
            onClick={() => onViewport(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </footer>
  );
}