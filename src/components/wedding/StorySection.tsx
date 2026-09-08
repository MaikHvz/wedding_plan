/* eslint-disable @next/next/no-img-element */

import type { SectionComponentProps } from "./WeddingRenderer";
import type { SectionDataMap } from "@/types";

/** Primera frase del contenido (para pull-quote). */
function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?…](?:\s|$)/);
  return match?.[0].trim() ?? text.trim();
}

/** Resto del contenido después de la primera frase (si aplica). */
function restOf(text: string): string {
  const sentence = firstSentence(text);
  const rest = text.slice(sentence.length);
  return rest.trim();
}

export function StorySection({ data, variant }: SectionComponentProps) {
  const story = data as SectionDataMap["story"];
  if (!story.title && !story.content && !story.image) {
    return null;
  }
  const v = variant ?? "classic";

  if (v === "minimal") {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Nuestra historia</p>
          {story.title && <h2 className="mb-6 font-serif text-3xl font-semibold">{story.title}</h2>}
          {story.content && (
              <p className="whitespace-pre-line text-pretty text-lg leading-relaxed text-[var(--t-muted)] italic">
                &ldquo;{story.content}&rdquo;
              </p>
          )}
        </div>
      </section>
    );
  }

  if (v === "editorial") {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 sm:grid-cols-[1fr_1.3fr]">
          {story.image && (
            <img src={story.image} alt={story.title || "Historia"} className="aspect-[4/5] w-full rounded-[var(--t-radius)] object-cover" />
          )}
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Nuestra historia</p>
            {story.title && <h2 className="mb-5 font-serif text-3xl font-semibold">{story.title}</h2>}
            {story.content && (
              <div className="space-y-5">
                <p className="font-serif text-2xl font-light italic leading-relaxed text-[var(--t-accent)] sm:text-[1.7rem]">
                  &ldquo;{firstSentence(story.content)}&rdquo;
                </p>
                {restOf(story.content) && (
                  <p className="whitespace-pre-line text-pretty leading-relaxed text-[var(--t-muted)]">
                    {restOf(story.content)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (v === "timeline") {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto w-full max-w-3xl">
          <p className="mb-12 text-center text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Nuestra historia</p>
          <div className="relative border-l border-[var(--t-accent-soft)] pl-8">
            {story.title && (
              <div className="relative mb-8">
                <span className="absolute -left-8 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--t-accent)]" />
                <h2 className="font-serif text-2xl font-semibold">{story.title}</h2>
              </div>
            )}
            {story.content && (
              <div className="relative mb-8">
                <span className="absolute -left-8 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--t-accent-soft)] border border-[var(--t-accent)]" />
                <p className="whitespace-pre-line text-pretty leading-relaxed text-[var(--t-muted)]">{story.content}</p>
              </div>
            )}
            {story.image && (
              <div className="relative">
                <span className="absolute -left-8 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--t-accent)]" />
                <img src={story.image} alt={story.title || "Historia"} className="mt-2 aspect-[4/3] w-full rounded-[var(--t-radius)] object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // classic (default) — 2 columns, primer párrafo con letra capital decorada
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 items-center gap-10 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Nuestra historia</p>
          {story.title && <h2 className="font-serif text-3xl font-semibold">{story.title}</h2>}
        </div>
        <div>
          {story.content && (
            <p className="lead-drop-cap whitespace-pre-line text-pretty leading-relaxed text-[var(--t-muted)] max-w-prose">
              {story.content}
            </p>
          )}
          {story.image && (
            <img src={story.image} alt={story.title || "Historia"} className="mt-6 aspect-[4/3] w-full rounded-[var(--t-radius)] object-cover" />
          )}
        </div>
      </div>
    </section>
  );
}
