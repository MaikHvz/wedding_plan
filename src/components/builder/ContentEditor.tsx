"use client";

import { useState } from "react";
import {
  buildWeddingFields,
  SECTION_FIELDS,
  SECTION_LABELS,
} from "@/lib/builder/model";
import type { BuilderPageState, BuilderSection } from "@/lib/builder/model";
import type { SectionType } from "@/types";
import { ImagePicker, renderField, FieldInput, FieldLabel } from "./fields";

export function ContentEditor({
  weddingId,
  page,
  selectedId,
  onSelectSection,
  onWeddingField,
  onSectionField,
  onGallery,
}: {
  weddingId: string;
  page: BuilderPageState;
  selectedId: string | null;
  onSelectSection: (id: string) => void;
  onWeddingField: (key: keyof BuilderPageState, value: string) => void;
  onSectionField: (
    sectionId: string,
    key: string,
    value: unknown,
  ) => void;
  onGallery: (sectionId: string, urls: string[]) => void;
}) {
  const selected = page.sections.find((section) => section.id === selectedId) ?? null;
  const enabledSections = page.sections.filter((section) => section.enabled);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Datos de la boda
        </h3>
        {buildWeddingFields(page).map((field) => (
          <div key={field.key}>
            <FieldLabel>{field.label}</FieldLabel>
            <FieldInput
              type={
                field.key === "eventDate"
                  ? "date"
                  : field.key === "mapsUrl" || field.key === "driveUrl"
                    ? "url"
                    : "text"
              }
              value={field.value}
              placeholder={field.label}
              onChange={(value) => onWeddingField(field.key, value)}
            />
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Contenido de secciones
        </h3>

        {enabledSections.length > 1 && (
          <div>
            <FieldLabel>Sección a editar</FieldLabel>
            <select
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
              value={selectedId ?? ""}
              onChange={(event) => onSelectSection(event.target.value)}
            >
              <option value="" disabled>
                Elige una sección
              </option>
              {enabledSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {indexOf(page.sections, section.id) + 1}. {SECTION_LABELS[section.type]}
                </option>
              ))}
            </select>
          </div>
        )}

        {selected ? (
          <SectionFields
            weddingId={weddingId}
            section={selected}
            onChange={(key, value) => onSectionField(selected.id, key, value)}
            onGallery={(urls) => onGallery(selected.id, urls)}
          />
        ) : (
          <p className="rounded-lg border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-400">
            Selecciona una sección para editar su contenido.
          </p>
        )}
      </section>
    </div>
  );
}

function indexOf(sections: BuilderSection[], id: string): number {
  const index = sections.findIndex((section) => section.id === id);
  return index < 0 ? 0 : index;
}

function SectionFields({
  weddingId,
  section,
  onChange,
  onGallery,
}: {
  weddingId: string;
  section: BuilderSection;
  onChange: (key: string, value: unknown) => void;
  onGallery: (urls: string[]) => void;
}) {
  const fields = SECTION_FIELDS[section.type];

  if (section.type === "gallery") {
    return (
      <GalleryEditor
        weddingId={weddingId}
        urls={Array.isArray(section.data.images) ? section.data.images : []}
        onChange={onGallery}
      />
    );
  }

  if (fields.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-400">
        Esta sección ({SECTION_LABELS[section.type as SectionType]}) se genera
        con los datos de la boda y no necesita contenido extra.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {fields.map((field) =>
        renderField({
          field,
          value: section.data[field.key],
          weddingId,
          section: section.type,
          onChange: (value) => onChange(field.key, value),
        }),
      )}
    </div>
  );
}

function GalleryEditor({
  weddingId,
  urls,
  onChange,
}: {
  weddingId: string;
  urls: string[];
  onChange: (urls: string[]) => void;
}) {
  const [images, setImages] = useUrls(urls);

  function update(next: string[]) {
    setImages(next);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        Fotografías de la galería
      </p>
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Quitar imagen"
                className="absolute right-1 top-1 rounded-full bg-neutral-900/70 px-1.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                onClick={() =>
                  update(images.filter((_, i) => i !== index))
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <ImagePicker
        label="Agregar foto"
        current={undefined}
        weddingId={weddingId}
        section="gallery"
        hint="Máximo 10 MB. Acepta jpeg, png, webp, gif y avif."
        onSelect={(url) => update([...images, url])}
      />
    </div>
  );
}

function useUrls(initial: string[]) {
  const [urls, setUrls] = useState<string[]>(initial);
  return [urls, setUrls] as const;
}