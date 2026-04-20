import type { MetadataRoute } from "next";
import { siteName } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description:
      "Luxury spa treatments, facials, massage therapy, and wellness packages in Ikeja and Lekki, Lagos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6efe3",
    theme_color: "#24443a",
    categories: ["beauty", "health", "lifestyle", "wellness"],
    icons: [
      {
        src: "/PHOTO-2026-03-01-11-52-35.jpg",
        sizes: "864x1080",
        type: "image/jpeg",
      },
    ],
  };
}
