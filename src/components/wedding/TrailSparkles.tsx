"use client";

/**
 * TrailSparkles — rastro de chispas que siguen al ratón, "firma" de Elegance
 * (m09). Al mover el puntero sobre la página se emiten pequeñas chispas
 * doradas que se desvanecen en ~0.8s. Throttled por requestAnimationFrame.
 * SSR-safe: el contenedor solo se pinta con el primer mousemove.
 */

import { useEffect, useRef, useState } from "react";

interface Spark extends React.CSSProperties {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

let idSeq = 0;

export function TrailSparkles() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [active, setActive] = useState(false);
  const lastRef = useRef(0);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    function onMove(event: MouseEvent) {
      setActive(true);
      const now = performance.now();
      if (now - lastRef.current < 90) return;
      lastRef.current = now;
      const size = 4 + Math.random() * 6;
      const spark: Spark = {
        id: idSeq++,
        left: event.clientX - size / 2,
        top: event.clientY - size / 2,
        width: size,
        height: size,
      };
      setSparks((prev) => [...prev.slice(-14), spark]);
      window.setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== spark.id));
      }, 850);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="trail-spark"
          style={{
            left: spark.left,
            top: spark.top,
            width: spark.width,
            height: spark.height,
          }}
        />
      ))}
    </div>
  );
}