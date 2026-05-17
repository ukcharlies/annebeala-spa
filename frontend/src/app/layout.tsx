import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";
import {
  serverFeeUnpaid,
  siteUnavailable,
  supportFeeUnpaid,
} from "@/lib/availability";
import { defaultKeywords, siteName, siteUrl } from "@/lib/site";

const unavailableReason = serverFeeUnpaid
  ? {
      label: "404 error",
      title: "This page cannot be found.",
      message:
        "The requested service is currently unavailable or may have moved. Please try again later.",
    }
  : supportFeeUnpaid
    ? {
        label: "Service interruption",
        title: "We are experiencing temporary glitches.",
        message:
          "Some parts of the website are not responding correctly. Please refresh or check back shortly.",
      }
    : null;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  manifest: "/manifest.webmanifest",
  title: siteUnavailable
    ? "Page Not Found"
    : {
        default: "Annebeala Spa | Luxury Spa in Lagos, Nigeria",
        template: "%s | Annebeala Spa",
      },
  description: siteUnavailable
    ? "The requested page could not be found."
    : "Annebeala Spa is a luxury wellness spa in Lagos, Nigeria offering massage therapy, facials, body rituals, waxing, and curated spa packages.",
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
    siteUnavailable || process.env.VERCEL_ENV === "preview"
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
  const pageContent =
    siteUnavailable && unavailableReason ? (
      <UnavailablePage reason={unavailableReason} />
    ) : (
      children
    );

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
        {siteUnavailable ? null : <Header />}
        <main className="flex min-h-[calc(100vh-10rem)] flex-col">
          {pageContent}
        </main>
        {siteUnavailable ? null : <Footer />}
        {siteUnavailable ? null : <VisitTracker />}
      </body>
    </html>
  );
}

function UnavailablePage({
  reason,
}: {
  reason: {
    label: string;
    title: string;
    message: string;
  };
}) {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl border border-brand-olive/35 bg-brand-ivory px-6 py-10 text-center shadow-sm sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-forest">
          {reason.label}
        </p>
        <h1 className="mt-4 text-4xl text-brand-charcoal sm:text-5xl">
          {reason.title}
        </h1>
        <p className="mt-5 text-base leading-7 text-brand-olive">
          {reason.message}
        </p>
      </div>
    </section>
  );
}
