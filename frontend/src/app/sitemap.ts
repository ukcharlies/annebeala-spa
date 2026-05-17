import type { MetadataRoute } from "next";
import { siteUnavailable } from "@/lib/availability";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (siteUnavailable) {
    return [];
  }

  const routes = [
    "",
    "/about",
    "/services",
    "/packages",
    "/locations",
    "/reviews",
    "/contact",
    "/booking",
  ];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
