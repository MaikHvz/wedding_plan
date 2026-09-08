"use client";

/**
 * MusicPlayer — música de ambiente para la web de boda (m09).
 *
 * Reproductor flotante (botón fijo abajo-derecha) que reproduce un audio de
 * fondo en bucle. Antes de la primera interacción el navegador bloquea el
 * autoplay con sonido; por eso intentamos reproducir automáticamente y, si
 * falla, mostramos el botón para que el invitado pulse "play" (primera
 * interacción desbloquea el audio). Estado persistente en la sesión.
 *
 * SSR-safe: se monta en cliente. `prefers-reduced-motion` es respetado por
 * CSS para el botón.
 */

import { useEffect, useRef, useState } from "react";

interface MusicPlayerProps {
  /** URL del audio (mp3/ogg). Si está vacía no se muestra el reproductor. */
  src?: string;
}

export function MusicPlayer({ src }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.6;
    audioRef.current = audio;

    // Intenta autoplay; si el navegador lo bloquea, el botón queda como play.
    const attempt = audio.play();
    if (attempt !== undefined) {
      attempt
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src]);

  // Persiste "has played" para no reautoplay molesto al recargar.
  useEffect(() => {
    const stored = window.sessionStorage.getItem("wedding-music-started");
    initRef.current = stored === "1";
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
      setPlaying(true);
      window.sessionStorage.setItem("wedding-music-started", "1");
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  if (!src) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pausar música" : "Reproducir música"}
      title={playing ? "Pausar música" : "Reproducir música"}
      className={`music-btn-pulse fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-[var(--t-border)] bg-[var(--t-surface)]/90 text-[var(--t-accent)] shadow-lg backdrop-blur-md transition active:scale-95`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className={`h-6 w-6 ${playing ? "music-spinning" : ""}`}
      >
        {playing ? (
          <>
            <path d="M9 18V6l10-2v12" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="16" cy="16" r="3" />
          </>
        ) : (
          <>
            <path d="M9 18V6l10-2v12" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="16" cy="16" r="3" />
            <path d="M9 6 19 4" />
          </>
        )}
      </svg>
    </button>
  );
}
