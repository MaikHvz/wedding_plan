import type { MetadataRoute } from "next";
import { APP_URL } from "@/config/app";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/dashboard", "/admin", "/invitacion"],
    },
    sitemap: `${APP_URL.replace(/\/$/, "")}/sitemap.xml`,
  };
}