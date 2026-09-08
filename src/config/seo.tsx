import { APP_NAME, APP_URL } from "@/config/app";

/** Descripción principal del sitio, usada como fallback en metadata. */
export const SITE_DESCRIPTION =
  "Crea una página web profesional para tu matrimonio, sin programar. Elige una plantilla, personaliza con el Web Builder y publica tu boda con RSVP para tus invitados.";

export const SITE_KEYWORDS = [
  "página web para matrimonio",
  "invitación digital de boda",
  "rsvp boda online",
  "sitio web de boda",
  "invitaciones digitales para matrimonio",
  "página de boda gratis",
  "wedding website",
];

/** Title por defecto (landing) y plantilla para el resto de páginas. */
export const SITE_TITLE = `${APP_NAME} — Crea la página web de tu matrimonio`;
export const SITE_TITLE_TEMPLATE = `%s — ${APP_NAME}`;

const ORGANIZATION_NAME = APP_NAME;

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    url: APP_URL,
    description: SITE_DESCRIPTION,
    areaServed: { "@type": "Country", name: "Chile" },
    inLanguage: "es",
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORGANIZATION_NAME,
    url: APP_URL,
    inLanguage: "es-CL",
  };
}

export function serviceSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Página web para tu matrimonio",
    serviceType: "Creador de páginas web para bodas e invitaciones digitales",
    provider: { "@type": "Organization", name: ORGANIZATION_NAME, url: APP_URL },
    areaServed: "LATAM",
    audience: { "@type": "Audience", audienceType: "Parejas que se casan" },
    offers: {
      "@type": "Offer",
      priceCurrency: "CLP",
      price: "29990",
      availability: "https://schema.org/InStock",
    },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; item?: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.item ? { item } : {}),
    })),
  };
}

/** Wrapper reutilizable para inyectar JSON-LD en un componente server. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default JsonLd;