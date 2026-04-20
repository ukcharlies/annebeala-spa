import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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
