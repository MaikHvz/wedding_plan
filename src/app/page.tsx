import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import type { TemplateConfig } from "@/types";
import { getAllTemplateConfigs } from "@/lib/templates";
import { getTemplateDemo } from "@/lib/templates/demos";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { BrowserFrame } from "@/components/templates/BrowserFrame";
import { BackgroundImage } from "@/components/wedding/BackgroundImage";
import { AmbientShader } from "@/components/wedding/AmbientShader";
import { LaurelWreath } from "@/components/wedding/Motifs";
import { APP_NAME } from "@/config/app";
import {
  JsonLd,
  organizationSchema,
  serviceSchema,
  websiteSchema,
} from "@/config/seo";

/** Fotografías reales de las demos, usadas como mosaico ambiental del hero. */
const HERO_MOSAIC_SLUGS = ["elegance", "boho", "urbana", "clasica", "costa"];

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
  },
};

export default function HomePage() {
  const templates = getAllTemplateConfigs();
  const featured = templates.slice(0, 3);

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={serviceSchema()} />
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-serif text-lg font-semibold tracking-tight">
            {APP_NAME}
          </span>
          <nav className="flex items-center gap-5 text-sm">
            <Link
              href="/plantillas"
              className="hidden text-neutral-600 hover:text-neutral-900 sm:block"
            >
              Plantillas
            </Link>
            <Link
              href="/demo"
              className="hidden text-neutral-600 hover:text-neutral-900 sm:block"
            >
              Ver demo
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-neutral-900 px-4 py-1.5 text-white hover:bg-neutral-700"
            >
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — mosaico de bodas reales (demos) + ambientación del producto */}
      <section
        style={
          {
            "--t-accent": "#b98a5e",
            "--t-accent-soft": "#e9d9c8",
          } as CSSProperties
        }
        className="relative isolate overflow-hidden px-6 pt-24 pb-24 text-center text-white sm:pt-32 sm:pb-32"
      >
        <HeroMosaic />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/55 to-black/80" />
        <AmbientShader templateId="boho" onImage className="opacity-80" />

        <div className="relative">
          <LaurelWreath className="hero-in mx-auto h-8 w-28 text-white/70" />
          <p className="hero-in mt-5 text-sm uppercase tracking-[0.3em] text-white/70">
            Tu página de boda, lista en minutos
          </p>
          <h1 className="hero-in mx-auto mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-balance sm:text-6xl">
            Tu boda merece una página{" "}
            <span className="text-white/60">tan bonita como el día</span>
          </h1>
          <p className="hero-in mx-auto mt-6 max-w-xl text-pretty text-lg text-white/85">
            Elige una plantilla, personaliza cada detalle con el editor visual
            y comparte la URL con tus invitados. Sin programar y sin límites:
            solo pagas cuando la quieres publicar.
          </p>
          <div className="hero-in mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="min-w-44 rounded-full bg-white px-8 py-3 font-medium text-neutral-900 hover:bg-neutral-100"
            >
              Crear gratis
            </Link>
            <Link
              href="/plantillas"
              className="min-w-44 rounded-full border border-white/50 px-8 py-3 font-medium text-white hover:border-white"
            >
              Explorar plantillas
            </Link>
          </div>
          <p className="hero-in mt-6 text-xs text-white/60">
            Pago único al publicar · Tus datos siempre contigo
          </p>
        </div>
      </section>

      {/* Previews destacados */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featured.map((template) => (
            <FeaturedTemplate key={template.slug} template={template} />
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <HowItWorks />

      {/* Catálogo */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <SectionHeader
          eyebrow="Plantillas"
          title="Diseñadas por parejas profesionales, listas para ti"
          description="Estructuras únicas y paletas que se recolorizan en un clic. Cada plantilla incluye su demo completa."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Link
              key={template.slug}
              href={`/plantillas/${template.slug}`}
              className="group flex flex-col gap-3"
            >
              <BrowserFrame>
                <TemplatePreview template={template} themeId={previewThemeId(template)} />
              </BrowserFrame>
              <div>
                <p className="font-serif text-sm font-semibold">
                  {template.name}
                </p>
                <p className="text-xs text-neutral-500">{template.category}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/plantillas"
            className="inline-block rounded-full border border-neutral-300 px-8 py-3 font-medium hover:border-neutral-900"
          >
            Ver todas las plantillas
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-black/5 bg-white px-6 py-16">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeader
            eyebrow={`Por qué ${APP_NAME}`}
            title="Todo lo que tu invitación digital necesita"
            description="Un solo lugar para crear, personalizar y compartir tu boda."
          />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Editor visual sin código"
              text="Cambia nombres, fechas, fotos y textos desde un panel sencillo. El diseño siempre queda impecable."
            />
            <FeatureCard
              title="Recolor en un clic"
              text="Elige la paleta de tu ceremonia: cada plantilla se repinta completa sin perder su estilo."
            />
            <FeatureCard
              title="Vista responsive"
              text="Comprueba cómo se ve en tu celular, tablet o escritorio antes de compartirla."
            />
            <FeatureCard
              title="Demo siempre disponible"
              text="Cada plantilla muestra una boda de ejemplo completa, con fotos y textos reales de muestra."
            />
            <FeatureCard
              title="URL pública con tu identidad"
              text="Cuando la publicas, tus invitados ven /w/tu-boda — limpia, sin publicidad y sin tu cuenta."
            />
            <FeatureCard
              title="Pago único, transparente"
              text="Crear y personalizar es gratis. Solo pagas una vez al publicar, sin suscripciones ocultas."
            />
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <SectionHeader eyebrow="Testimonios" title="Parejas que ya celebraron con nosotros" />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Testimonial
            quote="En media tarde teníamos la página armada. Los invitados no paraban de comentar lo linda que estaba."
            author="Javiera & Nicolás"
            detail="Boda en la Hacienda — marzo 2027"
          />
          <Testimonial
            quote="Cambiamos de tema en un clic cuando decidimos el color de la decoración. Súper fácil."
            author="Camila & Rodrigo"
            detail="Fiesta en el jardín — noviembre 2027"
          />
          <Testimonial
            quote="Publicamos el día antes y fue un éxito: todo el mundo encontró la dirección y el horario al toque."
            author="María & Tomás"
            detail="Ceremonia al aire libre — octubre 2027"
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-black/5 px-6 py-16">
        <div className="mx-auto w-full max-w-4xl">
          <SectionHeader
            eyebrow="Precios"
            title="Simple y honesto"
            description="Sin sorpresas: empieza gratis y paga solo una vez cuando publicas."
          />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <PricingCard
              name="Boda gratis"
              price="0"
              suffix="CLP"
              description="Ideal para armar tu página con calma."
              features={[
                "Todas las plantillas y demos",
                "Editor visual completo",
                "Vista responsive y preview",
                "Cambios ilimitados",
              ]}
              cta="Comenzar gratis"
              href="/login"
              highlight={false}
            />
            <PricingCard
              name="Página publicada"
              price="29.990"
              suffix="CLP · pago único"
              description="Todo lo de gratis más tu boda en una URL pública, lista para compartir durante un año."
              features={[
                "Todo el plan gratis",
                "URL pública /w/tu-boda",
                "Gestión de invitados + RSVP",
                "Invitaciones digitales",
                "Sin publicidad ni branding",
                "Pago único por 365 días",
              ]}
              cta="Crear mi página"
              href="/login"
              highlight
            />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 pb-20">
        <div className="mx-auto w-full max-w-6xl rounded-2xl bg-neutral-900 px-8 py-14 text-center text-white">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            El día ya se acerca.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-300">
            Empieza hoy con una plantilla gratuita y personalízala a tu ritmo.
            Cuando esté lista, publícala.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/plantillas"
              className="rounded-full bg-white px-8 py-3 font-medium text-neutral-900 hover:bg-neutral-100"
            >
              Ver plantillas
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/40 px-8 py-3 font-medium hover:border-white"
            >
              Crear gratis
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 px-6 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-serif text-sm font-semibold">
            {APP_NAME}
          </span>
          <nav className="flex items-center gap-5 text-sm text-neutral-600">
            <Link href="/plantillas" className="hover:text-neutral-900">
              Plantillas
            </Link>
            <Link href="/demo" className="hover:text-neutral-900">
              Demo
            </Link>
            <Link href="/login" className="hover:text-neutral-900">
              Acceso
            </Link>
          </nav>
          <p className="text-xs text-neutral-400">
            Crea, personaliza y celebra.
          </p>
        </div>
      </footer>
    </main>
  );
}

/** Mosaico de fondo del hero: fotos reales de cada ambientación de boda,
 * con Ken Burns en la imagen central para dar movimiento sin distraer. */
function HeroMosaic() {
  const images = HERO_MOSAIC_SLUGS.map((slug) => ({
    slug,
    src: getTemplateDemo(slug)?.data?.hero?.image as string | undefined,
  })).filter((item) => Boolean(item.src));

  if (images.length === 0) {
    return <div className="absolute inset-0 -z-20 bg-neutral-900" />;
  }

  return (
    <div className="absolute inset-0 -z-20 grid grid-cols-2 gap-[2px] sm:grid-cols-5">
      {images.map((item, index) => (
        <div
          key={item.slug}
          className={`relative overflow-hidden ${index === 0 ? "col-span-2 sm:col-span-1" : ""}`}
        >
          <BackgroundImage src={item.src} kenBurns={index === 2} lazy={index > 1} />
        </div>
      ))}
    </div>
  );
}

function FeaturedTemplate({ template }: { template: TemplateConfig }) {
  return (
    <Link href={`/plantillas/${template.slug}`} className="group relative block">
      <BrowserFrame url={`tuboda.cl/w/${template.slug}`}>
        <TemplatePreview template={template} themeId={previewThemeId(template)} />
      </BrowserFrame>
    </Link>
  );
}

/** Muestra en la landing la segunda paleta sugerida (para que no se vea todo
 * con el mismo color por defecto). */
function previewThemeId(template: TemplateConfig): string {
  return template.suggestedThemeIds?.[1] ?? template.themeId;
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl font-semibold text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-neutral-600">{description}</p> : null}
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Elige tu plantilla",
      text: "Explora el catálogo, mira las demos completas y elige el estilo que combine con tu ceremonia.",
    },
    {
      n: "02",
      title: "Personalízala",
      text: "Edita textos, fotos, secciones y colores desde el editor visual. Es gratis e ilimitado.",
    },
    {
      n: "03",
      title: "Publica y comparte",
      text: "Cuando esté lista, publica tu página y comparte la URL con todos tus invitados.",
    },
  ];
  return (
    <section className="border-y border-black/5 bg-white px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Cómo funciona"
          title="De cero a tu página publicada en 3 pasos"
        />
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="relative text-center sm:text-left">
              <p className="font-serif text-5xl font-semibold text-neutral-200">
                {step.n}
              </p>
              <h3 className="mt-3 font-serif text-xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-6">
      <h3 className="font-serif text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-neutral-600">{text}</p>
    </div>
  );
}

function Testimonial({
  quote,
  author,
  detail,
}: {
  quote: string;
  author: string;
  detail: string;
}) {
  return (
    <figure className="rounded-xl border border-neutral-200 bg-white p-6">
      <blockquote className="text-neutral-700">“{quote}”</blockquote>
      <figcaption className="mt-4 border-t border-neutral-100 pt-4">
        <p className="font-serif text-sm font-semibold">{author}</p>
        <p className="text-xs text-neutral-500">{detail}</p>
      </figcaption>
    </figure>
  );
}

function PricingCard({
  name,
  price,
  suffix,
  description,
  features,
  cta,
  href,
  highlight,
}: {
  name: string;
  price: string;
  suffix: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-7 ${
        highlight
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white"
      }`}
    >
      <h3 className="font-serif text-lg font-semibold">{name}</h3>
      <p className={`mt-1 text-3xl font-semibold`}>
        {price}{" "}
        <span className={`text-sm font-normal ${highlight ? "text-neutral-400" : "text-neutral-500"}`}>
          {suffix}
        </span>
      </p>
      <p className={`mt-3 text-sm ${highlight ? "text-neutral-300" : "text-neutral-600"}`}>
        {description}
      </p>
      <ul className={`mt-6 flex flex-col gap-2 text-sm`}>
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span
              aria-hidden
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                highlight ? "bg-white/15 text-white" : "bg-neutral-100 text-neutral-600"
              }`}
            >
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-8 rounded-full px-6 py-2.5 text-center text-sm font-medium ${
          highlight
            ? "bg-white text-neutral-900 hover:bg-neutral-100"
            : "border border-neutral-300 hover:border-neutral-900"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}