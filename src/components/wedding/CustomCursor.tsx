"use client";

/**
 * CustomCursor — cursor decorativo "firma" de la plantilla Urbana (m09).
 *
 * Punto dorado + anillo que siguen al puntero. Solo en pantallas con puntero
 * fino (`hover:hover`). El cursor nativo se oculta vía CSS
 * (`.has-custom-cursor`) y los elementos interactivos agrandan el anillo.
 * SSR-safe: no hay estado inicial visible; se activa con el primer mousemove.
 */

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const dot = dotRef.current as HTMLDivElement;
    const ring = ringRef.current as HTMLDivElement;
    if (!dot || !ring) return;
    document.body.classList.add("has-custom-cursor");

    let raf = 0;
    function move(event: MouseEvent) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        dot.style.left = `${event.clientX}px`;
        dot.style.top = `${event.clientY}px`;
        ring.style.left = `${event.clientX}px`;
        ring.style.top = `${event.clientY}px`;
      });
    }
    function over(event: MouseEvent) {
      const target = event.target as HTMLElement;
      setHovering(Boolean(target.closest("a, button, [role='button'], input, textarea, select, summary")));
    }
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <div className="custom-cursor-box" aria-hidden>
      <div ref={ringRef} className={`custom-cursor-ring ${hovering ? "is-hovering" : ""}`} />
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
}