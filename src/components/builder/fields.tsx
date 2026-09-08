"use client";

import { useRef, useState } from "react";
import { uploadWeddingImageAction } from "@/app/dashboard/bodas/[id]/actions";
import type { BuilderField, BuilderFieldType } from "@/lib/builder/model";

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-900";

export function FieldInput({
  type,
  value,
  onChange,
  placeholder,
}: {
  type: BuilderFieldType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  if (type === "textarea") {
    return (
      <textarea
        className={`${inputClass} min-h-24 resize-y leading-relaxed`}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
  return (
    <input
      className={inputClass}
      type={type === "url" ? "url" : type === "date" ? "date" : "text"}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
      {children}
    </label>
  );
}

export function ImagePicker({
  label,
  current,
  weddingId,
  section,
  hint,
  onSelect,
  onRemove,
}: {
  label: string;
  current?: string;
  weddingId: string;
  section: string;
  hint?: string;
  onSelect: (url: string) => void;
  onRemove?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined | null) {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.set("weddingId", weddingId);
    formData.set("section", section);
    formData.set("file", file);
    setUploading(true);
    setError(null);
    try {
      const result = await uploadWeddingImageAction(formData);
      if (result.ok && result.url) {
        onSelect(result.url);
      } else {
        setError(result.error ?? "No se pudo subir la imagen");
      }
    } catch {
      setError("No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {current ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt=""
            className="h-16 w-16 rounded-lg border border-neutral-200 object-cover"
          />
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              className="rounded-full border border-neutral-300 px-3 py-1 text-xs hover:border-neutral-900"
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? "Subiendo..." : "Reemplazar"}
            </button>
            {onRemove && (
              <button
                type="button"
                className="rounded-full text-xs text-red-600 hover:underline"
                onClick={onRemove}
              >
                Quitar
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="w-full rounded-lg border border-dashed border-neutral-300 px-3 py-4 text-sm text-neutral-500 hover:border-neutral-900 hover:text-neutral-900"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Subiendo imagen..." : "Subir imagen"}
        </button>
      )}
      {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function renderField({
  field,
  value,
  weddingId,
  section,
  onChange,
}: {
  field: BuilderField;
  value: unknown;
  weddingId: string;
  section: string;
  onChange: (value: unknown) => void;
}) {
  const stringValue = typeof value === "string" ? value : "";
  if (field.type === "image") {
    return (
      <ImagePicker
        key={field.key}
        label={field.label}
        current={
          typeof value === "string" && value.length > 0 ? value : undefined
        }
        weddingId={weddingId}
        section={section}
        hint={field.hint}
        onSelect={(url) => onChange(url)}
        onRemove={() => onChange("")}
      />
    );
  }
  return (
    <div key={field.key}>
      <FieldLabel>{field.label}</FieldLabel>
      <FieldInput
        type={field.type}
        value={stringValue}
        placeholder={field.placeholder}
        onChange={(next) => onChange(next)}
      />
      {field.hint && <p className="mt-1 text-xs text-neutral-400">{field.hint}</p>}
    </div>
  );
}