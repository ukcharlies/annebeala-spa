import type { MetadataRoute } from "next";
import { siteUnavailable } from "@/lib/availability";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (siteUnavailable) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      host: siteUrl,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
