import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { weddingsRepo } from "@/lib/data";
import { getWeddingPageData } from "@/lib/wedding/render-data";
import { applyExpiryIfDue } from "@/lib/wedding/publish";
import { WeddingRenderer } from "@/components/wedding/WeddingRenderer";
import { JsonLd } from "@/config/seo";
import { APP_NAME, APP_URL } from "@/config/app";

export const dynamic = "force-dynamic";

function weddingDescription(wedding: {
  title: string | null;
  partner1: string;
  partner2: string;
  eventDate: string | null;
  locationName: string | null;
}): string {
  const parts = [`Boda de ${wedding.partner1} & ${wedding.partner2}`];
  if (wedding.eventDate) {
    parts.push(`Fecha: ${new Date(wedding.eventDate).toLocaleDateString("es-CL")}`);
  }
  if (wedding.locationName) {
    parts.push(`Lugar: ${wedding.locationName}`);
  }
  if (wedding.title) {
    parts.push(wedding.title);
  }
  return parts.join(". ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const wedding = weddingsRepo.findBySlug(slug);
  if (!wedding || wedding.status !== "PUBLISHED") {
    return { title: "Boda no publicada", robots: { index: false, follow: false } };
  }
  const title = `${wedding.partner1} & ${wedding.partner2} | Nuestra boda`;
  const description = weddingDescription(wedding);
  return {
    title,
    description,
    alternates: { canonical: `${APP_URL}/w/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: APP_NAME,
      url: `${APP_URL}/w/${slug}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function PublicWeddingPage(
  props: PageProps<"/w/[slug]">,
) {
  const { slug } = await props.params;
  const wedding = weddingsRepo.findBySlug(slug);

  // El paso del tiempo lo aplica el backend al servir la URL (no el cliente).
  if (wedding) applyExpiryIfDue(wedding.id);

  // Solo bodas publicadas son accesibles públicamente (ADR-004).
  if (!wedding) notFound();
  if (wedding.status === "EXPIRED") {
    return (
      <main className="grid min-h-dvh place-items-center bg-neutral-50 px-6">
        <div className="card max-w-md text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
            {APP_NAME}
          </p>
          <h1 className="mt-3 font-serif text-2xl font-semibold">
            Esta invitación ha expirado
          </h1>
          <p className="mt-3 text-neutral-600">
            La publicación de{" "}
            <span className="font-medium">
              {wedding.partner1} & {wedding.partner2}
            </span>{" "}
            venció. Si eres parte del equipo, inicia sesión para renovarla.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-full bg-neutral-900 px-6 py-2.5 text-white hover:bg-neutral-700"
          >
            Entrar
          </Link>
        </div>
      </main>
    );
  }
  if (wedding.status !== "PUBLISHED") {
    notFound();
  }

  const pageData = getWeddingPageData(wedding);

  const places: string[] = [];
  if (wedding.locationName) {
    places.push(`Lugar: ${wedding.locationName}`);
  }
  if (wedding.locationAddress) {
    places.push(wedding.locationAddress);
  }

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Boda de ${wedding.partner1} & ${wedding.partner2}`,
    startDate: wedding.eventDate ? new Date(wedding.eventDate).toISOString() : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: places.join(". ") || wedding.title,
    location: wedding.locationName || wedding.locationAddress
      ? {
          "@type": "Place",
          name: wedding.locationName ?? "Ubicación",
          address: wedding.locationAddress ?? "",
        }
      : undefined,
    url: `${APP_URL}/w/${slug}`,
  };

  return (
    <>
      <JsonLd data={eventSchema as Record<string, unknown>} />
      <WeddingRenderer
        wedding={pageData.wedding}
        template={pageData.template}
        theme={pageData.theme}
        sections={pageData.sections}
        mediaUrls={pageData.mediaUrls}
      />
    </>
  );
}