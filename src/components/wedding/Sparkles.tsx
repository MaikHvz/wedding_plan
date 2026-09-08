"use client";

/**
 * Sparkles — destellos / chispitas que acompañan la carga de la web (m09).
 *
 * Capa decorativa (`aria-hidden`) que titila y flota suavemente sobre la
 * portada. Es 100% CSS (`globals.css`): cada chispa usa `--tw-dur` y
 * `--tw-delay` para su ritmo de parpadeo. SSR-safe y desactivado por
 * `prefers-reduced-motion`. También pinta el brillo tipo lente que cruza
 * la portada al cargar (`.hero-glint`).
 */

const SPARKS = [
  { left: "6%", top: "18%", size: 6, dur: "2.6s", delay: "0s" },
  { left: "14%", top: "68%", size: 5, dur: "3.4s", delay: "0.6s" },
  { left: "24%", top: "30%", size: 4, dur: "2.2s", delay: "1.1s" },
  { left: "36%", top: "78%", size: 6, dur: "3.8s", delay: "0.3s" },
  { left: "48%", top: "22%", size: 5, dur: "2.9s", delay: "1.6s" },
  { left: "60%", top: "72%", size: 4, dur: "3.2s", delay: "0.9s" },
  { left: "71%", top: "35%", size: 6, dur: "2.4s", delay: "0.4s" },
  { left: "82%", top: "62%", size: 5, dur: "3.6s", delay: "1.3s" },
  { left: "90%", top: "24%", size: 4, dur: "2.8s", delay: "0.2s" },
  { left: "94%", top: "70%", size: 6, dur: "3.1s", delay: "1.9s" },
];

export function Sparkles() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
    >
      {SPARKS.map((spark, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            left: spark.left,
            top: spark.top,
            width: spark.size,
            height: spark.size,
            ["--tw-dur" as string]: spark.dur,
            ["--tw-delay" as string]: spark.delay,
            animationDelay: `${spark.delay}, ${spark.delay}`,
          }}
        />
      ))}
    </div>
  );
}

/** Brillo tipo lente que cruza la portada al cargar. */
export function HeroGlint() {
  return (
    <div
      aria-hidden
      className="hero-glint pointer-events-none absolute -inset-0 z-[2] w-[45%] bg-gradient-to-r from-transparent via-[var(--t-accent-soft)] to-transparent opacity-40 blur-2xl"
    />
  );
}
