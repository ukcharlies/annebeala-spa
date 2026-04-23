import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { defaultKeywords, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "Annebeala Spa | Luxury Spa in Lagos, Nigeria",
    template: "%s | Annebeala Spa",
  },
  description:
    "Annebeala Spa is a luxury wellness spa in Lagos, Nigeria offering massage therapy, facials, body rituals, waxing, and curated spa packages.",
  keywords: defaultKeywords,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Annebeala Spa | Luxury Spa in Lagos, Nigeria",
    description:
      "Restore your body and calm your mind with premium spa experiences in Ikeja and Lekki at Annebeala Spa.",
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_NG",
    images: ["/marketting.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Annebeala Spa | Luxury Spa in Lagos, Nigeria",
    description:
      "Luxury massage, facials, wellness rituals, and spa packages in Lagos.",
    images: ["/marketting.png"],
  },
  category: "beauty",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      {
        url: "/PHOTO-2026-03-01-11-52-35.jpg",
        type: "image/jpeg",
      },
    ],
    shortcut: ["/PHOTO-2026-03-01-11-52-35.jpg"],
    apple: [
      {
        url: "/PHOTO-2026-03-01-11-52-35.jpg",
        type: "image/jpeg",
      },
    ],
  },
  other: {
    "geo.region": "NG-LA",
    "geo.placename": "Lagos",
  },
  robots:
    process.env.VERCEL_ENV === "preview"
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18111411746"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18111411746');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-brand-ivory text-brand-charcoal antialiased">
        <Header />
        <main className="flex min-h-[calc(100vh-10rem)] flex-col">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
