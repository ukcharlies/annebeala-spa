import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://annebealaspa.com.ng";
const DEFAULT_OG_IMAGE = "/marketting.png";

const normalizeSiteUrl = (value?: string) => {
  if (!value) {
    return FALLBACK_SITE_URL;
  }

  try {
    const url = new URL(value);
    return url.toString().replace(/\/$/, "");
  } catch {
    return FALLBACK_SITE_URL;
  }
};

export const siteName = "Annebeala Spa";
export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL,
);
export const siteOrigin = new URL(siteUrl).origin;
export const defaultOgImage = DEFAULT_OG_IMAGE;
export const instagramUrl = "https://www.instagram.com/annebeala_spa/";
export const defaultKeywords = [
  "Annebeala Spa",
  "spa in Lagos",
  "spa in Lekki",
  "spa in Ikeja",
  "luxury spa in Lagos",
  "massage in Lagos",
  "facials in Lagos",
  "body treatments in Lagos",
  "pedicure and manicure in Lagos",
  "waxing in Lagos",
  "teeth whitening in Lagos",
  "spa packages in Lagos",
];

export const toAbsoluteUrl = (path = "/") => new URL(path, siteUrl).toString();

type PageMetadataConfig = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export const buildPageMetadata = ({
  title,
  description,
  path,
  keywords = [],
}: PageMetadataConfig): Metadata => ({
  title,
  description,
  keywords: [...defaultKeywords, ...keywords],
  alternates: {
    canonical: path,
  },
  openGraph: {
    title,
    description,
    url: path,
    siteName,
    locale: "en_NG",
    type: "website",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultOgImage],
  },
});
