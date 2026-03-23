import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://annebealaspa.com"),
  title: {
    default: "Annebeala Spa | Luxury Spa in Lagos",
    template: "%s | Annebeala Spa",
  },
  description:
    "Annebeala Spa is a luxury wellness spa in Lagos offering massage therapy, facials, body rituals, and curated spa packages.",
  keywords: [
    "Annebeala Spa",
    "spa in Lagos",
    "luxury spa",
    "massage",
    "facials",
    "wellness packages",
  ],
  openGraph: {
    title: "Annebeala Spa | Luxury Spa in Lagos",
    description:
      "Restore your body and calm your mind with premium spa experiences at Annebeala Spa.",
    url: "https://annebealaspa.com",
    siteName: "Annebeala Spa",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Annebeala Spa | Luxury Spa in Lagos",
    description:
      "Luxury massage, facials, and wellness rituals tailored for deep relaxation.",
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
