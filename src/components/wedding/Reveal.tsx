"use client";

/**
 * Reveal — animación de entrada por scroll (m09 · ambientación interactiva).
 *
 * Cliente mínimo con IntersectionObserver: cuando el bloque entra en el
 * viewport se le añade la clase `.is-revealed`, que dispara la transición
 * CSS definida en `globals.css` (fade + desplazamiento). SSR-safe: el HTML
 * inicial no depende de JS y `prefers-reduced-motion` lo desactiva.
 */

import { useEffect, useRef } from "react";

type RevealDirection = "up" | "left" | "right" | "scale";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Dirección desde la que entra el bloque. */
  from?: RevealDirection;
  /** Retardo en ms añadido al inicio de la transición. */
  delay?: number;
  /** Margen del IntersectionObserver (px). */
  rootMargin?: string;
  /** Si se anima una sola vez (true) o cada vez que entra/sale. */
  once?: boolean;
}

export function Reveal({
  children,
  className,
  from = "up",
  delay = 0,
  rootMargin = "0px 0px -10% 0px",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      node?.classList.add("is-revealed");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove("is-revealed");
          }
        }
      },
      { threshold: 0.12, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return (
    <div
      ref={ref}
      data-reveal
      data-reveal-from={from === "up" ? "up" : from}
      className={className}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
