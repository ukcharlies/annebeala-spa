import type { Metadata } from "next";
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
    canonical: "/",
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
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
      <body className="min-h-screen bg-brand-ivory text-brand-charcoal antialiased">
        <Header />
        <main className="flex min-h-[calc(100vh-10rem)] flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
