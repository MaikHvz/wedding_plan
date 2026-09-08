/* eslint-disable @next/next/no-img-element */

"use client";

/**
 * BackgroundImage — fondo fiable y con carga suave para la web de boda (m09).
 *
 * El problema que resuelve: antes los fondos de sección usaban z-index
 * negativos (`-z-10`), frágiles frente al fondo opaco de la página y fáciles
 * de tapar por el contenido/el shader. Aquí, en cambio, el contenedor de fondo
 * se coloca con `z-0` (absoluto, inset-0) y el contenido va por encima con
 * `z-10`, de forma explícita y sin ambigüedad de apilado.
 *
 * Además:
 *  - Fade-in al cargar (clase `bg-reveal`) para que la imagen "aparezca" sin
 *    parpadeo.
 *  - Fallback a gradiente temático si la imagen falla (`onError`) para que
 *    nunca quede un vacío.
 *  - `loading="eager"` para el hero (LCP) y `loading="lazy"` opcional para
 *    fondos secundarios.
 */

import { useState } from "react";

interface BackgroundImageProps {
  src?: string;
  alt?: string;
  className?: string;
  /** Scrim/gradiente que se dibuja encima de la imagen. */
  overlay?: React.ReactNode;
  /** Render de fallback cuando no hay imagen o falla (gradiente por defecto). */
  fallback?: React.ReactNode;
  /** Fondos dentro de listas lejanas (no LCP) → lazy. */
  lazy?: boolean;
  /** Activa el zoom lento tipo Ken Burns sobre la imagen de fondo. */
  kenBurns?: boolean;
}

export function BackgroundImage({
  src,
  alt = "",
  className,
  overlay,
  fallback,
  lazy = false,
  kenBurns = false,
}: BackgroundImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className ?? ""}`}>
      {showImage ? (
        <>
          <img
            src={src as string}
            alt={alt}
            loading={lazy ? "lazy" : "eager"}
            onError={() => setFailed(true)}
            className={`bg-reveal h-full w-full object-cover object-center ${
              kenBurns ? "ken-burns" : ""
            }`}
          />
          {overlay}
        </>
      ) : (
        (fallback ?? (
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--t-accent-soft)]/70 via-[var(--t-bg)]/90 to-[var(--t-bg)]" />
        ))
      )}
    </div>
  );
}
