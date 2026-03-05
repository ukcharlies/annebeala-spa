import type { MetadataRoute } from "next";

const baseUrl = "https://annebealaspa.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/services", "/packages", "/reviews", "/contact", "/booking"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
