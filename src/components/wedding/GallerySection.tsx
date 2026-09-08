/* eslint-disable @next/next/no-img-element */

"use client";

import { useCallback, useEffect, useState } from "react";
import type { SectionComponentProps } from "./WeddingRenderer";
import type { SectionDataMap } from "@/types";

/**
 * GallerySection — galería interactiva (m09).
 *
 * - Lightbox: clic en una foto abre una vista completa con navegación
 *   (prev/next), teclado (esc/←/→) y cierre por fondo.
 * - Zoom suave al pasar el ratón sobre cada foto.
 * - Tamaños variados: la grilla alterna proporciones editoriales y el layout
 *   "masonry" usa columnas CSS con la proporción natural de cada imagen.
 */

function GalleryHeader() {
  return (
    <>
      <p className="mb-3 text-center text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Galería</p>
      <div className="mb-10 h-px w-16 mx-auto bg-[var(--t-accent)]" />
    </>
  );
}

/** Aspect ratios variados (patrón editorial) para grilla. */
const GRID_ASPECTS = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-square",
  "aspect-[3/4]",
];

function Art(
  { src, alt, index, className, onOpen }: {
    src: string;
    alt: string;
    index: number;
    className?: string;
    onOpen: (index: number) => void;
  },
) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Ver foto ${index + 1} en grande`}
      className={`group relative block w-full overflow-hidden rounded-[var(--t-radius)] ${className ?? "aspect-square"}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <span className="absolute inset-0 bg-[var(--t-accent)] opacity-0 transition-opacity duration-500 group-hover:opacity-15" />
    </button>
  );
}

interface LightboxProps {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onNav: (next: number) => void;
}

function Lightbox({ images, index, title, onClose, onNav }: LightboxProps) {
  const previous = index > 0 ? index - 1 : images.length - 1;
  const next = index < images.length - 1 ? index + 1 : 0;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNav(previous);
      if (event.key === "ArrowRight") onNav(next);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onNav, previous, next]);

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${index + 1} de ${images.length}`}
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-2xl text-white transition hover:bg-black/70"
        onClick={onClose}
      >
        ✕
      </button>

      <button
        type="button"
        aria-label="Foto anterior"
        className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-xl text-white transition hover:bg-black/70 sm:left-6"
        onClick={(event) => {
          event.stopPropagation();
          onNav(previous);
        }}
      >
        ←
      </button>

      <img
        src={images[index]}
        alt={`${title} — foto ${index + 1}`}
        className="max-h-[84svh] max-w-full rounded-lg object-contain shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      />

      <button
        type="button"
        aria-label="Foto siguiente"
        className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-xl text-white transition hover:bg-black/70 sm:right-6"
        onClick={(event) => {
          event.stopPropagation();
          onNav(next);
        }}
      >
        →
      </button>

      <p className="mt-4 font-serif tracking-wide text-white/80">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}

export function GallerySection({ data, variant }: SectionComponentProps) {
  const gallery = data as SectionDataMap["gallery"];
  const images = gallery.images ?? [];
  const [open, setOpen] = useState<number | null>(null);
  const v = variant ?? "grid";

  const onOpen = useCallback((index: number) => setOpen(index), []);
  const onNav = useCallback((index: number) => setOpen(index), []);
  const onClose = useCallback(() => setOpen(null), []);

  if (!images.length) return null;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto w-full max-w-5xl">
        <GalleryHeader />

        {v === "carousel" && (
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
            {images.map((src, i) => (
              <Art
                key={i}
                src={src}
                alt={`Foto ${i + 1}`}
                index={i}
                className="h-72 w-56 flex-shrink-0 snap-center sm:h-80 sm:w-64"
                onOpen={onOpen}
              />
            ))}
          </div>
        )}

        {v === "masonry" && (
          <div className="columns-2 gap-3 sm:columns-3">
            {images.map((src, i) => (
              <div key={i} className="mb-3 break-inside-avoid">
                <Art src={src} alt={`Foto ${i + 1}`} index={i} className="aspect-auto" onOpen={onOpen} />
              </div>
            ))}
          </div>
        )}

        {v === "editorial" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
            <Art src={images[0]} alt="Foto destacada" index={0} className="aspect-[4/5]" onOpen={onOpen} />
            <div className="grid grid-rows-2 gap-4">
              {images.slice(1, 3).map((src, i) => (
                <Art key={i} src={src} alt={`Foto ${i + 2}`} index={i + 1} className="h-full" onOpen={onOpen} />
              ))}
              {images.length === 1 && <div className="rounded-[var(--t-radius)] bg-[var(--t-accent-soft)]" />}
            </div>
            {images.length > 3 && (
              <div className="mt-4 grid col-span-full grid-cols-2 gap-4 sm:grid-cols-3">
                {images.slice(3, 6).map((src, i) => (
                  <Art
                    key={i}
                    src={src}
                    alt={`Foto ${i + 4}`}
                    index={i + 3}
                    className={GRID_ASPECTS[i]}
                    onOpen={onOpen}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {v === "grid" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((src, i) => (
              <Art
                key={i}
                src={src}
                alt={`Foto ${i + 1}`}
                index={i}
                className={GRID_ASPECTS[i % GRID_ASPECTS.length]}
                onOpen={onOpen}
              />
            ))}
          </div>
        )}
      </div>

      {open !== null && (
        <Lightbox images={images} index={open} title="Galería" onClose={onClose} onNav={onNav} />
      )}
    </section>
  );
}