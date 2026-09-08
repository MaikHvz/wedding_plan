import type { MetadataRoute } from "next";
import { APP_URL } from "@/config/app";
import { getAllTemplateConfigs } from "@/lib/templates";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_URL.replace(/\/$/, "");
  const templateEntries: MetadataRoute.Sitemap = getAllTemplateConfigs().map(
    (template) => ({
      url: `${base}/plantillas/${template.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }),
  );

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/plantillas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...templateEntries,
  ];
}