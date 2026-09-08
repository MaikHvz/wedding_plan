"use client";

import { useEffect, useState } from "react";
import type { SectionComponentProps } from "./WeddingRenderer";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diffFromTarget(target: string): TimeLeft | null {
  const targetTime = new Date(target.replace(" ", "T"));
  if (Number.isNaN(targetTime.getTime())) {
    return null;
  }
  const diff = targetTime.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeCard({ value, label, big }: { value: number; label: string; big?: boolean }) {
  if (big) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-24 w-28 items-center justify-center rounded-[var(--t-radius)] bg-[var(--t-surface)] font-serif text-5xl font-bold tabular-nums text-[var(--t-accent)] shadow-sm sm:h-28 sm:w-32 sm:text-6xl">
          {String(value).padStart(2, "0")}
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--t-muted)]">{label}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-16 w-16 items-center justify-center rounded-[var(--t-radius)] bg-[var(--t-surface)] font-serif text-2xl font-bold tabular-nums text-[var(--t-accent)] shadow-sm sm:h-20 sm:w-20 sm:text-3xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--t-muted)]">{label}</span>
    </div>
  );
}

/** Tarjeta tipo "flip" (firma de Costa): el dígito gira en 3D al cambiar. */
function FlipCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex h-20 w-16 items-center justify-center overflow-hidden rounded-[var(--t-radius)] border border-[var(--t-border)] bg-[var(--t-surface)] shadow-sm sm:h-24 sm:w-20">
        <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--t-border)]" aria-hidden />
        <span
          key={value}
          className="countdown-flip font-serif text-4xl font-semibold tabular-nums text-[var(--t-accent)] sm:text-5xl"
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--t-muted)]">{label}</span>
    </div>
  );
}

export function CountdownSection({ wedding, variant }: SectionComponentProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const v = variant ?? "classic";

  useEffect(() => {
    if (!wedding.eventDate) return;
    const update = () => setTimeLeft(diffFromTarget(wedding.eventDate as string));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [wedding.eventDate]);

  if (!wedding.eventDate || !timeLeft) return null;

  const big = v === "full";
  const inline = v === "minimal";
  const flip = v === "flip";

  if (flip) {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto w-full max-w-xl text-center">
          <p className="mb-8 text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Faltan</p>
          <div className="flex justify-center gap-4 sm:gap-6">
            <FlipCard value={timeLeft.days} label="días" />
            <FlipCard value={timeLeft.hours} label="horas" />
            <FlipCard value={timeLeft.minutes} label="min" />
            <FlipCard value={timeLeft.seconds} label="seg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20">
      <div className="mx-auto w-full max-w-xl text-center">
        <p className="mb-8 text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Faltan</p>
        {inline ? (
          <p className="font-serif text-2xl tracking-wider text-[var(--t-text)]">
            {timeLeft.days} <span className="text-sm text-[var(--t-muted)]">días</span>{" "}
            {timeLeft.hours} <span className="text-sm text-[var(--t-muted)]">horas</span>{" "}
            {timeLeft.minutes} <span className="text-sm text-[var(--t-muted)]">min</span>{" "}
            {timeLeft.seconds} <span className="text-sm text-[var(--t-muted)]">seg</span>
          </p>
        ) : (
          <div className="flex justify-center gap-4 sm:gap-6">
            <TimeCard value={timeLeft.days} label="días" big={big} />
            <TimeCard value={timeLeft.hours} label="horas" big={big} />
            <TimeCard value={timeLeft.minutes} label="min" big={big} />
            <TimeCard value={timeLeft.seconds} label="seg" big={big} />
          </div>
        )}
      </div>
    </section>
  );
}
